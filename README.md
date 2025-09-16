
# Living Library 2.0

Welcome to Living Library 2.0, an AI-powered web application for exploring, summarizing, and discussing a rich library of resources. This platform allows users to not only consume content but also contribute their own stories, engage in discussions, and leverage the power of Google's Gemini AI for a deeper understanding.

## ✨ Features

- **Explore a Rich Library**: Browse a collection of articles and community-submitted stories.
- **Advanced Search & Filtering**: Easily find resources by searching keywords or filtering by category and tags.
- **AI-Powered Summaries**: Get concise, AI-generated summaries of any resource with a single click.
- **Interactive AI Assistant**: Chat with an intelligent AI assistant to ask questions, clarify concepts, or explore topics further.
- **Community Contributions**: Authenticated users can upload their own stories as documents (`.pdf`, `.doc`, `.txt`) or audio files (`.mp3`, `.wav`).
- **Automatic Content Processing**: The backend uses the Gemini API to automatically extract text from documents, transcribe audio files, and generate relevant tags.
- **User Profiles**: Users can manage their profile information, view their submitted stories, and track their recent activity.
- **Community Engagement**: Like your favorite resources and join the discussion by posting comments.
- **Responsive Design**: A clean, modern, and fully responsive UI that works on all devices.
- **Theming**: Switch between Light, Dark, and System themes for optimal viewing comfort.

---

## 💻 Tech Stack

- **Frontend**:
  - **Framework**: React 19 with TypeScript
  - **Styling**: Tailwind CSS
  - **Routing**: React Router
- **Backend**:
  - **Framework**: Node.js with Express
  - **AI**: Google Gemini API (`gemini-2.5-flash`) for summarization, content extraction, and chat.
- **Authentication**:
  - Firebase Authentication for secure user sign-up and login.
- **Data Persistence**:
  - User-generated content (stories, profile info) and community data (comments, likes) are persisted locally using the browser's `localStorage`.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- `npm` (usually comes with Node.js)

### Backend Setup

The backend server handles all interactions with the Google Gemini API and requires an API key.

1.  **Navigate to the project root directory.**

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root directory and add your Google Gemini API key:
    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```

4.  **Set up Firebase Admin:**
    - Download your service account key file from your Firebase project settings.
    - Rename it to `firebase-service-account.json` and place it in the project's root directory.

5.  **Start the server:**
    ```bash
    npm start
    ```
    The server will be running at `http://localhost:3001`.

### Frontend Setup

The frontend is designed to run directly from the `index.html` file using modern browser features like import maps.

1.  **Serve the project folder.**
    You can use a simple static server or a VS Code extension like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).

2.  **Open the application.**
    Navigate to the local URL provided by your server (e.g., `http://127.0.0.1:5500/index.html`). The application should load and connect to the backend server running on port `3001`.

---

## 📝 Change Log

A log of recent changes and improvements to the application.

### `2024-07-27`
- **Feature**: The welcome modal now appears every time for non-logged-in users.
- **Behavior Before**: The welcome modal only appeared on the user's very first visit. After being closed once, it would not show again.
- **Behavior After**: If a user is not logged in, the welcome modal will now be displayed every time they open or refresh the application, encouraging them to sign up or log in.

### `2024-07-26`
- **Feature**: Added `README.md` to the project to provide comprehensive documentation.
- **Behavior Before**: The project lacked a central document explaining its purpose, features, and setup instructions.
- **Behavior After**: A detailed `README.md` is now available, improving project clarity and onboarding for new developers.

### `2024-07-25`
- **Fix**: Resolved an issue where users could not type in the password fields on the Login and Sign Up forms.
- **Behavior Before**: The password input components were defined inside the `AuthPage` component, causing them to re-render on every keystroke and lose focus.
- **Behavior After**: The `PasswordInput` component was moved outside the `AuthPage` component, ensuring its state is preserved correctly and allowing users to enter their credentials without interruption.