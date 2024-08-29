from flask import Flask, request, jsonify
import pandas as pd
import joblib
from flask_cors import CORS  # Import CORS

app = Flask(__name__)

# Initialize CORS
CORS(app)

# Load the trained model and preprocessor
model = joblib.load('gbtmodel.pkl')

# Define the required columns
required_columns = {
    'yearsExperience': 'numeric',
    'milesFromMetropolis': 'numeric',
    'jobType': 'categorical',
    'degree': 'categorical',
    'major': 'categorical',
    'industry': 'categorical'
}

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the JSON data from the request
        data = request.get_json()

        # Convert JSON data to DataFrame
        if isinstance(data, dict):  # Single record
            df = pd.DataFrame([data])
        elif isinstance(data, list):  # Multiple records
            df = pd.DataFrame(data)
        else:
            return jsonify({'error': 'Invalid input format. JSON must be a dictionary or a list of dictionaries.'}), 400

        # Check for missing required columns
        missing_columns = [col for col in required_columns.keys() if col not in df.columns]
        if missing_columns:
            return jsonify({'error': f'Missing required columns: {", ".join(missing_columns)}'}), 400

        # Ensure all required columns have valid values
        for col in required_columns.keys():
            if required_columns[col] == 'numeric':
                df[col] = pd.to_numeric(df[col], errors='coerce')
                if df[col].isnull().any():
                    return jsonify({'error': f'Column {col} contains invalid numeric values.'}), 400
            elif required_columns[col] == 'categorical':
                if df[col].isnull().any():
                    return jsonify({'error': f'Column {col} contains missing values.'}), 400

        # Handle missing values and convert 'NONE' for categorical columns
        df = df.replace('NONE', pd.NA)
        for col in df.columns:
            if required_columns[col] == 'categorical':
                df[col] = df[col].fillna(df[col].mode()[0] if not df[col].mode().empty else pd.NA)
            else:
                df[col] = df[col].fillna(df[col].median())

        # Drop unnecessary columns (if any)
        if 'companyId' in df.columns:
            df = df.drop(['companyId'], axis=1)
        if 'jobId' in df.columns:
            df = df.drop(['jobId'], axis=1)

        # Preprocess the features
        X_preprocessed = model.named_steps['preprocessor'].transform(df)

        # Make predictions
        predictions = model.named_steps['regressor'].predict(X_preprocessed)

        # Return predictions as JSON
        return jsonify(predictions.tolist())

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)