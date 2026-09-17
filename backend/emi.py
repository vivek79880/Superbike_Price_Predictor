from fastapi import FastAPI
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware
from google import genai

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
    model="gemini-3.6-flash",
    contents=prompt
)

    return {
        "eligible": eligible,
        "name": emi_details.Fullname,
        "decision": response.text
    }





    