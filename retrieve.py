import sys
import itertools
import threading
import time

import numpy as np
from sentence_transformers import SentenceTransformer

from chunker import chunk_corpus


# Terminal spinner
def show_spinner(message, stop_event):
    spinner = itertools.cycle(["|", "/", "-", "\\"])

    while not stop_event.is_set():
        print(
            f"\r{next(spinner)} {message}",
            end="",
            flush=True
        )
        time.sleep(0.1)

    print(f"\r✓ {message}")


def run_with_spinner(message, function):
    stop_event = threading.Event()

    spinner_thread = threading.Thread(
        target=show_spinner,
        args=(message, stop_event)
    )

    spinner_thread.start()

    try:
        result = function()
    finally:
        stop_event.set()
        spinner_thread.join()

    return result


# Load the model once
model = run_with_spinner(
    "Loading model...",
    lambda: SentenceTransformer("all-MiniLM-L6-v2")
)


# Get all chunks
chunks = chunk_corpus()


# Encode every chunk
def encode_chunks():
    for chunk in chunks:
        chunk["vector"] = model.encode(chunk["text"])


run_with_spinner(
    "Embedding chunks...",
    encode_chunks
)


# Get the user's query from the command line
if len(sys.argv) < 2:
    print("Usage: python retrieve.py \"your question\"")
    print(
        'Example: python retrieve.py '
        '"who won the race between the tortoise and the hare?"'
    )
    sys.exit(0)


query = " ".join(sys.argv[1:])


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
print(f"\nQuery: {query}\n")

for rank, chunk in enumerate(ranked_chunks[:3], start=1):
    print(f"Rank {rank}")
    print(f"Score: {chunk['score']:.4f}")
    print(f"Document: {chunk['document']}")
    print(f"Chunk: {chunk['chunk_index']}")
    print(f"Text: {chunk['text']}")
    print("-" * 80)