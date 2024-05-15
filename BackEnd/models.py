from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

class signupUser(BaseModel):
    first_name : str
    last_name : str
    email: str
    password: str
    reg_number : str
    session : str
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
    
class participantInfo(BaseModel):
    dateAndTime: str
    handle: str
    type: str
    oj: str
    solved: int
    penalty: int

class contestInfo(BaseModel):
    id: str
    oj: str
    date: str
    time: str
    title: str


class contestOnDate(BaseModel):
    date : str   
    
class judgeInformation(BaseModel):
    atcoder: str
    codechef: str
    vjudge: str
    codeforces: str
    email: str
    
class contestValues(BaseModel):
    cf_weight: float
    cc_weight: float
    ac_weight: float
    vjudge_weight: float
    start_date : str
    end_date : str
    
class team(BaseModel):
    member1 : str
    member2 : str
    member3 : str
    name : str
    
class deleteTeam(BaseModel):
    name : str