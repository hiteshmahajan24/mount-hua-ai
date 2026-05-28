# Mount Hua AI 🎧⚔️

An AI-powered cinematic audiobook engine for manhwa/light novel narration.

This project converts scraped novel chapters into immersive multi-character narrated audio using local AI voice synthesis.

---

# Features

## 🎭 Multi-Character Narration
- Character-aware voice routing
- Persistent speaker memory
- Conversation continuity logic
- Soft speaker transition system

## 🧠 AI Scene Understanding
- Dialogue detection
- Narration separation
- Context-aware speaker inference
- Scene chunking

## 🎬 Emotional Delivery
- Emotion-aware pacing
- Dynamic speech speed
- Text normalization
- Improved scream/laughter pronunciation

## 🎧 Playback System
- Real-time audio generation
- Multi-threaded buffering
- Pause / Resume / Stop
- Auto-next chapter
- Continue from last position

## 📱 Future Goals
- Mobile frontend
- Live subtitles
- Streaming narration
- Advanced AI scene director
- Emotion modulation
- WebSocket real-time playback

---

# Tech Stack

## Backend
- Python
- Kokoro TTS
- FastAPI (planned)

## Frontend (planned)
- React
- Vite
- Capacitor

---

# Project Structure

```text
backend/
├── services/
├── config/
├── data/
├── scraping/
├── tests/
└── main.py