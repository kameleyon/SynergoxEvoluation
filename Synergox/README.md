# 🚀 SynergoX - Next-Generation AI Development Platform

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)
![MUI](https://img.shields.io/badge/MUI-5.14.14-007fff.svg)

SynergoX is a cutting-edge AI-powered development platform that combines intelligent code analysis with seamless collaboration features. Built with modern web technologies, it offers developers a robust environment for efficient coding and team collaboration.

## 🌟 Features

### 💻 AI-Powered Development
- Real-time code generation and analysis
- Intelligent suggestions and optimizations
- Context-aware responses using Claude 3 Sonnet
- Code quality assessment

### 🎨 Modern Interface
- Dynamic code animation background
- Elegant dark/light theme system
- Responsive design across devices
- Intuitive chat interface
- Real-time preview and code panels

### 🤝 Collaboration Tools
- Project sharing and management
- Team communication features
- Code review capabilities
- Activity tracking

### 🛡️ Security & Authentication
- Secure authentication via Clerk.js
- Role-based access control
- API key management
- Data encryption

## 🎯 Implementation Status

### ✅ Completed Features

#### Authentication
- Full user authentication with Clerk.js
- Protected routes and components
- Session management
- User profile integration

#### User Interface
- Interactive code animation background
- Responsive dashboard layout
- Dark/Light theme support
- Real-time theme switching
- Consistent styling across components

#### Background Animation
- Real-time code snippet display
- Intelligent positioning system
- Typing animation effect
- Support for both code and conversation snippets
- Non-intrusive overlay design
- Automatic content rotation
- Theme-aware color adaptation

#### Chat System
- Real-time chat interface
- Message history storage
- Code/Preview panels
- Example queries

### 🚧 In Progress

#### AI Integration
- Claude 3 Sonnet integration
- Response type detection
- Title generation
- Context management

#### Chat History
- Local storage implementation
- Favorite/Archive functionality
- Search capabilities
- Pagination

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16.x
- npm >= 8.x
- Modern web browser
- Clerk.com account for authentication
- OpenRouter API key for AI features

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/synergox.git
cd synergox
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env` file in the root directory:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```

4. Start the development server
```bash
npm run dev
```

5. Start the mock API server
```bash
npm run mock-api
```

6. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Technology Stack

### Frontend
- React 18+
- Material-UI (MUI)
- Emotion for styled components
- React Router for navigation
- Clerk.com for authentication
- JSON Server for mock API

### AI Integration
- OpenRouter API
- Claude 3 Sonnet model
- Context-aware processing
- Response type detection

### Development Tools
- Vite for fast development
- ESLint for code quality
- Vitest for testing

## 📁 Project Structure
```
synergox/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Auth.jsx
│   │   │   └── ClerkAuth.jsx
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CodeAnimation.jsx
│   │   │   └── BackgroundEffects.jsx
│   │   ├── Layout/
│   │   │   └── Layout.jsx
│   │   ├── Settings/
│   │   │   └── Settings.jsx
│   │   ├── Billing/
│   │   │   └── Billing.jsx
│   │   ├── Projects/
│   │   │   └── Projects.jsx
│   │   ├── User/
│   │   │   └── User.jsx
│   │   └── Announcements/
│   │       └── Announcements.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── openRouter.js
│   │   └── chatStorage.js
│   ├── global.css
│   ├── App.jsx
│   └── main.jsx
├── db.json
├── index.html
└── package.json
```

## 🔧 Development Guidelines

### Animation System
The background animation system (`CodeAnimation.jsx`) follows these principles:
- Non-blocking performance
- Smart positioning to avoid overlaps
- Theme-aware styling
- Automatic content rotation
- Typing animation effects

### API Integration
The project uses multiple API integrations:
- Mock API (JSON Server) for development data
- Clerk.js for authentication
- OpenRouter for AI features
- All API calls are centralized in respective service files

### Component Structure
- Each feature has its own directory in `components/`
- Components follow atomic design principles
- Shared components are placed in `components/common/`

### State Management
- Local state with React hooks
- Clerk.js for authentication state
- Context API for theme management
- Local storage for chat history

### Styling
- Material-UI components as base
- Custom styling with Emotion
- Global styles in `global.css`
- Theme customization through MUI theme provider

### Chat System
- Real-time message handling
- Local storage persistence
- Response type detection
- Title generation
- History management

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team
- Project Lead: [Your Name](https://github.com/yourusername)
- Contributors: [List of Contributors](https://github.com/yourusername/synergox/graphs/contributors)

## 📞 Support
- Email: support@synergox.com
- [Issue Tracker](https://github.com/yourusername/synergox/issues)
- [Documentation](https://docs.synergox.com)

---

Built with ❤️ by the SynergoX Team