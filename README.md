# Student Management System (SMS) Portal

A modern web portal for managing academic workflows, tracking class timetable schedules, fees, exams, leaves, and department-wide announcements. Designed for Students, Faculty, and Administrators.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React, Redux Toolkit, React Router DOM, Axios, React Icons, Vite.
- **Backend**: Node.js, Express, Mongoose (MongoDB), Nodemailer.

---

## 🚀 Setup & Installation

### 1. Backend Server Setup

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `server/.env` file with the following variables:
   ```env
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   ACCESS_TOKEN_SECRET=your_jwt_access_secret
   REFRESH_TOKEN_SECRET=your_jwt_refresh_secret
   ACCESS_TOKEN_EXPIRE_TIME=15m
   REFRESH_TOKEN_EXPIRE_TIME=7d
   BCRYPT_SALT_ROUNDS=10
   
   # Email Verification Setup
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=465
   EMAIL_SECURE=TRUE
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   EMAIL_FROM_USER="Student Management System"
   ```
4. Run the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Client Setup

1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `client/.env` file:
   ```env
   VITE_API_URL=/api
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

---

## 🔑 Google Authentication Configuration

To configure the correct Google OAuth 2.0 Client ID for the Sign-in/Sign-up features:

1. **Firebase Console**:
   - Go to your project on the [Firebase Console](https://console.firebase.google.com/).
   - Click on **Authentication** from the sidebar menu.
   - Go to the **Sign-in Method** tab.
   - Locate and click on **Google** under Additional Providers.
   - Enable it, specify the support email, and save changes.
2. **Retrieve OAuth 2.0 Client ID**:
   - Open the linked Google Cloud project console via the link provided in the Firebase Google login setup panel.
   - In the Google Cloud Console, navigate to **APIs & Services** → **Credentials**.
   - Under **OAuth 2.0 Client IDs**, locate the **Web client (auto created by Google Service)** or create a new Web OAuth Client ID.
   - Copy the **Client ID** string (it should look like: `xxxxxxx-xxxxxxxxxxxxxxx.apps.googleusercontent.com`).
3. **Configure Environment Variables**:
   - Paste the copied Client ID into both `client/.env` (as `VITE_GOOGLE_CLIENT_ID`) and `server/.env` (as `GOOGLE_CLIENT_ID`).
   - Restart the dev servers to apply changes.

### 🧪 Local Development Fallback (Mock Authentication)

If you are developing locally and do not have a Google Cloud project configured yet, the system has a built-in Mock Authentication fallback:
- If `VITE_GOOGLE_CLIENT_ID` is set to a placeholder (e.g. `kdudiYBNO0RgfacWcz9cgKOqw2B3`), the app will display a notification: *"Using Mock Google login for local development..."*.
- It will bypass the accounts.google.com popup and log in automatically with simulated credentials (`google_${role}_test@example.com`).
- A registration verification OTP code will still be generated and printed directly to the backend node console logs for testing the OTP input step.
