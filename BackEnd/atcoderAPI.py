import firebase_admin
import firebase_admin.firestore
import pyrebase
import models
import time

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from firebase_admin import auth, credentials, firestore
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi import APIRouter
from firebase import firestore_db, firebase
import requests
import BackEnd.atcoderDataScraper as atcoderDataScraper

atcoderAPIRouter = APIRouter()

class atcoderAPI:

    def fetchUpcomingContests():
        
        try:
            upcomingCountests = atcoderDataScraper.atcoderUpcomingContests()
            return upcomingCountests
        
        except Exception as e:
            return {"error" : str(e)}              
        
    def fetchContestResult(contest_id, handle):
        epoch_time_now = int(time.time())
        Contest_URL = "https://kenkoooo.com/atcoder/resources/contests.json"
        Submission_URL = "https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=chokudai&from_second=1560046356"
        
        try:
            time_period = 5*24*60*60
            begin_time = epoch_time_now - time_period
            Submission_URL = f"https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user={handle}&from_second={begin_time}"

            response = requests.get(Contest_URL)
            if response.status_code==200:
                contest_list = requests.get(Contest_URL).json()
                # print("in contest list")
                for contest in contest_list:
                    
                    if contest["id"]==contest_id:
                        
                        contest_start_time = contest["start_epoch_second"]
                        duration = contest["duration_second"]
                        contest_end_time = contest_start_time + duration
                        
                        solved_questions = set()
                        
                        submissionResponse = requests.get(Submission_URL)
                        
                        if submissionResponse.status_code==200:
                            
                            # print("in submission list")
                            submission_list = requests.get(Submission_URL).json()
                            # print(contest_start_time)
                            # print(contest_end_time) 
                            for submission in submission_list:
                                if (submission["contest_id"]==contest_id) and submission["epoch_second"]>=contest_start_time and submission["epoch_second"]<=contest_end_time:
                                    solved_questions.add(submission["problem_id"])
                              
                            return len(solved_questions)
                        
                        else:
                            raise HTTPException(
                            status_code=400,
                            detail="Bad Request"
                        )
            
            else:
                raise HTTPException(
                    status_code=400,
                    detail="Bad Request"
                )
                
        except Exception as e:
            return {"error" : str(e)}