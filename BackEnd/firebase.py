import firebase_admin
from firebase_admin import credentials, firestore, auth
import pyrebase

firebaseConfig = {
    "apiKey": "AIzaSyDfLuoZuncW1YD-g7jJXnVwBhkjch08Zps",
    "authDomain": "teamtuner-495de.firebaseapp.com",
    "projectId": "teamtuner-495de",
    "storageBucket": "teamtuner-495de.appspot.com",
    "messagingSenderId": "513288073146",
    "appId": "1:513288073146:web:1969cb0b91515308e77783",
    "measurementId": "G-Y98VG4JX2J",
    "databaseURL": ""
}

# Initialize Firebase
cred = credentials.Certificate("firebaseAuth.json")
firebase_admin.initialize_app(cred)
firebase = pyrebase.initialize_app(firebaseConfig)
firestore_db = firestore.client()
