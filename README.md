# Music Review Platform

A full-stack application for reviewing and discovering music.

## Environment Setup

### Frontend Setup
1. Copy `frontend/.env.example` to `frontend/.env`
2. Replace the placeholder values in `frontend/.env` with your actual values:
   - `REACT_APP_API_URL`: Your backend API URL
   - `REACT_APP_GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `REACT_APP_STRIPE_PUBLIC_KEY`: Your Stripe public key

### Backend Setup
1. Copy `backend/.env.example` to `backend/.env`
2. Replace the placeholder values in `backend/.env` with your actual values:
   - `PORT`: Port number for the backend server
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT token signing
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
   

## Security Note
Never commit your actual `.env` files to version control. The `.gitignore` file is configured to prevent this. Always use the `.env.example` files as templates for setting up your local environment.

## Development
1. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd backend
   npm install
   ```

2. Start the development servers:
   ```bash
   # Frontend
   npm start

   # Backend
   cd backend
   npm run dev
   ```

## Features

- Spotify integration for music search and playback
- User authentication with Google
- Music reviews and ratings
- Social features (friends, activity feed)
- Modern, responsive UI

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Spotify Developer Account (for API access)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/jukeboxed.git
cd jukeboxed
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Spotify credentials:
```
VITE_SPOTIFY_CLIENT_ID=your_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5174/callback
```

4. Start the development server:
```bash
1.Open two terminals
2. Cd one terminal to /backend
3. Then leave the other terminal in the root directory
4. npm run dev both

```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API and service functions
├── theme/         # Material-UI theme configuration
└── App.jsx        # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 

# Spotify API Credentials
# Get these from https://developer.spotify.com/dashboard
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5174/callback

# Instructions:
# 1. Create a Spotify Developer account at https://developer.spotify.com/dashboard
# 2. Create a new application
# 3. Get your Client ID from the application dashboard
# 4. Add these redirect URIs to your Spotify app settings:
#    - http://localhost:5173/callback
#    - http://localhost:5174/callback
# 5. Copy this file to .env and replace the values with your credentials 

GOOGLE_CLIENT_ID=your_google_client_id_placeholder
GOOGLE_CLIENT_SECRET=your_google_client_secret_placeholder
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/jukeboxed?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_placeholder
SESSION_SECRET=your_session_secret_placeholder
CLIENT_URL=http://localhost:5174
PORT=5000

REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_placeholder
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key_placeholder 

PORT=5000
MONGODB_URI=mongodb://localhost:27017/your_database_name
JWT_SECRET=your_jwt_secret_here_123
GOOGLE_CLIENT_ID=your_google_client_id_placeholder
GOOGLE_CLIENT_SECRET=your_google_client_secret_placeholder

## AI Assistance

This project has benefited from AI assistance in various aspects of its development. The following sections detail how AI was utilized:

### Code Development and Debugging
- **API Integration**: AI assisted in implementing and debugging the Spotify API integration, particularly in handling token expiration and refresh logic. This included fixing issues with the `getUserAccessToken` function and implementing proper error handling for 401 and 403 status codes.
- **Authentication Flow**: AI helped optimize the Google OAuth implementation, particularly in managing token storage and session persistence.
- **Error Handling**: AI contributed to implementing comprehensive error handling across the application, including user-friendly error messages and fallback mechanisms.

### Frontend Development
- **Component Structure**: AI assisted in structuring React components for better maintainability and performance, including the implementation of proper state management in the `TrendingSongsPage` and `ReviewsPage` components.
- **UI/UX Improvements**: AI provided suggestions for improving the user interface, including responsive design implementations and accessibility features.
- **State Management**: AI helped implement efficient state management patterns using React hooks and context API.

### Backend Development
- **API Routes**: AI contributed to the design and implementation of RESTful API endpoints, including the reviews and user management systems.
- **Database Optimization**: AI provided suggestions for optimizing MongoDB queries and implementing proper indexing strategies.
- **Security Implementation**: AI assisted in implementing secure authentication middleware and proper input validation.

### Testing and Debugging
- **Bug Fixes**: AI helped identify and fix various bugs, including:
  - Profile picture upload functionality (fixed incorrect API endpoint)
  - Token refresh logic in Spotify integration
  - State management issues in the reviews system
- **Performance Optimization**: AI provided suggestions for optimizing API calls and reducing unnecessary re-renders.

### Documentation
- **Code Documentation**: AI assisted in writing clear and comprehensive code documentation.
- **API Documentation**: AI helped structure and write API endpoint documentation.

### Notable AI Contributions
1. **Spotify Integration Fixes**:
   - Implemented proper token refresh logic
   - Added comprehensive error handling for API responses
   - Optimized track search functionality

2. **Reviews System Implementation**:
   - Designed efficient data structure for reviews
   - Implemented proper validation and error handling
   - Added pagination and filtering capabilities

3. **Profile Management**:
   - Fixed profile picture upload functionality
   - Implemented secure file handling
   - Added proper error handling for file uploads

4. **Authentication System**:
   - Optimized token management
   - Implemented secure session handling
   - Added proper error messages for authentication failures

### AI Tools Used
- GitHub Copilot for code suggestions and completions
- ChatGPT for architectural decisions and debugging assistance
- Claude for code review and optimization suggestions
- Clip Champ for the subtitles

### Ethical Considerations
While AI has been instrumental in the development of this project, all code has been reviewed and tested by human developers to ensure:
- Code quality and maintainability
- Security best practices
- Proper error handling
- Performance optimization
- User experience considerations
