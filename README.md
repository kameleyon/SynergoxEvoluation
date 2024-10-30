# SynergoxEvoluation

A comprehensive development ecosystem that combines powerful tools for modern software development and collaboration, featuring AI-assisted coding capabilities.

## 🚀 Core Components

### BoltNew
An advanced web-based development environment that provides:
- AI-powered development assistance
- Real-time collaborative coding capabilities
- Integrated chat interface
- Code editor with syntax highlighting
- Live preview functionality
- Terminal integration
- File system management
- Theme customization
- Responsive design for various screen sizes

### Synergox
A collaborative development platform featuring:
- Real-time project collaboration
- Code editing with live updates
- Project management capabilities
- Integrated chat system
- Firebase integration for real-time data synchronization
- Modern React-based architecture
- Customizable project workspaces
- Authentication with Clerk
- Dynamic theming support

### Botpress Integration
To integrate Botpress with Synergox, you'll need to:

1. Install Botpress globally:
```bash
npm install -g botpress
```

2. Create a new Botpress instance:
```bash
botpress init
cd your-bot-name
```

3. Configure Environment Variables:
Create a `.env` file with the following configuration:
```ini
BOTPRESS_PORT=3001                  # Change the port number if needed
BOTPRESS_SERVER_HOST=0.0.0.0        # To allow external access if needed
BOTPRESS_ADMIN_EMAIL=admin@synergox.com
BOTPRESS_ADMIN_PASSWORD=YourSecurePassword
BOTPRESS_DB=sqlite                  # You can switch to PostgreSQL if you prefer
BOTPRESS_ENV=production             # Set to 'development' for development purposes
```

4. Start Botpress:
```bash
botpress start
```

Access the Botpress Admin Panel at http://localhost:3001/admin using the credentials from your .env file.

## 🛠️ Technology Stack

- **Frontend**: React, Vite
- **State Management**: React Hooks
- **Real-time Communication**: Firebase
- **Authentication**: Clerk
- **Code Editor**: CodeMirror
- **UI Components**: Material-UI, Framer Motion
- **Development Tools**: ESLint, Vitest
- **API Mocking**: JSON Server
- **Chatbot Platform**: Botpress

## 🚦 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/SynergoxEvoluation.git
cd SynergoxEvoluation
```

2. Install dependencies for all components:
```bash
# Install BoltNew dependencies
cd BoltNew
npm install

# Install Synergox dependencies
cd ../Synergox
npm install
```

3. Set up environment variables:
- Configure Firebase credentials in `Synergox/src/firebaseConfig.js`
- Set up Clerk authentication keys in Synergox environment variables:
```bash
# Synergox/.env
VITE_CLERK_PUBLISHABLE_KEY=your_key_here
```

4. Start the development servers:

For BoltNew:
```bash
cd BoltNew
npm run dev
```

For Synergox:
```bash
cd Synergox
npm run dev
```

To run the mock API for Synergox:
```bash
cd Synergox
npm run mock-api
```

## 🤖 Botpress Configuration

### 1. Initial Setup
After starting Botpress, access the Admin Panel at http://localhost:3001/admin and log in using the credentials specified in your .env file.

### 2. Create a New Bot
1. Click on "Create a New Bot"
2. Name it "Synergox Assistant"
3. Customize the bot settings:
   - Set up bot avatar
   - Configure default greetings
   - Adjust response settings

### 3. Configure Flows and Intents

#### Creating Intents
Navigate to the Intents section and create intents for:
- General Programming Questions
- Synergox Feature Guidance
- Project Management Queries
- Collaboration Requests

Example training phrases:
- "How do I create a JavaScript function?"
- "How do I promote a chat to a project?"
- "How do I share my workspace?"

#### Setting up Flows
1. Navigate to Flows
2. Create flows for common scenarios:
   - New User Onboarding
   - Project Creation
   - Feature Guidance
   - Programming Assistance
3. Use the Flow Editor to:
   - Add conversation nodes
   - Set up conditional logic
   - Configure response templates
   - Add action triggers

### 4. Testing and Deployment
- Use the Test Console to verify bot responses
- Test all flows and intents
- Monitor bot performance
- Adjust training data as needed

## 🌟 Features

- **Collaborative Development**: Real-time code collaboration with multiple developers
- **AI-Powered Assistance**: Intelligent code suggestions and development guidance
- **Project Management**: Comprehensive project organization and tracking
- **Live Preview**: Instant visualization of code changes
- **Integrated Chat**: Team communication directly within the development environment
- **Version Control**: Built-in source control management
- **Custom Themes**: Personalized development environment with dark/light mode support
- **Cross-Platform**: Works across different operating systems and browsers
- **Secure Authentication**: Complete authentication system with Clerk
- **Mock API**: Development-ready API mocking with JSON Server
- **Chatbot Integration**: AI-powered conversational interface through Botpress

## 🔧 Configuration

### BoltNew Configuration
- Follow the setup instructions in [BoltNew Documentation](./BoltNew/README.md)
- Configure WebContainer settings as needed

### Synergox Configuration
- Configure Firebase in `Synergox/src/firebaseConfig.js`
- Set up Clerk authentication keys in environment variables
- Customize themes and preferences through the user interface
- Configure JSON Server for API mocking in `db.json`

### Botpress Configuration
- Environment variables in `.env` file
- Bot workflows and responses through Admin Panel
- Integration settings for external services
- Custom flow configurations
- Intent training and NLP settings

## 🤝 Contributing

We welcome contributions to any component of the SynergoxEvoluation ecosystem. Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Additional Resources

- [BoltNew Documentation](./BoltNew/README.md)
- [Synergox Documentation](./Synergox/README.md)
- [Botpress Documentation](https://botpress.com/docs)

## 📞 Support

For support, please:
- Open an issue in the GitHub repository
- Contact the development team
- Check the documentation for common solutions

## ⚡ Performance Considerations

- Ensure proper network connectivity for real-time collaboration features
- Configure caching appropriately for optimal performance
- Monitor resource usage when running multiple components simultaneously
- Consider API rate limits when using mock API server
- Monitor Botpress conversation handling capacity
- Optimize bot flows for better response times

---

Built with ❤️ by the SynergoxEvoluation team
