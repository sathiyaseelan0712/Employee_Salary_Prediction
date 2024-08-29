# Employee Salary Prediction

This project is a web application for predicting employee salaries based on various input features. The frontend is built with React, and the backend is built with Flask.

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

1. **Create a [`render.yaml`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fe%3A%2FEmployee%20Salary%20Prediction%2Ffrontend%2Frender.yaml%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "e:\Employee Salary Prediction\frontend\render.yaml") file in the root of your project directory:**

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
    - Render will automatically detect the [`render.yaml`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2Fe%3A%2FEmployee%20Salary%20Prediction%2Ffrontend%2Frender.yaml%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "e:\Employee Salary Prediction\frontend\render.yaml") file and use it to configure your service.

3. **Access the Deployed Application:**

    - Once the deployment is complete, you will receive a URL where your application is hosted.

## Accessing the Application

- **Frontend Deployment Link:** [Your Render Deployment Link](https://your-render-deployment-link.com)

Replace `https://your-render-deployment-link.com` with the actual URL provided by Render after deployment.

## Additional Information

- Ensure that your backend is running and accessible for the frontend to make API calls.
- Update the API URL in your frontend code if necessary to match the deployed backend URL.

## License

This project is licensed under the MIT License.