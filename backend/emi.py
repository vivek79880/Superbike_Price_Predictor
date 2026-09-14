from fastapi import FastAPI
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)



class user_detail(BaseModel):
    Fullname:str
    Address:str
    Phonenumber:str
    MonthlySalary:int
    BikeCompany: str


@app.post("/check-emi")
def emi_checker(emi_details: user_detail):
    if emi_details.MonthlySalary >= 100000:
        return {

            "name": emi_details.Fullname,
            "decision": f"congratulations!!! {emi_details.Fullname}, you can comfortably afford this bike"
        }
    else:
        return{
            "name": emi_details.Fullname,
            "decision": f"Sorry {emi_details.Fullname}, you are not eligible right now"
        }
    


    

    