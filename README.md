# Jameshorton2486 - github-5mbzqmnc-qtaqomxq

[Edit in StackBlitz ⚡️](https://stackblitz.com/~/github-5mbzqmnc-qtaqomxq)

## Overview

This project is an AI-powered audio and video transcription tool that uses Deepgram's API for accurate transcription. It features a modern React frontend with Tailwind CSS and integrates with Supabase for secure data storage.

## Features

- 🎤 Transcribe audio from YouTube videos and file uploads
- 🤖 AI-powered transcription with high accuracy
- 📝 Real-time processing with live progress updates
- 👥 User authentication and secure data storage
- 📱 Responsive design for all devices
- 🎨 Modern UI with Tailwind CSS

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test

# Run environment tests
npm run test:env
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# Deepgram API Configuration
VITE_DEEPGRAM_API_KEY=your-api-key

# Server Configuration
PORT=3000
HOST=localhost
NODE_ENV=development
```

## License

MIT