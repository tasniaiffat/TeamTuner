import firebase_admin
import firebase_admin.firestore
import pyrebase
import models

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from firebase_admin import auth, credentials, firestore
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from fastapi import APIRouter
from firebase import firestore_db, firebase

contestRouter = APIRouter()

class contest:
    
    participantInfo = models.participantInfo
    contestInfo = models.contestInfo
    contest_db = firestore.client()
    
    @staticmethod
    def add_data(collection_name, document_name, data):
        document = contest.contest_db.collection(collection_name).document(document_name)
        document.set(data)
        
    @contestRouter.post("/contest/addParticipantInfo")
    async def AddParticipantInfo(info: participantInfo):
        try:
            contest.add_data("Contestant Information", info.handle + " " + info.dateAndTime + " " + info.oj, {
                "dateAndTime": info.dateAndTime,
                "handle": info.handle,
                "oj": info.oj,
                "solved":info.solved,
                "penalty": info.penalty 
            })
            
            return JSONResponse(content={"message": "Contestant Information Added Successfully"})
        except auth.EmailAlreadyExistsError:
            raise HTTPException(
                status_code=400,
                detail="Email already used"
            )
        
    
    @contestRouter.post("/contest/addContest")
    async def AddContest(info: contestInfo):
        try:
            contest.add_data(f"{info.type} Contest", info.oj + " " + info.dateAndTime, {
                "dateAndTime": info.dateAndTime,
                "oj" : info.oj
            })
            
            return JSONResponse(content={"message": "Added Successfully"})
        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Could Not Add Contest"
            )
    
    
          
    @contestRouter.post("/contest/RemoveContest")
    async def RemoveContest(info: contestInfo):
        try:
            collection_name = f"{info.type} Contest"
            document_name = f"{info.oj} {info.dateAndTime}"
            
            print(f"Removing contest: {document_name} from collection: {collection_name}")
            
            document_ref = contest.contest_db.collection(collection_name).document(document_name)
            
            if not document_ref.get().exists:
                raise HTTPException(status_code=404, detail="Contest not found")

            document_ref.delete()
            
            print("Contest removed successfully")
            
            return JSONResponse(content={"message": "Contest removed successfully"})
        except HTTPException as http_error:
            raise http_error
        except Exception as e:
            print(f"An error occurred: {e}")
            raise HTTPException(status_code=500, detail="Internal server error")