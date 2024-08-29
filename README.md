# Employee Salary Prediction

This project is a web application that predicts employee salaries based on various input features. The frontend is built with React, and the backend is powered by Flask. The machine learning model uses the Gradient Boosting algorithm to provide accurate salary predictions.

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.7 or higher)
- npm (v6 or higher)
- pip (v20 or higher)

## Project Setup

### Backend Setup

1. **Navigate to the backend directory:**

    ```sh
    cd backend
    ```

2. **Create a virtual environment:**

    ```sh
    python -m venv venv
    ```

3. **Activate the virtual environment:**

    - On Windows:

        ```sh
        venv\Scripts\activate
        ```

    - On macOS/Linux:

        ```sh
        source venv/bin/activate
        ```

4. **Install the required dependencies:**

    ```sh
    pip install -r requirements.txt
    ```

5. **Run the Flask application:**

    ```sh
    flask run
    ```

### Frontend Setup

1. **Navigate to the frontend directory:**

    ```sh
    cd frontend
    ```

2. **Install the required dependencies:**

    ```sh
    npm install
    ```

3. **Run the React application:**

    ```sh
    npm start
    ```

## Deployment

### Deploying the Frontend on Render

1. **Create a `render.yaml` file in the root of your project directory:**

    ```yaml
    services:
      - type: web
        name: employee-salary-prediction-frontend
        env: node
        plan: free
        buildCommand: npm install && npm run build
        startCommand: npm start
        envVars:
          - key: NODE_ENV
            value: production
        staticPublishPath: frontend/build
    ```

2. **Deploy the Service:**

    - Go to the [Render dashboard](https://dashboard.render.com/).
    - Click on "New" and select "Web Service".
    - Connect your GitHub repository.
    - Render will automatically detect the `render.yaml` file and use it to configure your service.

3. **Access the Deployed Application:**

    - Once the deployment is complete, you will receive a URL where your application is hosted.

    - **Frontend Deployment Link:** [https://salaryprediction-8awy.onrender.com](https://salaryprediction-8awy.onrender.com)

## Machine Learning Model

The salary prediction model is built using the Gradient Boosting algorithm, a powerful ensemble technique that combines the predictions of several base models to improve accuracy and robustness. The model is trained on various employee-related features such as job type, degree, major, industry, years of experience, and distance from a metropolis.

## Dependencies

Key dependencies for the project:

- **Flask:** A lightweight WSGI web application framework for Python.
- **Flask-Cors:** A Flask extension for handling Cross-Origin Resource Sharing (CORS).
- **pandas:** A powerful data manipulation and analysis library for Python.
- **scikit-learn:** A machine learning library for Python, used for building the Gradient Boosting model.
- **numpy:** A fundamental package for scientific computing with Python.

## Accessing the Application

Make sure that your backend is running and accessible for the frontend to make API calls. Update the API URL in your frontend code if necessary to match the deployed backend URL.


