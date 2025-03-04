# Smart Wakala

A modern digital platform for managing mobile money agent operations with advanced float and overdraft tracking.

## Overview
Smart Wakala is designed to streamline and digitize the operations of mobile money agents (Wakalas) in Tanzania and similar markets, providing tools for float management, overdraft services, transaction tracking, and business analytics.

## Features
- Float Management
  - Top-up mechanism
  - Transaction tracking
  - Automatic 10% repayment deduction
- Overdraft Management
  - Collateral-based overdraft system
  - Repayment tracking
  - Overdraft limit calculation
- User Authentication
  - Secure login/registration
  - Profile management
- Dashboard Analytics
  - Transaction summaries
  - Financial metrics

## Technology Stack
- Frontend:
  - React with TypeScript
  - Redux Toolkit for state management
  - React Router for navigation
  - Tailwind CSS for styling
- Authentication:
  - Firebase Authentication (planned)
- Deployment:
  - Netlify for frontend hosting
  - Firebase for backend services (planned)

## Project Structure
```
smart-wakala/
├── frontend/                # React frontend application
│   ├── public/              # Public assets
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   │   ├── common/      # Shared components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   ├── float/       # Float management components
│   │   │   ├── layout/      # Layout components
│   │   │   └── overdraft/   # Overdraft components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store configuration
│   │   │   └── slices/      # Redux slices
│   │   ├── styles/          # CSS styles
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main App component
│   │   └── index.tsx        # Entry point
│   ├── package.json         # Dependencies and scripts
│   └── tsconfig.json        # TypeScript configuration
└── netlify.toml             # Netlify deployment configuration

## Getting Started
1. Clone this repository
2. Navigate to the frontend directory: `cd frontend`
3. Install dependencies: `npm install`
4. Start the development server: `npm start`
5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Deployment
The application is deployed on Netlify. Any changes pushed to the main branch will automatically trigger a new deployment.

## License
MIT
