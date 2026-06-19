import faiss
import numpy as np
import json
import os
from app.rag.embeddings import embedding_service

INDEX_PATH = "rag_index/index.faiss"
DOCS_PATH = "rag_index/documents.json"


class VectorStore:

    def __init__(self):
        self.index = None
        self.documents = []

    def build_index(self, texts: list[str]):
        """Construit l'index FAISS depuis une liste de textes."""
        print(f"Construction de l'index avec {len(texts)} documents...")

        # Générer les embeddings
        vectors = embedding_service.embed_texts(texts)
        dimension = vectors.shape[1]

        # Créer l'index FAISS
        self.index = faiss.IndexFlatIP(dimension)  # Inner Product = cosine similarity
        self.index.add(vectors.astype(np.float32))
        self.documents = texts

        # Sauvegarder
        os.makedirs("rag_index", exist_ok=True)
        faiss.write_index(self.index, INDEX_PATH)
        with open(DOCS_PATH, "w") as f:
            json.dump(texts, f)

        print(f"Index construit et sauvegardé !")

    def load_index(self):
        """Charge l'index depuis le disque."""
        if os.path.exists(INDEX_PATH) and os.path.exists(DOCS_PATH):
            self.index = faiss.read_index(INDEX_PATH)
            with open(DOCS_PATH, "r") as f:
                self.documents = json.load(f)
            print(f"Index chargé : {len(self.documents)} documents")
            return True
        return False

    def search(self, query: str, top_k: int = 3) -> list[str]:
        """Recherche les documents les plus pertinents."""
        if self.index is None:
            return []

        query_vector = embedding_service.embed_text(query)
        query_vector = np.array([query_vector]).astype(np.float32)

        scores, indices = self.index.search(query_vector, top_k)

        results = []
        for idx in indices[0]:
            if idx != -1:
                results.append(self.documents[idx])
        return results


vector_store = VectorStore()