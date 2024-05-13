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
        URL = f'https://www.codechef.com/rankings/START132{type}?itemsPerPage=1&order=asc&page=1&search={handle}&sortBy=rank'

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
            
            return {"message" : "Done"}
                
        except Exception as e:
            return {"message": str(e)}
            

print(codechefAPI.addUpcomingContest())