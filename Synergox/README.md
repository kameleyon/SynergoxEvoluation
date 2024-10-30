# 🚀 Synergox

> A modern AI-powered chat interface with dynamic theming and responsive design.

## ✨ Key Features

- 🌓 **Dynamic Theming** - Seamless dark/light mode switching with smooth transitions
- 📱 **Responsive Design** - Mobile-first approach with adaptive sidebar
- 🤖 **AI Integration** - Smart chat interface with context-aware interactions
- 📊 **Activity Tracking** - Recent activities dashboard with search functionality
- ⚡ **Quick Actions** - Customizable action buttons with shortcut support
- 🔐 **Secure Auth** - Complete authentication system with Clerk

## 🛠️ Built With

- **React** - UI Framework
- **Vite** - Build Tool
- **Clerk** - Authentication
- **Framer Motion** - Animations
- **Lucide Icons** - UI Icons

## 🚀 Getting Started

1. **Install Dependencies**
```bash
npm install
```

2. **Set Environment Variables**
```bash
# .env
VITE_CLERK_PUBLISHABLE_KEY=your_key_here
```

3. **Start Development Server**
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/     # React components
├── fct/           # Reusable functions
│   └── createProject.js  # Project management functions
├── global.css     # Global styles
├── App.jsx        # Main component
└── main.jsx      # Entry point
```

## 💡 Usage Examples

### Creating a New Project
```javascript
import { createProject } from "../fct/createProject";

const handleNewProject = () => {
  const newProject = createProject("My New Project");
  // Handle the new project
};
```

### Authentication with Clerk
```jsx
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

const Dashboard = () => {
  return (
    <>
      <SignedIn>
        <div className="dashboard">
          <h1>Welcome to Your Dashboard</h1>
          {/* Dashboard content */}
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License

---

<p align="center">Made with ❤️ by Synergox Team</p>
