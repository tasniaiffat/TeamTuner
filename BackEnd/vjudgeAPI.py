import firebase_admin
import firebase_admin.firestore
import pyrebase
import models
import datetime
from bs4 import BeautifulSoup
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from firebase_admin import auth, credentials, firestore
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi import APIRouter
from firebase import firestore_db, firebase
import requests
from fastapi.responses import JSONResponse

vjudgeAPIRouter = APIRouter()

class vjudgeAPI:
  
  contest_db = firestore.client()
  
  def fetchContestResult(contestId, handle):
    try:
      URL = f"https://vjudge.net/status/data?draw=1&start=0&length=20&un={handle}&num=&res=1&language="
      response = requests.get(URL)

      if response.status_code==200:
        my_set = set()
        contest_list = requests.get(URL).json()
        data_list = contest_list['data']
        for data in data_list:
          # print(data)
          if(data["contestId"]==int(contestId)):
            my_set.add(data["contestNum"])
        
        return len(my_set)
      
      else:
          raise HTTPException(
          status_code=400,
          detail="Bad Request")
          
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
        
        query = vjudgeAPI.contest_db.collection("AddedContest").where("date", "in", date_strings).where("oj", "==", "Vjudge").get()
        
        contest_dict = []
        users = []
        contest_id = []
        
        for doc in query:
            contest_dict.append(doc.to_dict())
            # print(doc.to_dict())
            
        # print(contest_dict)
        for doc in contest_dict:
            contest_id.append(doc["id"])
        
        query = vjudgeAPI.contest_db.collection("Judge Information").stream()
        
        for doc in query:
            uid = doc.id
            doc_data = doc.to_dict()
            handle = doc_data["Vjudge Handle"]
            # print(uid + " " + handle)
            users.append({"uid" : uid, "handle" : handle})
        
        for contest in contest_id:
            for user in users:
                # print(user["handle"] + " " + contest)
                ac_count = vjudgeAPI.fetchContestResult(contest, user["handle"]) 
                # print(ac_count)
                print(user["handle"] + " " + contest + " " + str(ac_count))
                
                uid = contest + " " + user["uid"]
                document = vjudgeAPI.contest_db.collection("Contest Result").document(uid)
                document.set({
                    "id" : contest,
                    "email" : user["uid"],
                    "type" : "Vjudge",
                    "solved" : str(ac_count)
                })
                
    except Exception as e:
        return {"message" : str(e)}
  

