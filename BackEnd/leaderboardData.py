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
	contestValues = models.contestValues
 
	
	@leaderboardDataRouter.put("/changeValues")
	async def weightChange(newValues: contestValues):
		try:
			document = leaderboardData.db.collection("leaderboardValues").document("leaderboardValues")
			document.set({
				"Atcoder" : newValues.ac_weight,
				"Codechef" : newValues.cc_weight,
				"Codeforces" : newValues.cf_weight,
				"Vjudge" : newValues.vjudge_weight,
				"startDate" : newValues.start_date,
				"endDate" : newValues.end_date
			})

			return {"message" : "Done"}
   
		except Exception as e:
			return {"message" : str(e)}
  
  
	def retrieveAndSort():
		try :
			query = leaderboardData.db.collection('Contest Result')
			AddedContests = leaderboardData.db.collection('AddedContest')
			result = query.stream()
			AddedContestsResult = AddedContests.stream()
   
			cf_solve = {}
			cc_solve = {}
			ac_solve = {}
			vjudge_solve = {}
			usernames = set()
	
			document = leaderboardData.db.collection('leaderboardValues').document("leaderboardValues").get()
			data = document.to_dict()
   
			start_date = data.get('startDate')
			end_date = data.get('endDate')
			cf_weight = data.get('Codeforces')
			cc_weight = data.get('Codechef')
			ac_weight = data.get("Atcoder")
			vjudge_weight = data.get('Vjudge')
			date_format = "%d %B, %Y"
			
			print(start_date)
			print(end_date)
			print(cf_weight)
			print(cc_weight)
			print(vjudge_weight)

			needed_contests = set()
   
			for doc in AddedContestsResult:
				data = doc.to_dict()
				# print(data)
				start = datetime.strptime(start_date, date_format)
				end = datetime.strptime(end_date, date_format)
				current = datetime.strptime(data.get('date'), date_format)
				if current>=start and current<=end:
					needed_contests.add(data.get('id'))
					print(data.get('id'))

			print(needed_contests)
   
			for doc in result:

				data = doc.to_dict()
				if data.get('id') not in needed_contests: continue
				username = data.get('email')
				contest_type = data.get('type')
				solved = data.get('solved')
		
				if username is not None:  
					if contest_type == 'Codeforces':
							cf_solve[username] = cf_solve.get(username, 0) + int(solved)
					elif contest_type == 'Codechef':
							cc_solve[username] = cc_solve.get(username, 0) + int(solved)
					elif contest_type == 'Atcoder':
							ac_solve[username] = cf_solve.get(username, 0) + int(solved)
					else:
							vjudge_solve[username] = vjudge_solve.get(username, 0) + int(solved)
			
					usernames.add(data['email'])
			
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
				total_score += (final_data[username]['cf_solve']*cf_weight)
				total_score += (final_data[username]['cc_solve']*cc_weight)
				total_score += (final_data[username]['ac_solve']*ac_weight)
				total_score += (final_data[username]['vjudge_solve']*vjudge_weight)
				
				total_score = formatted_number = "{:.2f}".format(total_score)

				final_data[username]['score'] = total_score

			
			final_data = sorted(final_data.items(), key=lambda item: item[1]['score'], reverse=True)  

			print(final_data)
						
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



print(leaderboardData.retrieveAndSort())
