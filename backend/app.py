import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pyspark.sql import SparkSession
from pyspark.ml import PipelineModel
from pyspark.ml.regression import GBTRegressionModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Spark session
spark = SparkSession.builder.appName('SalaryPrediction').getOrCreate()

# Load your pipeline model
pipelineModel = PipelineModel.load("./model/pipeline_model_gbt")
GBTModel = GBTRegressionModel.load('./model/gbt_model1')

class SalaryPredictionRequest(BaseModel):
    companyId: str
    jobType: str
    degree: str
    major: str
    industry: str
    yearsExperience: int
    milesFromMetropolis: int

@app.get("/")
def home():
    return {"message": "Employee Salary Prediction API is running!"}

@app.post("/predict")
def predict_salary(request: SalaryPredictionRequest):
    data = request.dict()

    # Convert the JSON data to a Spark DataFrame
    new_data = spark.createDataFrame([(
        data['companyId'],
        data['jobType'],
        data['degree'],
        data['major'],
        data['industry'],
        data['yearsExperience'],
        data['milesFromMetropolis']
    )], ["companyId", "jobType", "degree", "major", "industry", "yearsExperience", "milesFromMetropolis"])

    # Transform the new data using the pipeline
    transformed_new_data = pipelineModel.transform(new_data)

    # Predict the salary
    predictions = transformed_new_data.select("prediction").collect()
    predicted_salary = predictions[0]["prediction"]

    return {"predicted_salary": predicted_salary}
