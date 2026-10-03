import json
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

from database.db import get_connection

class ConversationService:
    """
    Maintains voice conversation history and context for the multilingual voice assistant.
    Persists history in SQLite and provides conversational context for multi-turn dialogues.
    """

    @classmethod
    def init_table(cls):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS voice_conversations (
            id TEXT PRIMARY KEY,
            farmer_id TEXT NOT NULL,
            role TEXT NOT NULL, -- 'farmer' or 'agent'
            text TEXT NOT NULL,
            language TEXT NOT NULL DEFAULT 'te',
            structured_json TEXT,
            agents_invoked TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (farmer_id) REFERENCES farmers(id)
        )
        """)
        conn.commit()
        conn.close()

    @classmethod
    def add_turn(
        cls,
        farmer_id: str,
        user_text: str,
        agent_structured: Dict[str, str],
        summary_text: str,
        language: str,
        agents_invoked: List[str]
    ) -> str:
        """
        Saves a user query turn and the agent response turn in conversation history.
        """
        cls.init_table()
        conn = get_connection()
        cursor = conn.cursor()

        timestamp = datetime.now().isoformat()
        turn_id = f"turn-{uuid.uuid4().hex[:8]}"

        # 1. Farmer turn
        user_id = f"msg-{uuid.uuid4().hex[:6]}"
        cursor.execute("""
        INSERT INTO voice_conversations (id, farmer_id, role, text, language, created_at)
        VALUES (?, ?, 'farmer', ?, ?, ?)
        """, (user_id, farmer_id, user_text, language, timestamp))

        # 2. Agent turn
        agent_id = f"msg-{uuid.uuid4().hex[:6]}"
        cursor.execute("""
        INSERT INTO voice_conversations (id, farmer_id, role, text, language, structured_json, agents_invoked, created_at)
        VALUES (?, ?, 'agent', ?, ?, ?, ?, ?)
        """, (
            agent_id,
            farmer_id,
            summary_text,
            language,
            json.dumps(agent_structured, ensure_ascii=False),
            json.dumps(agents_invoked, ensure_ascii=False),
            timestamp
        ))

        conn.commit()
        conn.close()
        return turn_id

    @classmethod
    def get_history(cls, farmer_id: str = "farmer-1", limit: int = 30) -> List[Dict[str, Any]]:
        cls.init_table()
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
        SELECT * FROM voice_conversations
        WHERE farmer_id = ?
        ORDER BY created_at ASC
        LIMIT ?
        """, (farmer_id, limit))
        rows = cursor.fetchall()
        conn.close()

        history = []
        for r in rows:
            row_dict = dict(r)
            if row_dict.get("structured_json"):
                try:
                    row_dict["structured_response"] = json.loads(row_dict["structured_json"])
                except Exception:
                    row_dict["structured_response"] = None
            if row_dict.get("agents_invoked"):
                try:
                    row_dict["agents_invoked"] = json.loads(row_dict["agents_invoked"])
                except Exception:
                    row_dict["agents_invoked"] = []
            history.append(row_dict)
        return history

    @classmethod
    def get_recent_context(cls, farmer_id: str = "farmer-1", limit: int = 5) -> List[Dict[str, str]]:
        """
        Retrieves the last few turns formatted for conversational context.
        """
        cls.init_table()
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
        SELECT role, text FROM voice_conversations
        WHERE farmer_id = ?
        ORDER BY created_at DESC
        LIMIT ?
        """, (farmer_id, limit * 2))
        rows = cursor.fetchall()
        conn.close()

        # Reverse to chronological order
        return [{"role": r["role"], "text": r["text"]} for r in reversed(rows)]

    @classmethod
    def clear_history(cls, farmer_id: str = "farmer-1"):
        cls.init_table()
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM voice_conversations WHERE farmer_id = ?", (farmer_id,))
        conn.commit()
        conn.close()
