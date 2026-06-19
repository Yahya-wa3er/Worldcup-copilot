# WorldCup Copilot 2026

Assistant IA full-stack pour la FIFA World Cup 2026.

## Stack
- **Backend** : FastAPI, PostgreSQL, Redis, Docker
- **IA** : LangChain, FAISS, Groq API (Llama-3.3-70B), RAG multilingue
- **Frontend** : Next.js 16, TailwindCSS v4, Framer Motion

## Fonctionnalités
- Chat IA avec données live (scores, classements, prochains matchs)
- RAG sur datasets custom (48 équipes, stades, FAQ FIFA, historique WC)
- Calendrier filtrable, classements par groupe
- Estimateur de budget voyage par ville hôte
- Countdown vers le prochain match

## Lancement rapide

### Prérequis
- Docker & Docker Compose
- Python 3.12
- Node.js 18+
- Compte Groq (gratuit) : https://console.groq.com

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # remplis les clés API
docker compose -f ../docker/docker-compose.yml up -d
python -m uvicorn app.main:app --reload --port 8000
```

### RAG — Indexer les documents
```bash
python -m app.rag.ingest
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Variables d'environnement
Copie `backend/.env.example` vers `backend/.env` et remplis :
- `GROQ_API_KEY` — depuis console.groq.com
- `FOOTBALL_API_KEY` — depuis football-data.org
- `DATABASE_URL` — PostgreSQL (déjà configuré via Docker)