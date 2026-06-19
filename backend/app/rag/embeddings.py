from sentence_transformers import SentenceTransformer
import numpy as np

# Modèle léger et efficace
MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"

class EmbeddingService:

    def __init__(self):
        self._model = None

    @property
    def model(self):
        if self._model is None:
            print("Chargement du modèle d'embeddings...")
            self._model = SentenceTransformer(MODEL_NAME)
            print("Modèle chargé !")
        return self._model

    def embed_text(self, text: str) -> np.ndarray:
        """Transforme un texte en vecteur."""
        return self.model.encode(text, normalize_embeddings=True)

    def embed_texts(self, texts: list) -> np.ndarray:
        """Transforme une liste de textes en vecteurs."""
        return self.model.encode(texts, normalize_embeddings=True)

embedding_service = EmbeddingService()