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
import json

leaderboardDataRouter = APIRouter()

class leaderboardData:
    
	db = firestore.client()
	cf_weight = 1
	cc_weight = 0.75
	ac_weight = 0.75
	vjudge_weight = 0.5
 
	contestWeight = models.contestWeight
	
	@leaderboardDataRouter.get("/changeWeights")
	async def weightChange(newWeights: contestWeight):
		leaderboardData.cf_weight = newWeights.cf_weight
		leaderboardData.cc_weight = newWeights.cc_weight
		leaderboardData.ac_weight = newWeights.ac_weight
		leaderboardData.vjudge_weight = newWeights.vjudge_weight
  
	def retrieveAndSort():

		try :
			ContestCollection = leaderboardData.db.collection('Online Contest')
			start_date = datetime(2024, 1, 1) 
			end_date = datetime(2024, 12, 31) 
			
			query = leaderboardData.db.collection('Online Contest') \
			.where('`Contest Date`', '>=', start_date) \
			.where('`Contest Date`', '<=', end_date) \
			.order_by('`Contest Date`')
			
			result = query.stream()
			
			cf_solve = {}
			cc_solve = {}
			ac_solve = {}
			vjudge_solve = {}
			usernames = set()
			
			for doc in result:
				data = doc.to_dict()
				username = data.get('Username')
				contest_type = data.get('Contest Type')
				solved = data.get('Solved')
		
				if username is not None:  
					if contest_type == 'Codeforces':
							cf_solve[username] = cf_solve.get(username, 0) + solved
					elif contest_type == 'Codechef':
							cc_solve[username] = cc_solve.get(username, 0) + solved
					elif contest_type == 'Atcoder':
							ac_solve[username] = cf_solve.get(username, 0) + solved
					else:
							vjudge_solve[username] = vjudge_solve.get(username, 0) + solved
			
					usernames.add(data['Username'])
			
			final_data = {}

			id = 1
			
			for username in usernames:
       
				total_score = 0
				final_data[username] = {
						'username': username,
						'cf_solve': cf_solve.get(username, 0),
						'cc_solve': cc_solve.get(username, 0),
						'ac_solve': ac_solve.get(username, 0),
						'vjudge_solve': vjudge_solve.get(username, 0)
				}
				id+=1
				total_score += (final_data[username]['cf_solve']*leaderboardData.cf_weight)
				total_score += (final_data[username]['cc_solve']*leaderboardData.cc_weight)
				total_score += (final_data[username]['ac_solve']*leaderboardData.ac_weight)
				total_score += (final_data[username]['vjudge_solve']*leaderboardData.vjudge_weight)
				
				final_data[username]['score'] = total_score

			
			final_data = sorted(final_data.items(), key=lambda item: item[1]['score'], reverse=True)  
						
			return final_data

		except Exception as e:
			print ({"message" : str(e)})
	
	

 
	@leaderboardDataRouter.get("/leaderboard")
	def returnLeaderboardData():
		try:
			sorted_data = leaderboardData.retrieveAndSort()
			return JSONResponse(content=sorted_data)

		except Exception as e:
			print ({"message" : str(e)})



leaderboardData.retrieveAndSort()
