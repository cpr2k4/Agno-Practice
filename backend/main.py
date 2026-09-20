from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from auth.deps import get_current_user
from auth.router import router as auth_router
from db import Base, engine
from models import User
from schemas import ChatRequest, ChatResponse
from services.agno_agent import send_email_about_topic

app = FastAPI(title="Agno Email Agent Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)


@app.get("/")
def read_root():
    return {"message": "Agno Email Agent Backend is running"}


@app.post("/send-email", response_model=ChatResponse)
def ask(
    request: ChatRequest,
    _current_user: User = Depends(get_current_user),
):
    topic = request.topic.strip()
    if not topic:
        raise HTTPException(status_code=400, detail="Topic cannot be empty")

    try:
        result = send_email_about_topic(topic)
        return ChatResponse(response=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
