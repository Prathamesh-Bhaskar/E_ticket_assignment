# E-Ticketing System (IRCTC-like Web Application)

This project is an e-ticketing web application built with a Node.js/Express backend (using MongoDB) and a React frontend styled with Tailwind CSS. The system features an admin dashboard for managing trains (CRUD operations) and a customer interface for browsing trains, booking tickets (with multiple passenger support), and viewing/cancelling bookings.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Features

- **Admin Dashboard:**
  - View, add, edit, and delete train records.
  - Search and filter trains by name or number.
  - Responsive and modern UI with modal forms.
  
- **Customer Interface:**
  - Search trains by source, destination, and journey date.
  - Book tickets by selecting a train and entering multiple passenger details.
  - View booking history and cancel bookings.
  - Dynamic fare calculation based on discounts (e.g., children, concession).

- **Backend:**
  - RESTful API endpoints for trains and bookings.
  - Data validation and error handling.
  - Dummy authentication middleware for admin routes.

- **Frontend:**
  - Built with React and styled using Tailwind CSS.
  - Responsive design optimized for mobile and desktop.
  - Integrated with backend APIs via Axios.

---


yaml
Copy
Edit

---

## Prerequisites

- **Node.js** (v14 or later) and **npm** installed.
- **MongoDB** installed and running locally (or a remote MongoDB instance).
- (Optional) A code editor such as [VS Code](https://code.visualstudio.com/).

---

## Setup Instructions

### Backend Setup

1. **Navigate to the backend folder:**

   ```bash
   cd e-ticketing-app/backend
Install dependencies:

bash
Copy
Edit
npm install
Create a .env file in the backend folder with the following variables (adjust the values as needed):

env
Copy
Edit
MONGO_URI=mongodb://localhost:27017/eticketing
PORT=5000
JWT_SECRET=your_jwt_secret
Start the backend server:

For development with auto-reload (using nodemon):

bash
Copy
Edit
npm run dev
Or to start normally:

bash
Copy
Edit
npm start
The backend server will run on http://localhost:5000.

Frontend Setup
Navigate to the frontend folder:

bash
Copy
Edit
cd e-ticketing-app/frontend
Install dependencies:

bash
Copy
Edit
npm install
Configure Tailwind CSS:

Follow the Tailwind CSS installation guide for Create React App to set up tailwind.config.js and include the Tailwind directives in your index.css.

Start the frontend development server:

bash
Copy
Edit
npm start
The React app will run on http://localhost:3000.

API Endpoints
Trains
GET /api/trains
Retrieve the list of all trains.

POST /api/trains
Admin only. Create a new train record.

PUT /api/trains/:id
Admin only. Update an existing train.

DELETE /api/trains/:id
Admin only. Delete a train record.

Bookings
POST /api/bookings
Create a new booking.

GET /api/bookings
Retrieve bookings (optionally filtered by customer).

PUT /api/bookings/:id/cancel
Cancel an existing booking.

Technologies Used
Backend:

Node.js, Express.js
MongoDB & Mongoose
dotenv for environment variables
express-validator for request validation
CORS for cross-origin requests
Frontend:

React.js
Axios for API calls
Tailwind CSS for styling
Lucide React for icons
Future Enhancements
Authentication:
Implement JWT-based authentication for secure admin and customer access.

Payment Integration:
Integrate a payment gateway to process ticket payments.

Advanced Search:
Enhance train search with filtering and sorting based on additional parameters.

User Profile:
Add a user dashboard for managing personal details and booking history.

Deployment:
Containerize the application with Docker and deploy to a cloud platform.

License
This project is licensed under the MIT License.
