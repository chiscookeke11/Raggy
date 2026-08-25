import numpy as np
from sentence_transformers import SentenceTransformer

from chunker import chunk_corpus


# Load the model once
model = SentenceTransformer("all-MiniLM-L6-v2")


# Get all chunks
chunks = chunk_corpus()


# Encode every chunk
for chunk in chunks:
    chunk["vector"] = model.encode(chunk["text"])


# The user's query
query = "the tortoise wins the race by being steady"


# Encode the query
query_vector = model.encode(query)


def cosine_similarity(a, b):
    dot_product = np.dot(a, b)

    magnitude_a = np.linalg.norm(a)
    magnitude_b = np.linalg.norm(b)

    return dot_product / (magnitude_a * magnitude_b)


# Calculate similarity for every chunk
for chunk in chunks:
    chunk["score"] = cosine_similarity(
        query_vector,
        chunk["vector"]
    )


# Rank chunks from highest score to lowest
ranked_chunks = sorted(
    chunks,
    key=lambda chunk: chunk["score"],
    reverse=True
)


# Print the top 3
print(f"Query: {query}\n")

for rank, chunk in enumerate(ranked_chunks[:3], start=1):
    print(f"Rank {rank}")
    print(f"Score: {chunk['score']:.4f}")
    print(f"Document: {chunk['document']}")
    print(f"Chunk: {chunk['chunk_index']}")
    print(f"Text: {chunk['text']}")
    print("-" * 80)