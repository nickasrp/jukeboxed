# JukeBoxed

A modern music discovery and sharing platform built with React and Material-UI.

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