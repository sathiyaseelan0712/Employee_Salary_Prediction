from flask import Flask, request, jsonify
import pandas as pd
from joblib import load

# Initialize Flask application
app = Flask(__name__)

# Load the pre-trained model
model = load('./gbt_model.joblib')  # Replace with the actual path to your joblib file

# Define a route to handle prediction requests
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from the request
        data = request.get_json()

        # Convert the JSON data into a pandas DataFrame
        df = pd.DataFrame(data)

        # Preprocess the data as done during training
        df = df.drop(['companyId', 'jobId'], axis=1)
        df = df.replace('NONE', pd.NA)
        for col in df.columns:
            if df[col].dtype == 'object':
                df[col] = df[col].fillna(df[col].mode()[0])
            else:
                df[col] = df[col].fillna(df[col].median())

        # Make predictions using the loaded model
        predictions = model.predict(df)

        # Return the predictions as JSON
        return jsonify({'predictions': predictions.tolist()})

    except Exception as e:
        return jsonify({'error': str(e)})

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True)
