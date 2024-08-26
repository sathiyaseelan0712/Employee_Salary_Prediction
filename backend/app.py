from flask import Flask, request, jsonify
from flask_cors import CORS
from pyspark.sql import SparkSession
import os

app = Flask(__name__)
CORS(app)

# Initialize Spark session
spark = SparkSession.builder.appName('SalaryPrediction').getOrCreate()

# Load your pipeline model
from pyspark.ml import PipelineModel
from pyspark.ml.regression import GBTRegressionModel

pipelineModel = PipelineModel.load("./model/pipeline_model_gbt")
GBTModel = GBTRegressionModel.load('./model/gbt_model1')
@app.route('/')
def home():
    return "Employee Salary Prediction API is running!"

@app.route('/predict', methods=['POST'])
def predict_salary():
    data = request.json

    # Check if all required fields are present in the request
    required_fields = ["companyId", "jobType", "degree", "major", "industry", "yearsExperience", "milesFromMetropolis"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Convert the JSON data to a Spark DataFrame
    new_data = spark.createDataFrame([(
        data['companyId'],
        data['jobType'],
        data['degree'],
        data['major'],
        data['industry'],
        int(data['yearsExperience']),
        int(data['milesFromMetropolis'])
    )], ["companyId", "jobType", "degree", "major", "industry", "yearsExperience", "milesFromMetropolis"])

    # Transform the new data using the pipeline
    transformed_new_data = pipelineModel.transform(new_data)

    # Make predictions
    predictions = GBTModel.transform(transformed_new_data)

    # Get the predicted salary
    predicted_salary = predictions.select("prediction").collect()[0]["prediction"]

    return jsonify({"predicted_salary": predicted_salary})

if __name__ == '__main__':
    app.run(debug=True)