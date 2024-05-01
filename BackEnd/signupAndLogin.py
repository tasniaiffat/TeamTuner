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

signupAndLoginRouter = APIRouter()

class signupUser:

    signupUser = models.signupUser
    signupDatabase = firestore.client()

    @staticmethod
    def add_data(collection_name, document_name, data):
        document = signupUser.signupDatabase.collection(collection_name).document(document_name)
        document.set(data)
    
    
            
    @signupAndLoginRouter.post("/")
    async def signup(user: signupUser):
        email = user.email
        password = user.password
        department = user.department  # Assuming department is a field in the signupUser model
        
        try:
            user_record = auth.create_user(
                email=email,
                password=password
            )

            signupUser.add_data("Personal Information", email, { 
                "Department": department,
                "First Name": user.first_name,
                "Last Name": user.last_name,
                "Password": password,
                "Registration Number": user.reg_number,
                "Session": user.session,
                "Email": email
            })

            signupUser.add_data("Judge Information", email, {
                "AtcoderHandle": user.atcoder_handle,
                "Codechef Handle": user.codechef_handle,
                "Codeforces Handle": user.cf_handle,
                "Email": email,
                "Vjudge Handle": user.vjudge_handle
            })

            
            return JSONResponse(content={"message": "User account created successfully"})
        except auth.EmailAlreadyExistsError:
            raise HTTPException(
                status_code=400,
                detail="Email already used"
            )


class loginUser:
    loginUser = models.loginUser
    loginDatabase = firestore.client()
    
        
    @signupAndLoginRouter.post("/login")
    async def login(user: loginUser):
        try:
            email = user.email
            password = user.password
            auth = firebase.auth()
            
            # Verify email and password with Firebase authentication
            user = auth.sign_in_with_email_and_password(email, password)
            
            # If no exceptions are raised, authentication is successful
            return JSONResponse(content={"message": "Login Successful"})
        
        except Exception as e:
            # Log generic error message
            print(f"Internal Server Error: {e}")
            # Return generic error message
            raise HTTPException(status_code=401, detail="Username and Password Do Not Match")

        

