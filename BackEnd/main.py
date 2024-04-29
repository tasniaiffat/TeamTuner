import uvicorn
from fastapi import FastAPI, HTTPException
import signupAndLogin as signupAndLogin
from firebase import firestore_db


app = FastAPI(
    docs_url="/"
)

app.include_router(signupAndLogin.signupAndLoginRouter)

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)