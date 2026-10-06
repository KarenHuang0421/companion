
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from ..brain import Brain
from ..memory import Memory

app = FastAPI()

app.add_middleware(
  CORSMiddleware,
  allow_origins=[
    "http://localhost:4200",     # ng serve
    "http://127.0.0.1:4200",
    "capacitor://localhost",     # 之後包成 iOS app
    "http://localhost",          # Android (Capacitor/Ionic)
  ],
  allow_methods=["*"],
  allow_headers=["*"],
)

class MessageItem(BaseModel):
  user_message: str

class checkInItem(BaseModel):
  energy: int
  picked: list[str]
  note: str

@app.get('/')
def read_root():
  return "hello fastAPI"

@app.get('/hello')
def create_hello():
  mem = Memory()
  brain = Brain(mem)
  return brain.speak_first(
    "請主動跟她打招呼。依照現在時間和你記得的事，說一句自然、簡短的開場，"
    "可以問候、可以提一件她最近在意的事，也可以帶一點意料之外的東西。兩三句以內。"
  )

@app.post('/chat')
def create_chat(params: MessageItem):
  mem = Memory()
  brain = Brain(mem)
  return brain.reply(params.user_message)

@app.post('/checkIn')
def create_record(checkIn: checkInItem):
  mem = Memory()
  brain = Brain(mem)
  mem.add_checkin(checkIn.energy, checkIn.picked, checkIn.note)
  return brain.reply(
    f"[今日打卡] 精力 {checkIn.energy}/5；碰到的面向：{'、'.join(checkIn.picked) or '無'}；一句話：{checkIn.note}"
  )