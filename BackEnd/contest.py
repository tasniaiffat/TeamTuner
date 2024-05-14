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
from leaderboardData import leaderboardData
from fastapi.responses import JSONResponse

contestRouter = APIRouter()

class contest:
    
    participantInfo = models.participantInfo
    contestInfo = models.contestInfo
    contest_db = firestore.client()
    team = models.team
    deleteTeam = models.deleteTeam
    
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
    
    @contestRouter.put("/contest/addAvailableContest")
    async def AddAvailableContest(info: contestInfo):
        try:
            contest.add_data("allContests", f"{info.id}", {
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
    
    @contestRouter.get("/contest/allUpcomingAddedContests")
    async def allUpcomingAddedContests():
        try:
            allAddedContests = contest.get_all_data("AddedContest")
            upcomingOnes = []
            for contests in allAddedContests:
                date = contests['date']
                contest_date = datetime.strptime(date, "%d %B, %Y")
                current_date = datetime.now()
                if contest_date >= current_date: 
                   upcomingOnes.append(contests) 
            
            print(upcomingOnes)
            return JSONResponse(content={"upcoming_contests": upcomingOnes})

        except Exception as e:
            return {"message" : str(e)}
        
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
            
    
    
    @contestRouter.get("/contest/CreatedTeams")
    async def CreatedTeams():
        try:
            teams = contest.get_all_data("Teams")
            return JSONResponse(content={"teams" : teams})
        
        except Exception as e:
            return JSONResponse(content={"message": str(e)})
        
    
    @contestRouter.get("/contest/findMembers")
    def findMembers():
        try:
            all_members = contest.get_all_data("Judge Information")
            all_teams = contest.get_all_data("Teams")
            
            # print(all_teams)
            
            usedMemberSet = set()
            remaining_members = []
                
            for team in all_teams:
                usedMemberSet.add(team['Member 1'])
                usedMemberSet.add(team['Member 2'])
                usedMemberSet.add(team['Member 3'])


            for member in all_members:
                print(member["Email"])
                if member["Email"] not in usedMemberSet:
                    remaining_members.append(member["Email"])
            
            return JSONResponse(content={'remaining_members' : remaining_members})

        except Exception as e:
            return {"message" : str(e)}
    
    @contestRouter.put("/contest/addTeam")
    def AddTeam(info: team):
        try:
            contest.add_data("Teams", info.name, {
                "name" : info.name,
                "Member 1" : info.member1,
                "Member 2" : info.member2,
                "Member 3" : info.member3,
            })
            
            return JSONResponse(content={"message": "Added Successfully"})
        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Could Not Add Contest"
            )
    
    
    

    @contestRouter.get("/contest/generateTeams")
    def generateTeams():
        try:
            leaderboard = leaderboardData.retrieveAndSort()
            teams = {
                "alpha": [],
                "beta": [],
                "gamma": []
            }
            
            team_names = list(teams.keys())
            current_team = 0
            
            while len(leaderboard) >= 3 and current_team < len(team_names):
                # Assign members to the current team
                teams[team_names[current_team]].extend([member[0] for member in leaderboard[:3]])
                # Remove assigned members from the list
                del leaderboard[:3]
                current_team += 1
            
            all_teams = [{team.capitalize(): members} for team, members in teams.items()]

            return JSONResponse(content={"teams" : all_teams})

        
        except Exception as e:
            return {"message" : str(e)}

    
    @contestRouter.put("/contest/deleteTeam")
    async def DeleteTeam(info: deleteTeam):
        try:
            collection_name = "Teams"
            document_name = info.name
                
            document_ref = contest.contest_db.collection(collection_name).document(document_name)
                
            if not document_ref.get().exists:
                raise HTTPException(status_code=404, detail="Contest not found")

            document_ref.delete()
            
            print("Team removed successfully")
                
            return JSONResponse(content={"message": "Team removed successfully"})
        
        except HTTPException as http_error:
            raise http_error
        except Exception as e:
            print(f"An error occurred: {e}")
            raise HTTPException(status_code=500, detail="Internal server error")
    
        
    @contestRouter.get("/contest/contestOnDate")
    async def findContestOnDate(date):
        try:
            collection_ref = contest.contest_db.collection('AddedContest')
            query = collection_ref.where('date',  '==',  date).get()
            contestsOnDate = []
            for contests in query:
                contestsOnDate.append(contests.to_dict())
                
            return JSONResponse(content={"Contests": contestsOnDate})
        
        except Exception as e:
            return JSONResponse(content={"message": str(e)})


    
print(contest.findMembers())