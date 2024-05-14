import uvicorn
from fastapi import FastAPI, HTTPException
import signupAndLogin as signupAndLogin
from firebase import firestore_db
from fastapi.middleware.cors import CORSMiddleware
import contest as contest
import codeforcesAPI
import atcoderAPI
import codechefAPI
import leaderboardData
import vjudgeAPI
import asyncio 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allow_headers=["*"],  
)

async def run_scrapers():
    while True:
        # Call your scraper function
        print("Hello")
        # codeforcesAPI.codeforcesAPI.addUpcomingContest()
        # atcoderAPI.atcoderAPI.addUpcomingContest()
        # codechefAPI.codechefAPI.addUpcomingContest()
        # codeforcesAPI.codeforcesAPI.addContestantInfo()
        # codechefAPI.codechefAPI.addContestantInfo()
        # atcoderAPI.atcoderAPI.addContestantInfo()
        # vjudgeAPI.vjudgeAPI.addContestantInfo()
        await asyncio.sleep(1200)
        

app.include_router(signupAndLogin.signupAndLoginRouter)
app.include_router(contest.contestRouter)
# app.include_router(codeforcesAPI.codeforcesAPIRouter)
# app.include_router(atcoderAPI.atcoderAPIRouter)
# app.include_router(codechefAPI.codechefAPIRouter)
app.include_router(leaderboardData.leaderboardDataRouter)
# app.include_router(vjudgeAPI.vjudgeAPIRouter)


async def shutdown_event():
    print("Application shutting down")
    
async def startup_event():
    print("Application starting up")
    # Start the scraper loop when the application starts up
    asyncio.create_task(run_scrapers())

app.add_event_handler("startup", startup_event)
app.add_event_handler("shutdown", shutdown_event)


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
    # upcoming_contests = atcoderAPI.atcoderAPI.fetchUpcomingContests()
    # print(len(upcoming_contests))
    # solve_count = atcoderAPI.atcoderAPI.fetchContestResult("abc351", "Farhan188")
    # print(solve_count)
    