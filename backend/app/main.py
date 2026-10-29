from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.api import chunks, documents, health, chat
from app.core.config import settings
from app.core.database import init_db



@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db() # runs once at startup: creates folders and tables
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],   # the Vite dev server, for later
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(documents.router)
app.include_router(chunks.router)
app.include_router(chat.router)