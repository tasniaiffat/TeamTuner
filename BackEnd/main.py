import uvicorn
from fastapi import FastAPI, HTTPException
import signupAndLogin as signupAndLogin
from firebase import firestore_db
from fastapi.middleware.cors import CORSMiddleware
import contest as contest

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allow_headers=["*"],  
)

app.include_router(signupAndLogin.signupAndLoginRouter)
app.include_router(contest.contestRouter)

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)