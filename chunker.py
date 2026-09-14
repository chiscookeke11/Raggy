from pathlib import Path


def chunk_text(
    text,
    chunk_size=200,
    overlap=50,
    min_chunk_size=50
):
    chunks = []

    start = 0

    while start < len(text):

        end = min(start + chunk_size, len(text))

        # Move the end backward to a word boundary
        if end < len(text):
            while end > start and not text[end - 1].isspace():
                end -= 1

        # Check how much text remains
        remaining = len(text) - start

        # Merge tiny final fragments into the previous chunk
        if remaining < min_chunk_size and chunks:
            chunks[-1] += text[start:]
            break

        chunk = text[start:end]
        chunks.append(chunk)

        # Calculate next start from the actual end
        start = end - overlap

        # Move forward to a word boundary
        while start < len(text) and not text[start].isspace():
            start += 1

        # Skip whitespace
        while start < len(text) and text[start].isspace():
            start += 1

    return chunks


def chunk_corpus(
    corpus_dir="corpus",
    chunk_size=200,
    overlap=50,
    min_chunk_size=50
):
    corpus_path = Path(corpus_dir)

    all_chunks = []

    for file in corpus_path.glob("*.md"):
        try:
            text = file.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError) as error:
            print(f"Could not read {file.name}: {error}")
            continue

        chunks = chunk_text(
            text,
            chunk_size=chunk_size,
            overlap=overlap,
            min_chunk_size=min_chunk_size
        )

        for chunk_index, chunk in enumerate(chunks):
            all_chunks.append({
                "document": file.name,
                "chunk_index": chunk_index,
                "text": chunk
            })

    return all_chunks