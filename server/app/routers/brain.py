
from fastapi import FastAPI
from pydantic import BaseModel

from ..brain import Brain
from ..memory import Memory

app = FastAPI()

@app.get('/')
def read_root():
  return "hello fastAPI"

@app.get('/chat')
def create_chat(user_message: str):
  mem = Memory()
  brain = Brain(mem)
  return brain.reply(user_message)

class checkInItem(BaseModel):
  energy: int
  picked: list[str]
  note: str

@app.post('/checkIn')
def create_record(checkIn: checkInItem):
  mem = Memory()
  brain = Brain(mem)
  mem.add_checkin(checkIn.energy, checkIn.picked, checkIn.note)
  return brain.reply(
    f"[今日打卡] 精力 {checkIn.energy}/5；碰到的面向：{'、'.join(checkIn.picked) or '無'}；一句話：{checkIn.note}"
  )