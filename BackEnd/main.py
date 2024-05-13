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
        await codeforcesAPI.codeforcesAPI.addUpcomingContest()
        await atcoderAPI.atcoderAPI.addUpcomingContest()
        await codechefAPI.codechefAPI.addUpcomingContest()
        await codeforcesAPI.codeforcesAPI.addContestantInfo()
        # Wait for a specific time interval (e.g., 24 hours) before running the scraper again
        await asyncio.sleep(600)

app.include_router(signupAndLogin.signupAndLoginRouter)
app.include_router(contest.contestRouter)
app.include_router(codeforcesAPI.codeforcesAPIRouter)
app.include_router(atcoderAPI.atcoderAPIRouter)
app.include_router(codechefAPI.codechefAPIRouter)
app.include_router(leaderboardData.leaderboardDataRouter)


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
    