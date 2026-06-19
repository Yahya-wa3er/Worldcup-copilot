"""
Service qui récupère les données live et les formate
pour injection dans le prompt Groq.
"""
import logging
from app.services.football_service import football_service

logger = logging.getLogger(__name__)


async def get_live_context() -> str:
    """
    Récupère les données live et retourne un texte formaté
    à injecter dans le prompt système.
    """
    context_parts = []

    try:
        # 1. Matchs en cours (LIVE) ou récents (FINISHED aujourd'hui)
        matches_data = await football_service.get_matches()
        matches = matches_data.get("matches", [])

        live_matches = [m for m in matches if m.get("status") == "IN_PLAY"]
        recent_matches = [m for m in matches if m.get("status") == "FINISHED"][-5:]
        next_matches = [m for m in matches if m.get("status") == "TIMED"][:3]

        if live_matches:
            context_parts.append("🔴 MATCHS EN DIRECT :")
            for m in live_matches:
                home = m["homeTeam"]["name"]
                away = m["awayTeam"]["name"]
                score = m["score"]["fullTime"]
                context_parts.append(
                    f"  {home} {score['home']} - {score['away']} {away} (EN COURS)"
                )

        if recent_matches:
            context_parts.append("\n✅ DERNIERS RÉSULTATS :")
            for m in recent_matches:
                home = m["homeTeam"]["name"]
                away = m["awayTeam"]["name"]
                score = m["score"]["fullTime"]
                group = m.get("group", "").replace("_", " ")
                context_parts.append(
                    f"  {home} {score['home']} - {score['away']} {away} ({group})"
                )

        if next_matches:
            context_parts.append("\n🕐 PROCHAINS MATCHS :")
            for m in next_matches:
                from datetime import datetime, timezone
                dt = datetime.fromisoformat(
                    m["utcDate"].replace("Z", "+00:00")
                )
                heure = dt.strftime("%d/%m %H:%M UTC")
                home = m["homeTeam"]["name"]
                away = m["awayTeam"]["name"]
                context_parts.append(f"  {home} vs {away} — {heure}")

    except Exception as e:
        logger.warning(f"Erreur fetch matchs live: {e}")

    try:
        # 2. Classements par groupe (top 2 de chaque groupe)
        standings_data = await football_service.get_standings()
        standings = standings_data.get("standings", [])

        if standings:
            context_parts.append("\n📊 CLASSEMENTS (top 2 par groupe) :")
            for group in standings[:6]:  # max 6 groupes pour pas surcharger le prompt
                group_name = group.get("group", "").replace("_", " ")
                table = group.get("table", [])[:2]
                if table:
                    context_parts.append(f"  {group_name}:")
                    for row in table:
                        team = row["team"]["shortName"] or row["team"]["name"]
                        pts = row["points"]
                        played = row["playedGames"]
                        context_parts.append(
                            f"    {row['position']}. {team} — {pts} pts ({played} matchs)"
                        )

    except Exception as e:
        logger.warning(f"Erreur fetch standings live: {e}")

    if not context_parts:
        return ""

    return "\n".join(context_parts)