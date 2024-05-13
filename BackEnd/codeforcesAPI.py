import firebase_admin
import firebase_admin.firestore
import pyrebase
import models
import datetime

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from firebase_admin import auth, credentials, firestore
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi import APIRouter
from firebase import firestore_db, firebase
import requests

codeforcesAPIRouter = APIRouter()

class codeforcesAPI:

    contestInfo = models.contestInfo
    contest_db = firestore.client()
    
    def fetchUpcomingContests():
        URL = "https://codeforces.com/api/contest.list?gym=false"
        try:
            response = requests.get(URL)
            if(response.status_code==200):
                list = response.json()
                contest_list = list["result"]
                
                upcoming_contests = []
                
                for contest in contest_list:
                    
                    if contest["relativeTimeSeconds"]<0:
                        upcoming_contests.append(contest)
                    
                    else:
                        break
                
                return upcoming_contests
            
        except Exception as e:
            return {"error" : str(e)}
        
        
    def fetchContestResult(contest_id, handle):
        # print(contest_id + " " + handle)
        URL = f"https://codeforces.com/api/user.status?handle={handle}&from=1&count=500"
        
        try:
            response = requests.get(URL)
            if(response.status_code==200):
                list = response.json()
                submission_list = list["result"]
                
                accepted_answers = set()
                
                for submission in submission_list:
                    if(submission["contestId"]!=int(contest_id) or submission["testset"]!="TESTS" or submission["verdict"]!="OK"):
                        continue
                    else:
                        # print(submission)
                        problem_info = submission["problem"]
                        author_info = submission["author"]
                        if(author_info["participantType"]=="CONTESTANT" or author_info["participantType"]=="OUT_OF_COMPETITION"):
                            accepted_answers.add(problem_info["index"])
                            
                return len(accepted_answers)

        except Exception as e:
            return {"error" : str(e)}  
        
    def format_datetime(unix_time):
        local_time = datetime.datetime.fromtimestamp(unix_time)
        formatted_date = local_time.strftime("%d %B, %Y")  # Format date as "12 May, 2021"
        formatted_time = local_time.strftime("%I:%M %p").lower()   # Format time as "12:00 AM"
        return formatted_date, formatted_time   
         
    def addUpcomingContest():
        try:
            upcoming_contests = codeforcesAPI.fetchUpcomingContests()
            for contests in upcoming_contests:
                unix_time = contests["startTimeSeconds"]
                date, time = codeforcesAPI.format_datetime(unix_time)
                document = codeforcesAPI.contest_db.collection("allContests").document(str(contests["id"]))
                document.set({
                    "id" : str(contests["id"]),
                    "oj" : "Codeforces",
                    "date" : date,
                    "time" : time,
                    "title" : contests["name"]
                })
                # return {"message" : "Done"}
        except Exception as e:
            return {"message" : str(e)}


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
            
            query = codeforcesAPI.contest_db.collection("AddedContest").where("date", "in", date_strings).where("oj", "==", "Codeforces").get()
            
            contest_dict = []
            users = []
            contest_id = []
            
            for doc in query:
                contest_dict.append(doc.to_dict())
                # print(doc.to_dict())
                
            # print(contest_dict)
            for doc in contest_dict:
                contest_id.append(doc["id"])
            
            query = codeforcesAPI.contest_db.collection("Judge Information").stream()
            
            for doc in query:
                uid = doc.id
                doc_data = doc.to_dict()
                handle = doc_data["Codeforces Handle"]
                # print(uid + " " + handle)
                users.append({"uid" : uid, "handle" : handle})
            
            for contest in contest_id:
                for user in users:
                    # print(user["handle"] + " " + contest)
                    ac_count = codeforcesAPI.fetchContestResult(contest, user["handle"]) 
                    # print(ac_count)
                    # print(user["handle"] + " " + contest + " " + str(ac_count))
                    
                    uid = contest + " " + user["uid"]
                    document = codeforcesAPI.contest_db.collection("Contest Result").document(uid)
                    document.set({
                        "id" : contest,
                        "email" : user["uid"],
                        "type" : "Codeforces",
                        "solved" : str(ac_count)
                    })
                    
        except Exception as e:
            return {"message" : str(e)}
        
        

print(codeforcesAPI.addContestantInfo())