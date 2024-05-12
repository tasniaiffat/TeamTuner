import firebase_admin
import firebase_admin.firestore
import pyrebase
import models
from datetime import datetime

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
        
    @contestRouter.put("/contest/addParticipantInfo")
    async def AddParticipantInfo(info: participantInfo):
        try:
            contest.add_data("Contestant Information", f"{info.handle} {info.oj}" , {
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
        
    
    @contestRouter.put("/contest/addContest")
    async def AddContest(info: contestInfo):
        try:
            contest.add_data("AddedContest", f"{info.id}", {
                "id" : info.id,
                "date": info.date,
                "time":info.time,
                "oj" : info.oj,
                "title" : info.title
            })
            
            return JSONResponse(content={"message": "Added Successfully"})
        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Could Not Add Contest"
            )
    
    
          
    @contestRouter.put("/contest/RemoveContest")
    async def RemoveContest(info: contestInfo):
        try:
            collection_name = "AddedContest"
            document_name = info.id
            
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
        
    def get_all_data(collection_name):
        try:
                    
            collection_ref = contest.contest_db.collection(collection_name)
            
            query_results = collection_ref.get()
           
            all_data = []

            for doc in query_results:
                
                all_data.append(doc.to_dict())

            
            return all_data
        except Exception as e:
            
            print("Error:", e)
            return None
    
      
    @contestRouter.get("/contest/listContest")
    async def listContest():
        try:
            all_contests = contest.get_all_data("allContests")
            added_contests = contest.get_all_data("AddedContest")
            
            added_contest_ids = {contests["id"] for contests in added_contests}
            
            added_contests = []
            not_added_contests = []
            for contests in all_contests:
                contest_id = contests["id"]
                if contest_id not in added_contest_ids:
                   
                    not_added_contests.append(contests)
                else:
                    added_contests.append(contests)

            return JSONResponse(content={"added_contests": added_contests, "not_added_contests": not_added_contests})

        except Exception as e:
            return JSONResponse(content={"message": str(e)})
            
        

ans = contest.get_all_data("allContests")
print(ans)