import sys
import itertools
import threading
import time

import numpy as np
from sentence_transformers import SentenceTransformer

from chunker import chunk_corpus


# Get the user's query before doing expensive work
if len(sys.argv) < 2:
    print("Usage: python retrieve.py \"your question\"")
    print(
        'Example: python retrieve.py '
        '"who won the race between the tortoise and the hare?"'
    )
    sys.exit(2)

query = " ".join(sys.argv[1:])


# Terminal spinner
def show_spinner(message, stop_event):
    spinner = itertools.cycle(["|", "/", "-", "\\"])

    while not stop_event.is_set():
        print(
            f"\r{next(spinner)} {message}",
            end="",
            flush=True,
            file=sys.stderr
        )
        time.sleep(0.1)

    print(
        f"\r✓ {message}",
        file=sys.stderr
    )


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


# Encode the query
query_vector = model.encode(query)