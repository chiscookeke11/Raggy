from sentence_transformers import SentenceTransformer
from chunker import chunk_corpus




# load the model once
model =  SentenceTransformer("all-MiniLM-L6-v2")

# Get all chunks
chunks = chunk_corpus()



# Encode every chunk
for chunk in chunks:
    chunk["vector"] = model.encode(chunk["text"])


# Print results
print(f"Total chunks: {len(chunks)}")

if chunks:
    vector_dimension = len(chunks[0]["vector"])

    print(f"Vector dimension: {vector_dimension}")

    print(
        f"First chunk vector (first 5 numbers): "
        f"{chunks[0]['vector'][:5]}"
    )