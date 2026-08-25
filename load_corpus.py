from pathlib import Path


corpus_dir = Path("corpus")

total_documents = 0
total_characters = 0

for file in corpus_dir.glob("*.md"):
    text = file.read_text(encoding="utf-8")

    character_count = len(text)

    print(f"{file.name}: {character_count} characters")

    total_documents += 1
    total_characters += character_count


print(f"\nTotal documents: {total_documents}")
print(f"\nTotal characters: {total_characters}")