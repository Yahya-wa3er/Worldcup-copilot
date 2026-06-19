from app.rag.vector_store import vector_store


class RAGService:

    def retrieve(self, query: str, top_k: int = 3) -> str:
        """
        Récupère le contexte pertinent pour une question.
        Retourne un texte formaté à injecter dans le prompt LLM.
        """
        results = vector_store.search(query, top_k=top_k)

        if not results:
            return ""

        context = "Informations pertinentes :\n\n"
        for i, doc in enumerate(results, 1):
            context += f"{i}. {doc}\n\n"

        return context


rag_service = RAGService()