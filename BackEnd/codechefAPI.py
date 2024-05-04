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
import codechefDataScraper

codechefAPIRouter = APIRouter()

class codechefAPI:

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
    

print(codechefAPI.fetchContestResult("START132", "B", "armaan48"))