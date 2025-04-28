# 🌍 Tresit - Travel Bucket List App



## 📝 Description

Tresit is a modern web application that helps you track and manage your travel bucket list. Plan your future adventures, mark countries as visited, and visualize your travel statistics. The app provides an intuitive interface for exploring countries worldwide and organizing your travel plans.

## ✨ Features

- **🔍 Explore Countries**: Browse and search countries from around the world
- **📊 Country Details**: View detailed information about each country
- **🏷️ Travel Status Tracking**: Track countries as Wishlist, Planning, Booked, or Visited
- **📈 Travel Statistics**: Visualize your travel plans and achievements with charts
- **📓 Travel Log**: Filter and view your saved destinations by status
- **🔎 Dynamic Filtering**: Search and filter countries by region, name, and other criteria
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🌓 Dark/Light Mode**: Toggle between light and dark themes for comfortable viewing

## 🛠️ Tech Stack

- **⚛️ Frontend**: React 19, React Router 7
- **⚡ Build Tool**: Vite 6
- **🧠 State Management**: React Context API
- **🎨 Styling**: CSS with custom variables for theming
- **📊 Data Visualization**: Recharts
- **🔄 HTTP Client**: Axios
- **🎭 Icons**: FontAwesome, React Icons
- **🌐 API**: REST Countries API
- **🚀 Deployment**: Netlify

## 🚀 Setup Instructions

1. **📥 Clone the repository**
   ```bash
   git clone https://github.com/Ishan007-bot/Tresit-Travel-Bucket-List.git
   cd Tresit-Travel-Bucket-List
   ```

2. **📦 Install dependencies**
   ```bash
   npm install
   ```

3. **🔑 Set up environment variables**
   - Create a `.env` file based on `.env.example`
   - Add your API keys if required

4. **🏃‍♂️ Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:3000

5. **🏗️ Building for production**
   ```bash
   npm run build
   ```
   The built files will be in the `dist/` directory.

## 📸 Screenshots

<!-- 
Add screenshots of your application here:
1. Place screenshot images in the public/screenshots/ directory
2. Update the image paths below with your actual screenshot filenames
-->

![Home Page](https://github.com/Ishan007-bot/Tresit-Travel-Bucket-List/blob/b05852548d1665210d12b0a8047db86fa6248572/home.png)
![Explore Countries](https://github.com/Ishan007-bot/Tresit-Travel-Bucket-List/blob/bc019596339115e188609bdff1841015507acf4c/explore.png)
![Country Details](./public/screenshots/details.png)
![Travel Log](./public/screenshots/log.png)

> Note: Replace the placeholder images above with actual screenshots of your application.

## 🌐 Live Demo

Visit the live application at [https://tresittravel.netlify.app](https://tresittravel.netlify.app)

## 📑 Table of Contents

- [Installation](#-installation)
- [Usage](#-usage)
- [Architecture](#-architecture)
- [Folder Structure](#-folder-structure)
- [Technologies Used](#-technologies-used)
- [Performance Optimizations](#-performance-optimizations)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ishan007-bot/Tresit-Travel-Bucket-List.git
   cd Tresit-Travel-Bucket-List
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file based on `.env.example`
   - Add your Firebase configuration (if using Firebase)

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🎮 Usage

### ✈️ Adding Countries to Your Travel List
1. Browse countries on the home page
2. Click on "View Details" to see more information about a country
3. Set your travel status (Wishlist, Planning, Booked, or Visited)
4. Add optional notes about your travel plans

### 📋 Viewing Your Travel Log
1. Navigate to "Travel Log" in the menu
2. Filter your destinations by status
3. View your travel statistics and visualizations
4. Edit or remove destinations as needed

## 🏗️ Architecture

Tresit follows a component-based architecture using React. It uses Context API for state management, and implements a service layer for API interactions.

### 🧩 State Management
- `TravelContext`: Manages saved destinations and travel plans
- `ThemeContext`: Handles theme preferences (dark/light mode)
- `AuthContext`: Manages user authentication state

### 🔄 Data Flow
1. API requests are made through service functions
2. Services return data to components or contexts
3. Components render data from context or local state
4. User interactions trigger context updates

## 📁 Folder Structure

```
tresit/
├── public/               # Static assets
│   ├── icons/            # App icons for PWA
│   └── screenshots/      # App screenshots
├── src/                  # Source code
│   ├── components/       # Reusable UI components
│   ├── contexts/         # Context providers for state management
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Top-level page components
│   ├── services/         # API and data services
│   ├── styles/           # CSS styles
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main App component
│   └── main.jsx          # Entry point
├── .env                  # Environment variables
├── index.html            # HTML template
└── vite.config.js        # Vite configuration
```

## 🔨 Technologies Used

### 🧱 Core
- [React](https://reactjs.org/) - UI library
- [React Router](https://reactrouter.com/) - Routing
- [Vite](https://vitejs.dev/) - Build tool and development server

### 🧠 State Management
- React Context API - Global state management

### 📊 Data Visualization
- [Recharts](https://recharts.org/) - Charts and data visualization

### 🌐 Networking
- [Axios](https://axios-http.com/) - HTTP client

### ⚡ Optimization
- Code-splitting with React.lazy
- Image lazy loading
- Service Worker for caching and offline support

### 🔌 APIs
- [REST Countries API](https://restcountries.com/) - Country data
- Optional: [Firebase](https://firebase.google.com/) - Authentication and database

## ⚡ Performance Optimizations

Tresit implements several performance optimizations:

- **🔀 Code Splitting**: Routes are loaded lazily with React.lazy and Suspense to reduce initial bundle size
- **🖼️ Image Optimization**: Images are lazy-loaded using IntersectionObserver for better performance
- **🧠 Memoization**: Components use React.memo to prevent unnecessary re-renders
- **🔄 Service Worker**: Assets are cached for faster loading and offline support
- **📋 Mock Data Fallback**: Local data is used when API is unavailable
- **✨ CSS Animations**: Hardware-accelerated animations for smooth transitions

## 🚢 Deployment

### 🏗️ Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### 🚀 Deployment Options

- **☁️ Netlify**: Connect your GitHub repository to Netlify for automatic deployments
- **🔼 Vercel**: Similar to Netlify, provides easy deployments from Git repositories
- **🔥 Firebase Hosting**: Good option if you're also using Firebase for backend

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add some amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🔃 Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
