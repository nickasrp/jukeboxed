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
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret

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
   cd frontend
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
npm run dev
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