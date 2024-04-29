from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

class signupUser(BaseModel):
    first_name : str
    last_name : str
    email: str
    password: str
    reg_number : str
    session : str
    uid: str
    department: str
    cf_handle: str
    codechef_handle: str
    atcoder_handle: str
    vjudge_handle: str


class loginUser(BaseModel):
    email: str
    password: str

class PersonalInfo(BaseModel):
    department : str
    first_name: str
    last_name: str
    password: str
    registration_number: str
    session: str
    
class OnlineContest(BaseModel):
    dateAndTime: str
    oj: str
    penalty: int
    solved: int
    email: int
    
class OfflineContest(BaseModel):
    dateAndTime: str
    handle: str
    penalty: str
    solved: str
    email: str

class judgeInformation(BaseModel):
    atcoder: str
    codechef: str
    vjudge: str
    codeforces: str
    email: str