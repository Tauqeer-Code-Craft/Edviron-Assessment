# Edviron-Assessment

Backend Setup
1. Project Setup

Initialize Project

The backend is built using Node.js with NestJS (you can use Express or Fastify if you prefer).

The application is connected to MongoDB Atlas using the provided MongoDB URI.

Environment Configuration

Create a .env file in the root of the project and configure the following environment variables:

MONGO_URI: MongoDB Atlas connection string

PG_KEY: Payment gateway key (provided)

API_KEY: Payment API key (provided)

SCHOOL_ID: Example school ID (provided)

JWT_SECRET: JWT secret key for authentication

JWT_EXPIRY: JWT expiry time

Example:

MONGO_URI=your_mongodb_connection_string
PG_KEY=edvtest01
API_KEY=your_api_key_here
SCHOOL_ID=65b0e6293e9f76a9694d84b4
JWT_SECRET=your_jwt_secret
JWT_EXPIRY=3600


Install Dependencies

Install the necessary dependencies using npm or yarn:

npm install


Start the Backend Server

Start the application in development mode:

npm run start:dev

Frontend Setup
1. Project Setup

Initialize Project

Use Vite or Create React App to set up the React project.

Install Tailwind CSS or any other CSS framework like Material-UI or Bootstrap for styling.

Use Axios for API calls and React Router for navigation.

Install Dependencies

Install the necessary dependencies using npm or yarn:

npm install


Start the Frontend Server

Start the React development server:

npm run dev


Configure Axios API Calls

Configure Axios for calling the backend API:

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Adjust to your backend URL
});

export default api;

API Endpoints
1. POST /create-payment

Description: Create a payment request and generate a redirect URL for the payment page.

Payload: Payment details such as order_amount, student_info, etc.

Response: Returns a redirect URL to the payment page.

2. POST /webhook

Description: Update transaction details based on the payment gateway's webhook.

Payload: Includes payment status, order information, transaction amount, etc.

Response: Acknowledgement of successful webhook processing.

3. GET /transactions

Description: Fetch a list of all transactions with details such as collect_id, order_amount, and status.

Response: A paginated list of transactions.

4. GET /transactions/school/:schoolId

Description: Fetch transactions for a specific school.

Response: List of transactions filtered by schoolId.

5. GET /transaction-status/:custom_order_id

Description: Fetch the current status of a transaction using a custom order_id.

Response: Returns the status of the transaction (e.g., success, failed).

Environment Configuration

.env Configuration:

Ensure you set up the environment variables for MongoDB, JWT, and Payment API credentials as described in the Backend Setup section.

Testing

Postman Collection:

A Postman collection is provided for testing all API endpoints.

You can import the collection and run the tests to ensure everything works.

Simulating Webhooks:

Use Postman or any other tool to simulate webhook payloads and test the /webhook endpoint.

Hosting

Backend Hosting:

Host the backend on a cloud platform like Heroku or AWS to make it publicly accessible.

Ensure that the backend URL is updated in the frontend to match the deployed URL.

Frontend Hosting:

Host the frontend on Netlify, Vercel, or AWS Amplify for public access.

Update the API URLs in the frontend to match the backend’s deployed URL.
