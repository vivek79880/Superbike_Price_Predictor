from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
from fastapi.middleware.cors import CORSMiddleware
from google import genai

#connect database with backend 

def get_db():
    conn = sqlite3.connect("applications.db")
    conn.row_factory = sqlite3.Row
    return conn

# Runs once when the server starts, creates the table if it doesn't exist yet

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT,
            address TEXT,
            phone TEXT,
            salary INTEGER,
            bike_company TEXT,
            bike_model TEXT,
            eligible INTEGER,
            decision TEXT
        )
    """)
    conn.commit()
    conn.close()
init_db()


app = FastAPI()

client = genai.Client()


class user_detail(BaseModel):
    Fullname: str
    Address: str
    Phonenumber: str
    MonthlySalary: int
    BikeCompany: str
    BikeModel: str



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/check-emi")
def emi_checker(emi_details: user_detail):
    eligible = emi_details.MonthlySalary >= 100000

    # Ask Gemini to write a natural explanation, based on the decision we already made
    prompt = f"""
    A customer named {emi_details.Fullname} applied for an EMI (loan) to buy a {emi_details.BikeModel}.
    Their monthly salary is {emi_details.MonthlySalary} rupees.
    The eligibility decision is: {"APPROVED" if eligible else "NOT APPROVED"}.
    Write a short, warm, 2-3 sentence message to the customer explaining this decision.
    Do not mention exact eligibility rules or numbers, just be natural and polite.
    """

    response = client.models.generate_content(
    model="gemini-3.5-flash-lite",
    contents=prompt,
    config={"temperature": 0.1}
)
    
        
    conn = get_db()
    conn.execute(
        """
        INSERT INTO applications
        (full_name, address, phone, salary, bike_company, bike_model, eligible, decision)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            emi_details.Fullname,
            emi_details.Address,
            emi_details.Phonenumber,
            emi_details.MonthlySalary,
            emi_details.BikeCompany,
            emi_details.BikeModel,
            eligible,
            response.text
        )
    )
    conn.commit()
    conn.close()

    return {
        "eligible": eligible,
        "name": emi_details.Fullname,
        "decision": response.text
    }
    
    


    





    