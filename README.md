<div align="center">
<img width="1200" height="475" alt="Kids Safety Game Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# 🎮 Kids Safety Adventure

An interactive educational game that teaches children about safety through engaging scenarios and gameplay, powered by Google's Gemini AI.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![Built with Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)

</div>

## 🎯 About the Game

Kids Safety Adventure is an interactive 2D game where children explore a vibrant world, encountering various safety scenarios. Players navigate through different environments, make decisions, and learn important safety lessons through engaging gameplay. The game features a reward system, collectible cards, and educational content designed to teach children about safety in a fun and memorable way.

## 🚀 Key Features

- **Interactive Safety Scenarios**: Engage with various safety situations and learn through decision-making
- **Collectible Reward Cards**: Earn cards for completing scenarios and making safe choices
- **Multiple Environments**: Explore different areas with unique safety challenges
- **Character Customization**: Play as different characters with unique abilities
- **Reward System**: Earn coins and special items for completing challenges
- **Educational Content**: Learn about safety in a fun, interactive way
- **Responsive Design**: Play on different devices with a responsive layout
- **AI-Powered Scenarios**: Dynamic content generation using Google's Gemini AI

- **Interactive Scenarios**: Multiple pre-built safety situations to explore
- **Educational Gameplay**: Learn about safety through engaging challenges
- **AI-Powered Feedback**: Google's Gemini AI analyzes choices and provides feedback
- **Reward System**: Collect cards and earn points for safe decisions
- **Kid-Friendly Interface**: Colorful, intuitive design for young players
- **Progress Tracking**: Monitor learning progress and achievements

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16.0.0 or higher)
- npm (comes with Node.js) or Yarn
- Google Gemini API key (for AI features)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/kids-safety-game.git
   cd kids-safety-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open in your browser**
   The application will be available at `http://localhost:5173`

## 🎮 Game Controls

- **Arrow Keys**: Move character
- **Space/Enter**: Interact with objects/NPCs
- **Escape**: Close menus/dialogs
- **M**: Toggle music
- **S**: Toggle sound effects

## 🏗️ Project Structure

```
├── components/           # React components
│   ├── GameCanvas.tsx    # Main game component
│   ├── RewardCard.tsx    # Reward card component
│   ├── Sidebar.tsx       # Game sidebar UI
│   └── CardDetailModal.tsx # Card details modal
├── services/
│   └── geminiService.ts  # Google Gemini AI integration
├── types/                # TypeScript type definitions
├── constants.ts          # Game constants and configurations
├── App.tsx               # Main application component
└── index.tsx             # Application entry point
```

## 🤖 AI Integration

The game uses Google's Gemini AI to:
- Generate dynamic safety scenarios
- Provide feedback on player choices
- Create unique reward cards based on gameplay
- Adapt difficulty based on player performance

## 📦 Dependencies

- React 19.2.0+
- Vite 6.2.0+
- @google/genai 1.30.0+
- TypeScript 5.8.2+

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for powering the game's intelligent features
- The React and Vite teams for the amazing development tools
- All contributors who helped make this project possible

## 📝 Todo

- [ ] Add more safety scenarios
- [ ] Implement multiplayer functionality
- [ ] Add more character customization options
- [ ] Create additional game levels
- [ ] Add more interactive elements to the game world

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

- Node.js 16.0.0 or higher
- npm (comes with Node.js)
- Google Gemini API key ([Get API Key](https://ai.google.dev/))
- Modern web browser (Chrome, Firefox, Safari, or Edge)

## 🚀 Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd ai-deepmind-hackerthon-2025
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The game will be available at `http://localhost:5173`

## 🎮 How to Play

1. Use arrow keys or WASD to move your character
2. Approach characters marked with '!' to start a safety scenario
3. Read the scenario and choose the safest option
4. Earn points and collect cards for making safe choices
5. Try to complete all scenarios while keeping your lives!

## 📱 Game Controls

- **Movement**: Arrow Keys or WASD
- **Interact**: Spacebar or Enter
- **Pause**: ESC key
- **Fullscreen**: F11

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

## 🌐 Deployment

### AI Studio
View and manage your app in [AI Studio](https://ai.studio/apps/drive/1To24UL2AkldCIGehhCVgk2fM_98OuLlg)

## 📚 Documentation

For more detailed documentation, please refer to the [documentation](docs/) directory.

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) to get started.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Google Gemini AI](https://ai.google/)
- Icons from [Lucide](https://lucide.dev/)
