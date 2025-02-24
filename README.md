# Google Meet Clone Backend

A real-time video conferencing backend service built with Node.js, Express, Typescript, Socket.IO, and MongoDB. This application provides the server-side functionality for a Google Meet-like video conferencing platform.

## Features

- Real-time video/audio communication
- Create instant meeting links
- Schedule future meetings
- Join existing meetings
- Peer-to-peer connection handling
- Socket-based real-time communication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Environment Variables

Create a `.env` file in the root directory and add the following:

```plaintext
MONGO_DB_URI=your_mongodb_connection_string
```

## Installation
1. Clone the repository:

   ```bash
   git clone <repository-url> <folder name>
   ```

2. Navigate to the project directory:

   ```bash
   cd <folder name>
   ```

3. Install dependencies:

   ```bash
   yarn install
   ```
4. Start the server:

   ```bash
   yarn start
   ```

  The server will start on http://localhost:8000

## API Endpoints
- GET / - Health check endpoint

## Socket Events
The application handles the following socket events:

- CREATE_MEET_LINK - Creates a new meeting link
- JOIN_MEET - Handles user joining a meeting
- CREATE_FUTURE_MEET_LINK - Creates a scheduled meeting link
- LEAVE_MEET - Handles user leaving a meeting
- OFFER - Handles WebRTC offer
- ANSWER - Handles WebRTC answer
- READY_FOR_PEERCONNECTION - Manages peer connection readiness

## Tech Stack
- Express.js - Web framework
- Socket.IO - Real-time communication
- Mongoose - MongoDB object modeling
- TypeScript - Programming language
- WebRTC - Peer-to-peer communication

## Project Structure

src/
├── app.ts              # Main application file
├── controllers/        # Socket event controllers
├── utils/             # Utility functions and constants
└── socket.js          # Socket.IO configuration