from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2] # ..../backend


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_prefix="RAG_", extra="ignore")


    app_name: str = "Raggy"
    data_dir: Path = BASE_DIR / "data"


    ollama_host: str = "http://localhost:11434"
    embedding_model: str = "nomic-embed-text"
    llm_model: str = "qwen3:4b"

    chunk_size: int = 800
    chunk_overlap: int = 120
    top_k: int = 5
    max_upload_mb: int = 25

    temperature: float = 0.2    # low = more faithful to the context
    num_ctx: int = 4096         # context window we ask Ollama to use (in tokens)





    @property
    def upload_dir(self) -> Path:
        return self.data_dir / "uploads"


    @property
    def chroma_dir(self) -> Path:
        return self.data_dir / "chroma"


    @property
    def db_path(self) -> Path:
        return self.data_dir / "rag.db"


settings = Settings()