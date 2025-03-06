# Smart Wakala

A modern digital platform for managing mobile money agent operations with advanced float liquidity and credit extension features.

## Overview
Smart Wakala is designed to empower mobile money agents (Wakalas) in Tanzania and similar markets by ensuring they never run out of float liquidity. The platform focuses on intelligent credit extension, transparent financial tracking, and performance-based overdraft management.

## Core Features

### Float Liquidity Management
- **Intelligent Top-up System**: Manage float with built-in auto-deduction for repayments
- **Dynamic Auto-Deduction**: Adjustable percentage (5-20%) based on agent performance
- **Mobile-Optimized UI**: Clear visualization of float balance and transactions
- **Offline Support**: Continue operations during connectivity issues

### Credit Extension System
- **Performance-Based Credit Limits**: Credit limits adjusted based on agent performance score
- **Collateral-Backed System**: Secure overdraft based on deposited collateral
- **Transparent Credit Scoring**: Clear factors affecting credit eligibility
- **Auto-Deduction Mechanism**: Seamless repayments from incoming transactions

### Financial Transparency
- **Real-time Repayment Progress**: Visual tracking of debt repayment
- **Notification System**: Alerts for upcoming payments and overdraft limits
- **Credit Score Factors**: Detailed breakdown of performance metrics
- **Transaction History**: Comprehensive record of all financial activities

### User Experience
- **Mobile-First Design**: Optimized for field agents using mobile devices
- **Offline Capabilities**: Firestore persistence for offline operations
- **Multi-tab Support**: Consistent experience across browser tabs
- **Network Status Monitoring**: Automatic adaptation to connectivity changes

## Technology Stack
- **Frontend**:
  - React 18.x with TypeScript (strict mode)
  - Redux Toolkit for state management
  - Tailwind CSS for responsive design
  - Framer Motion for animations
- **State Management**:
  - Redux with performance-optimized slices
  - Thunk middleware for async operations
- **UI Components**:
  - Custom component library
  - React-icons for iconography
  - React-hook-form for form handling
- **Offline Support**:
  - Firestore offline persistence
  - IndexedDB for local storage
  - Network status detection

## Project Structure
```
smart-wakala/
├── frontend/                # React frontend application
│   ├── public/              # Public assets
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   │   ├── common/      # Shared components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   │   ├── CreditScoreFactors.tsx   # Credit score visualization
│   │   │   │   ├── FloatManagement.tsx      # Float operations
│   │   │   │   ├── NotificationCenter.tsx   # Payment alerts
│   │   │   │   ├── OverdraftSummary.tsx     # Overdraft status
│   │   │   │   ├── PerformanceSettings.tsx  # Credit settings
│   │   │   │   └── RepaymentProgress.tsx    # Debt tracking
│   │   │   ├── layout/      # Layout components
│   │   │   └── ui/          # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── store/           # Redux store configuration
│   │   │   └── slices/      # Redux slices
│   │   │       ├── authSlice.ts        # Authentication state
│   │   │       └── overdraftSlice.ts   # Credit management state
│   │   ├── styles/          # Global styles
│   │   └── utils/           # Utility functions
│   ├── package.json         # Dependencies
│   └── tsconfig.json        # TypeScript configuration
└── README.md                # Project documentation
```

## Key Design Decisions

### Credit Extension Logic
- **Auto-Deduction Rate**: Dynamic percentage (5-20%) based on performance score
- **Performance Scoring**: Weighted factors including repayment history (40%), transaction volume (30%), collateral ratio (20%), and account age (10%)
- **Overdraft Limit Calculation**: Base multiplier of 2x collateral, with up to 3x for high-performing agents

### User Interface
- **Mobile-First Approach**: All components designed for mobile use first
- **Color-Coded Indicators**: Visual cues for financial status (green/yellow/red)
- **Progressive Disclosure**: Complex information revealed progressively
- **Offline Mode Indicators**: Clear visual feedback for connectivity status

### Security Considerations
- **Transparent Financial Tracking**: All transactions recorded and visible
- **Performance-Based Risk Assessment**: Credit limits tied to historical performance
- **Collateral Protection**: Overdraft backed by agent deposits

## Localization Context
- **Primary Locale**: Swahili (sw-TZ)
- **Currency**: Tanzanian Shilling (TZS)
- **Number Formatting**: Local currency format with no decimal places

## Development Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation
1. Clone the repository
   ```
   git clone https://github.com/mxsafiri/smart-wakala.git
   cd smart-wakala
   ```

2. Install dependencies
   ```
   cd frontend
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

## Future Enhancements
1. **Advanced Performance Scoring**: More sophisticated algorithm for credit risk assessment
2. **Enhanced Notification System**: SMS and push notification integration
3. **Comprehensive Reporting**: Advanced financial reports and analytics
4. **Agent Network Management**: Tools for managing multiple agents
5. **Integration with Mobile Money APIs**: Direct connection to telecom APIs

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
