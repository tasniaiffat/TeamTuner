import uvicorn
from fastapi import FastAPI, HTTPException
import signupAndLogin as signupAndLogin
from firebase import firestore_db
from fastapi.middleware.cors import CORSMiddleware
import contest as contest
import codeforcesAPI
import atcoderAPI

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allow_headers=["*"],  
)

app.include_router(signupAndLogin.signupAndLoginRouter)
app.include_router(contest.contestRouter)
app.include_router(codeforcesAPI.codeforcesAPIRouter)

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
    # upcoming_contests = atcoderAPI.atcoderAPI.fetchUpcomingContests()
    # print(len(upcoming_contests))
    # solve_count = atcoderAPI.atcoderAPI.fetchContestResult("abc351", "Farhan188")
    # print(solve_count)