<div align="center">

# 🎮 Code4Kids - Learn Programming Through Adventure

**An Interactive Educational Game Teaching Programming Fundamentals**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

 • [📚 Documentation](#documentation) 

</div>

## 🌟 Overview

Code4Kids is an immersive educational platform that transforms programming concepts into exciting adventures! Through a carefully crafted 9-level journey, children learn fundamental programming concepts including variables, conditional statements, and loops while helping characters in a magical world.

## 🎯 Game Structure

### 🏘️ World 1: Village Basics (Variables)
Master the art of storing and manipulating data through village adventures.

- **Level 1:** Help collect exactly 5 apples using a counter variable
- **Level 2:** Store villager names in variables to deliver messages  
- **Level 3:** Use math with variables to calculate potion ingredients

### 🌲 World 2: Forest Decisions (If/Else)
Navigate through choices and learn conditional logic in mystical forests.

- **Level 4:** Choose different paths based on weather conditions
- **Level 5:** Cast different spells based on monster types
- **Level 6:** Help villagers with different problems using conditional logic

### ⛰️ World 3: Mountain Challenges (Loops)
Conquer repetitive tasks and master the power of iteration.

- **Level 7:** Cross a bridge by repeating steps 10 times
- **Level 8:** Clear rocks using a while loop until path is clear
- **Level 9:** Combine all concepts to defeat the final dragon

## 🚀 Features

✨ **Interactive Learning Environment**
- Drag-and-drop code blocks for intuitive programming
- Real-time visual feedback and animations
- Progressive difficulty curve suitable for beginners

🎨 **Engaging User Experience**  
- Beautiful, kid-friendly interface design
- Character-driven storytelling
- Achievement system and progress tracking

🔧 **Educational Tools**
- Step-by-step tutorials and hints
- Code explanation and debugging assistance
- Performance analytics for educators

## 🛠️ Tech Stack (Initial)

| Technology | Purpose | Version |
|------------|---------|---------|
| **React.js** | Frontend Framework | ^18.0.0 |
| **Tailwind CSS** | Styling & UI Components | ^3.0.0 |
| **Firebase** | Backend & Authentication | ^9.0.0 |
| **Vercel** | Deployment & Hosting | Latest |

## 🏗️ Project Structure

```
code4kids/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── GameEngine/      # Game logic components
│   │   ├── UI/              # Interface components
│   │   └── Levels/          # Individual level components
│   ├── contexts/            # React context providers
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Helper functions
│   ├── assets/              # Images, sounds, animations
│   └── styles/              # Global styles and themes
├── public/                  # Static assets
├── docs/                    # Project documentation

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase account for backend services

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kushal0034/Code4Kids
   cd code4kids
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Firebase configuration:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to see the application running.

## 🎮 How to Play

1. **Create an Account:** Sign up to track your progress across all levels
2. **Choose Your Adventure:** Start with World 1 and progress through villages, forests, and mountains
3. **Drag & Drop:** Use visual programming blocks to solve challenges
4. **Learn by Doing:** Each level introduces new concepts with hands-on practice
5. **Celebrate Success:** Earn achievements and unlock new worlds!



## 👥 Team

**Scrum Master & Lead Developer**
- **Kushal Venkat Mikkilineni** - 11836919
  

**Development Team**
- **Swetha Vahana Reddy Morreppa** - 11715081
  

- **Lavanya Jonnalagadda** - 11702681
  

**Project Manager**
- **Soumendranath Banerjee** (IA)



## 🎯 Educational Impact

Code4Kids aims to:
- Introduce programming concepts in an age-appropriate manner
- Build computational thinking skills
- Foster problem-solving abilities
- Create positive associations with technology and coding
- Prepare students for future STEM education

## Support 

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/kushal0034/Code4Kids/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/kushal0034/Code4Kids/discussions)

---

<div align="center">

**Made with ❤️ for young coders everywhere**

</div>
