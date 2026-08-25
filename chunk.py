from chunker import chunk_corpus



chunk = chunk_corpus(
    corpus_dir="corpus",
    chunk_size=200,
    overlap=50,
    min_chunk_size=50
)


for chunk in chunks:
    print(
        f"{chunk['document']} | "
        f"chunk {chunk['chunk_index']} | "
        f"{chunk['text'][:60]}"
    )


print(f"\nTotal chunks: {len(chunks)}")
