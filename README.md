# Atyant Assignment

A modern React + Vite application showcasing various product offerings and services with smooth animations and responsive design.

## Table of Contents

- [Project Overview](#project-overview)
- [Folder Structure](#folder-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Features](#project-features)
- [Configuration Files](#configuration-files)

## Project Overview

This is a landing page application built with React and Vite, featuring multiple product pages with animated components and responsive layouts. The application showcases different offerings like Career OS, College Programs, Launchpad, Working Pro, and Final Year packages.

## Folder Structure

```
atyant-assignment/
├── src/
│   ├── components/           # Reusable React components
│   │   ├── FAQItem.jsx       # FAQ accordion item component
│   │   ├── Footer.jsx        # Footer component
│   │   ├── Hero.jsx          # Hero section component
│   │   ├── Navbar.jsx        # Navigation bar component
│   │   ├── PricingCard.jsx   # Pricing card component
│   │   └── TestimonialCard.jsx # Testimonial display component
│   │
│   ├── pages/                # Page components
│   │   ├── CareerOSPage.jsx       # Career OS product page
│   │   ├── CollegePage.jsx        # College program page
│   │   ├── FinalYearPage.jsx      # Final year program page
│   │   ├── LaunchpadPage.jsx      # Launchpad product page
│   │   └── WorkingProPage.jsx     # Working Pro product page
│   │
│   ├── data/                 # Static data and content
│   │   └── siteContent.js    # Centralized content data (text, pricing, FAQ, etc.)
│   │
│   ├── App.jsx               # Main application component with routing
│   ├── main.jsx              # React DOM render entry point
│   └── index.css             # Global styles
│
├── public/                   # Static assets (images, favicons, etc.)
│
├── package.json              # Project dependencies and scripts
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration for Tailwind
├── index.html                # HTML entry point
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

## Tech Stack

### Frontend Framework & Build
- **React** (18.3.1) - UI library
- **Vite** (5.4.10) - Build tool and dev server
- **Vite React Plugin** (4.3.3) - React support for Vite

### Styling
- **Tailwind CSS** (3.4.14) - Utility-first CSS framework
- **PostCSS** (8.4.49) - CSS transformation tool
- **Autoprefixer** (10.4.20) - Vendor prefix automation

### Animations & Icons
- **Framer Motion** (11.11.17) - Smooth animations and transitions
- **Lucide React** (0.454.0) - Icon library

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd atyant-assignment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:5173/
   ```

## Available Scripts

### Development
```bash
npm run dev
```
Starts the Vite development server with hot module replacement (HMR). The app will automatically reload when you make changes.

### Build for Production
```bash
npm run build
```
Creates an optimized production build in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing before deployment.

## Project Features

### Components
- **Navbar** - Navigation header with responsive menu
- **Hero** - Landing page hero section with call-to-action
- **PricingCard** - Pricing display card component
- **FAQItem** - Accordion-style FAQ items
- **TestimonialCard** - Customer testimonial display
- **Footer** - Page footer with links and information

### Pages
- **Career OS Page** - Career development product showcase
- **College Page** - College preparation programs
- **Launchpad Page** - Starter program with community group
- **Working Pro Page** - Professional development programs
- **Final Year Page** - Final year specific courses

### Features
- Smooth animations using Framer Motion
- Responsive design for all screen sizes
- Tailwind CSS for modern styling
- Organized component and page structure
- Centralized content data management
- Icon library for visual enhancements

## Configuration Files

### `vite.config.js`
Vite configuration file that sets up React plugin and build options.

### `tailwind.config.js`
Tailwind CSS configuration for customizing colors, fonts, and design tokens.

### `postcss.config.js`
PostCSS configuration that processes Tailwind CSS.

### `package.json`
Contains project metadata, dependencies, and npm scripts.

### `index.html`
Main HTML file - entry point for the application.

### `.gitignore`
Specifies which files and folders should be ignored by Git (node_modules, dist, .env, etc.).

## Environment Setup

To set up the application environment:

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in the values for the environment variables:
   - `VITE_API_URL`: Points to your backend API server (e.g., `http://localhost:5000` for local development or a remote API URL).
   - `VITE_APP_URL`: Specifies the public HTTPS origin of your frontend application (required for Cashfree callback return URLs).
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth client ID, used to authenticate users via Google Sign-In.
   - `VITE_GA_ID`: (Optional) Your Google Analytics tracking ID.

## Deployment

To deploy the application:

1. Build the project:
   ```bash
   npm run build
   ```

2. The `dist/` folder contains the optimized production build

3. Deploy the `dist/` folder to your hosting service (Vercel, Netlify, GitHub Pages, etc.)

## Notes

- The application uses Vite for fast development experience
- All pages are built with Framer Motion for smooth animations
- Tailwind CSS is used for all styling - no CSS files need modification
- Static content is managed in `src/data/siteContent.js` for easy updates

## Support

For questions or issues, refer to the official documentation:
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Framer Motion Documentation](https://www.framer.com/motion/)
