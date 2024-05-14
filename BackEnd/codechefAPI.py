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
import codechefDataScraper

codechefAPIRouter = APIRouter()

class codechefAPI:

    contest_db = firestore.client()
    
    def fetchUpcomingContests():
        try:
            upcomingCountests = codechefDataScraper.codechefUpcomingContest()
            return upcomingCountests

        except Exception as e:
            return {"error" : str(e)}              
        
        
    def fetchContestResult(contest_id, type, handle):
        URL = f'https://www.codechef.com/rankings/{contest_id}{type}?filterBy=Institution%3DUniversity%20of%20Dhaka&itemsPerPage=1&order=asc&page=1&search={handle}&sortBy=rank'
        solved = codechefDataScraper.codechefSolveCount(URL)
        return solved
    

    def addUpcomingContest():
        try:
            upcomingContests = codechefAPI.fetchUpcomingContests()
            for contests in upcomingContests:
                date_string = contests["dateAndTime"]
                # Split the date string by comma
                parts = date_string.split(',')

                # Extract the day and month
                day_and_month = parts[1].strip()

                # Remove the suffix "th" from the day part
                day = day_and_month.split()[0].rstrip("st").rstrip("nd").rstrip("rd").rstrip("th")

                # Extract the month
                month = day_and_month.split()[1]

                # Extract the year
                year = parts[2].strip()

                # Format the date
                formatted_date = f"{day} {month}, {year}"
                
                id = contests["id"]
                title = contests["title"]
                date = formatted_date
                time = "8:00 p.m."
                
                document = codechefAPI.contest_db.collection("allContests").document(id)
                document.set({
                    "id" : id,
                    "oj" : "Codechef",
                    "date" : date,
                    "time" : time,
                    "title" : title
                })
            
            # return {"message" : "Done"}
                
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
            
            query = codechefAPI.contest_db.collection("AddedContest").where("date", "in", date_strings).where("oj", "==", "Codechef").get()
            
            contest_dict = []
            users = []
            contest_id = []
            
            for doc in query:
                contest_dict.append(doc.to_dict())
                # print(doc.to_dict())
                
            # print(contest_dict)
            for doc in contest_dict:
                contest_id.append(doc["id"])
            
            query = codechefAPI.contest_db.collection("Judge Information").stream()
            
            for doc in query:
                uid = doc.id
                doc_data = doc.to_dict()
                handle = doc_data["Codechef Handle"]
                # print(uid + " " + handle)
                users.append({"uid" : uid, "handle" : handle})
            
            for contest in contest_id:
                for user in users:
                    # print(user["handle"] + " " + contest)
                    ac_count = codechefAPI.fetchContestResult(contest, 'A', user["handle"]) 
                    ac_count += codechefAPI.fetchContestResult(contest, 'B', user["handle"])
                    ac_count += codechefAPI.fetchContestResult(contest, 'C', user["handle"])
                    ac_count += codechefAPI.fetchContestResult(contest, 'D', user["handle"])
                    # print(ac_count)
                    # print(user["handle"] + " " + contest + " " + str(ac_count))
                    
                    uid = contest + " " + user["uid"]
                    document = codechefAPI.contest_db.collection("Contest Result").document(uid)
                    document.set({
                        "id" : contest,
                        "email" : user["uid"],
                        "type" : "Codechef",
                        "solved" : str(ac_count)
                    })
                    
        except Exception as e:
            return {"message" : str(e)}
        
        