# Edviron Assessment

## Table of Contents
- [Backend Setup](#backend-setup)
  - [Project Setup](#project-setup)
  - [Install Dependencies](#install-dependencies)
  - [Start the Backend Server](#start-the-backend-server)
  - [Environment Configuration](#environment-configuration)
- [Frontend Setup](#frontend-setup)
  - [Project Setup](#project-setup-1)
  - [Install Dependencies](#install-dependencies-1)
  - [Start the Frontend Server](#start-the-frontend-server)
  - [Configure Axios API Calls](#configure-axios-api-calls)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
  - [Postman Collection](#postman-collection)
  - [Simulating Webhooks](#simulating-webhooks)
- [Hosting](#hosting)
  - [Backend Hosting](#backend-hosting)
  - [Frontend Hosting](#frontend-hosting)
- [Environment Configuration](#environment-configuration)
  - [.env Configuration](#env-configuration)

---

## Backend Setup

### Project Setup

1. **Initialize Project**  
   The backend is built using **Node.js** with **Express**.  
   The application is connected to **MongoDB Atlas** using the provided MongoDB URI.

2. **Install Dependencies**
   - Install the necessary dependencies using npm or yarn:
     ```bash
     npm install
     ```

3. **Start the Backend Server**
   - Start the application in development mode:
     ```bash
     npm run start:dev
     ```

### Environment Configuration

1. **Create a `.env` file** in the root of the project and configure the following environment variables:

   - `MONGO_URI`: MongoDB Atlas connection string
   - `PG_KEY`: Payment gateway key (provided)
   - `API_KEY`: Payment API key (provided)
   - `SCHOOL_ID`: Example school ID (provided)
   - `JWT_SECRET`: JWT secret key for authentication
   - `JWT_EXPIRY`: JWT expiry time

   Example `.env` file:
   ```env
   MONGO_URI=your_mongodb_connection_string
   PG_KEY=edvtest01
   API_KEY=your_api_key_here
   SCHOOL_ID=65b0e6293e9f76a9694d84b4
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRY=3600

API Endpoints

POST /create-payment
Description: Create a payment request and generate a redirect URL for the payment page.
Payload: Payment details such as order_amount, student_info, etc.
Response: Returns a redirect URL to the payment page.

POST /webhook
Description: Update transaction details based on the payment gateway's webhook.
Payload: Includes payment status, order information, transaction amount, etc.
Response: Acknowledgement of successful webhook processing.

GET /transactions
Description: Fetch a list of all transactions with details such as collect_id, order_amount, and status.
Response: A paginated list of transactions.

GET /transactions/school/:schoolId
Description: Fetch transactions for a specific school.
Response: List of transactions filtered by schoolId.

GET /transaction-status/:custom_order_id
Description: Fetch the current status of a transaction using a custom order_id.
Response: Returns the status of the transaction (e.g., success, failed).

   
### How to Add It to GitHub:

1. Create a new file in your project repository called `README.md`.
2. Copy the entire markdown content above.
3. Paste it into the `README.md` file.
4. Commit and push the changes to GitHub.

```bash
git add README.md
git commit -m "Add project README"
git push origin main

