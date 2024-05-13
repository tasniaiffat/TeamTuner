import firebase_admin
import firebase_admin.firestore
import pyrebase
import models
import time
import datetime

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from firebase_admin import auth, credentials, firestore
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi import APIRouter
from firebase import firestore_db, firebase
import requests
import atcoderDataScraper as atcoderDataScraper

atcoderAPIRouter = APIRouter()

class atcoderAPI:

    contest_db = firestore.client()
    
    def fetchUpcomingContests():
        
        try:
            upcomingCountests = atcoderDataScraper.atcoderUpcomingContests()
            return upcomingCountests
        
        except Exception as e:
            return {"error" : str(e)}              
        
    def fetchContestResult(contest_id, handle):
        epoch_time_now = int(time.time())
        Contest_URL = "https://kenkoooo.com/atcoder/resources/contests.json"
        # Submission_URL = "https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions?user=chokudai&from_second=1560046356"
        
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
        
    
    def format_datetime(unix_time):
        local_time = datetime.datetime.fromtimestamp(unix_time)
        formatted_date = local_time.strftime("%d %B, %Y")  # Format date as "12 May, 2021"
        formatted_time = local_time.strftime("%I:%M %p").lower()   # Format time as "12:00 AM"
        return formatted_date, formatted_time   
    
    def addUpcomingContest():
        try:
            upcoming_contests = atcoderAPI.fetchUpcomingContests()
            for contest_id, contest_info in upcoming_contests.items():
                timestamp, contest_name = contest_info
                unix_time = timestamp
                date, time = atcoderAPI.format_datetime(unix_time)
                document = atcoderAPI.contest_db.collection("allContests").document(contest_id)
                document.set({
                    "id" : contest_id,
                    "oj" : "Atcoder",
                    "date" : date,
                    "time" : time,
                    "title" : contest_name
                })

            # return {"message": "done"}
        except Exception as e:
            return {"message": str(e)}

    def addContestantInfo():
        try:
            
            today = datetime.date.today()

            # Calculate the date 5 days ago
            five_days_ago = today - datetime.timedelta(days=5)

            # List to store the dates as strings
            date_strings = []

            # Iterate over the last 5 days and convert them to strings
            for i in range(5):
                # Calculate the date for the current iteration
                current_date = five_days_ago + datetime.timedelta(days=i)
                
                # Convert the date to string in the desired format
                date_string = current_date.strftime("%d %B, %Y")
                
                # Append the string to the list
                date_strings.append(date_string)

            # Print the list of date strings
            print(date_strings)
            
            query = atcoderAPI.contest_db.collection("AddedContest").where("date", "in", date_strings).where("oj", "==", "Atcoder").get()
            
            contest_dict = []
            users = []
            contest_id = []
            
            for doc in query:
                contest_dict.append(doc.to_dict())
                # print(doc.to_dict())
                
            # print(contest_dict)
            for doc in contest_dict:
                contest_id.append(doc["id"])
            
            query = atcoderAPI.contest_db.collection("Judge Information").stream()
            
            for doc in query:
                uid = doc.id
                doc_data = doc.to_dict()
                handle = doc_data["AtcoderHandle"]
                # print(uid + " " + handle)
                users.append({"uid" : uid, "handle" : handle})
            
            for contest in contest_id:
                for user in users:
                    # print(user["handle"] + " " + contest)
                    ac_count = atcoderAPI.fetchContestResult(contest, user["handle"]) 
                    # print(ac_count)
                    print(user["handle"] + " " + contest + " " + str(ac_count))
                    
                    uid = contest + " " + user["uid"]
                    document = atcoderAPI.contest_db.collection("Contest Result").document(uid)
                    document.set({
                        "id" : contest,
                        "email" : user["uid"],
                        "type" : "Atcoder",
                        "solved" : str(ac_count)
                    })
                    
        except Exception as e:
            return {"message" : str(e)}
        
    
print(atcoderAPI.addContestantInfo())