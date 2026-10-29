import sqlite3
from contextlib import contextmanager
from app.core.config import settings

SCHEMA = """
CREATE TABLE IF NOT EXISTS documents (
    id            TEXT PRIMARY KEY,
    filename      TEXT NOT NULL,
    file_type     TEXT NOT NULL,
    size_bytes    INTEGER NOT NULL,
    page_count    INTEGER NOT NULL DEFAULT 0,
    chunk_count   INTEGER NOT NULL DEFAULT 0,
    embedded_count INTEGER NOT NULL DEFAULT 0,
    status        TEXT NOT NULL DEFAULT 'processing',   -- processing | ready | failed
    current_stage TEXT NOT NULL DEFAULT 'uploaded',
    stage_timings TEXT NOT NULL DEFAULT '{}',           -- JSON: {"chunking": 12.4, ...} in ms
    error         TEXT,
    created_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chunks (
    id            TEXT PRIMARY KEY,
    document_id   TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index   INTEGER NOT NULL,
    page          INTEGER NOT NULL,
    text          TEXT NOT NULL,
    char_count    INTEGER NOT NULL,
    token_count   INTEGER NOT NULL,
    embedding_dim INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_chunks_doc ON chunks(document_id);

CREATE TABLE IF NOT EXISTS chats (
    id         TEXT PRIMARY KEY,
    question   TEXT NOT NULL,
    answer     TEXT NOT NULL,
    trace      TEXT NOT NULL,   -- the full RetrievalTrace as JSON
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
"""


@contextmanager
def get_db():
    conn = sqlite3.connect(settings.db_path)
    conn.row_factory = sqlite3.Row                 # rows behave like dicts
    conn.execute("PRAGMA foreign_keys = ON")       # SQLite ignores FKs unless you ask
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()



def _migrate(conn: sqlite3.Connection) -> None:
    columns = {row["name"] for row in conn.execute("PRAGMA table_info(documents)")}
    if "embedded_count" not in columns:
        conn.execute("ALTER TABLE documents ADD COLUMN embedded_count INTEGER NOT NULL DEFAULT 0")


def init_db() -> None:
    settings.upload_dir.mkdir(parents=True, exist_ok=True)
    settings.chroma_dir.mkdir(parents=True, exist_ok=True)
    with get_db() as conn:
        conn.executescript(SCHEMA)
        _migrate(conn)
        # Any job still marked "processing" at startup was killed mid-run.
        conn.execute(
            "UPDATE documents SET status = 'failed', "
            "error = 'Interrupted by a server restart. Delete this document and upload it again.' "
            "WHERE status = 'processing'"
        )