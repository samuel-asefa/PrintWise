<h1 align="center">PrintWise</h1>

<p align="center">
  <em>Find the best filament and optimal print settings for your 3D printing projects.</em>
</p>

Printwise is a modern, responsive web application designed for 3D printer users. By answering a few simple questions about your project's requirements (strength, flexibility, detail, outdoor use, food safety), PrintWise recommends the ideal filament type and provides tailored print settings to ensure high-quality results.

## ✨ Features

- **Smart Recommendations:** Algorithms match your project needs against popular filaments (PLA, ABS, PETG, TPU).
- **Custom Print Settings:** Get intelligent suggestions for nozzle temperature, bed temperature, infill, and print speed based on your required strength and detail.
- **Premium UI/UX:** A stunning, fully-responsive dark theme layout featuring glassmorphism cards, vibrant accents, smooth micro-animations, and the beautiful 'Outfit' font.
- **Instant Results:** Real-time percentage matches update instantly as you adjust the requirement sliders.

## 🚀 Technology Stack

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** TypeScript
- **Styling:** Custom Vanilla CSS with a modern dark theme and glassmorphism. (Uses latest CSS variables for reliable theming and `backdrop-filter` for glass effects). PostCSS is configured for future extensibility.
- **Typography:** [Outfit (Google Fonts)](https://fonts.google.com/specimen/Outfit)

## 🛠️ Getting Started

### Prerequisites

You will need [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/PrintWise.git
   cd PrintWise
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

## 🎨 Design System

PrintWise uses a carefully curated design system to ensure a premium look and feel:
- **Backgrounds:** Deep slate (`#0f172a`) with subtle glowing orbs mimicking ambient light.
- **Materials:** Frosted glass panels allowing background gradients to softly bleed through.
- **Interactions:** Custom-styled range sliders, glowing checkboxes, and energetic button hovers create an engaging user experience.

## 📝 License

This project is licensed under the MIT License.