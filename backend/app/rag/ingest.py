import os
from app.rag.vector_store import vector_store
import re

def chunk_text(text: str, chunk_size: int = 200) -> list[str]:
    """
    Découpe un texte en respectant les frontières naturelles.
    Priorité : sections "Team: X" > paragraphes > fallback mots.
    """
    # Cas 1 — fichier structuré par équipes ("Team: Brazil ...")
    if re.search(r"\bTeam:\s", text):
        # Découpe juste avant chaque "Team:" en gardant le marqueur
        parts = re.split(r"(?=\bTeam:\s)", text)
        chunks = [p.strip() for p in parts if p.strip()]
        return chunks

    # Cas 2 — fichier avec des paragraphes séparés par double saut de ligne
    if "\n\n" in text:
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        # Regroupe les petits paragraphes pour éviter des chunks trop courts
        chunks = []
        buffer = ""
        for p in paragraphs:
            if len((buffer + " " + p).split()) <= chunk_size:
                buffer = (buffer + " " + p).strip()
            else:
                if buffer:
                    chunks.append(buffer)
                buffer = p
        if buffer:
            chunks.append(buffer)
        return chunks

    # Cas 3 — fallback : découpe par mots (comportement précédent)
    words = text.split()
    chunks = []
    current_chunk = []
    current_size = 0
    for word in words:
        current_chunk.append(word)
        current_size += 1
        if current_size >= chunk_size:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            current_size = 0
    if current_chunk:
        chunks.append(" ".join(current_chunk))
    return chunks


def load_documents(folder: str) -> list[str]:
    """Charge tous les fichiers .txt d'un dossier."""
    chunks = []
    for filename in os.listdir(folder):
        if filename.endswith(".txt"):
            filepath = os.path.join(folder, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                text = f.read()
            file_chunks = chunk_text(text)
            chunks.extend(file_chunks)
            print(f"Chargé : {filename} → {len(file_chunks)} chunks")
    return chunks


def run_ingestion():
    """Lance l'ingestion de tous les documents."""
    print("Démarrage de l'ingestion...")
    all_chunks = []

    datasets_path = "../datasets"
    folders = ["stadiums", "teams", "travel_guides", "fifa_faq","history"]

    for folder in folders:
        path = os.path.join(datasets_path, folder)
        if os.path.exists(path):
            chunks = load_documents(path)
            all_chunks.extend(chunks)

    if all_chunks:
        vector_store.build_index(all_chunks)
        print(f"Ingestion terminée : {len(all_chunks)} chunks indexés")
    else:
        print("Aucun document trouvé !")


if __name__ == "__main__":
    run_ingestion()