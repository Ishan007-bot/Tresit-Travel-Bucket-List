# Tresit - Travel Bucket List Application

A visual bucket list for travel destinations with features to mark countries as wished or visited, explore country details, and track your travel progress.

## Features

- Browse countries from around the world with a clean, responsive UI
- View detailed information for each country
- Save countries to your bucket list (wishlist or visited)
- Track your travel statistics
- Search and filter countries by region, population, etc.

## Technology Stack

- React.js (Functional Components & Hooks)
- React Router for navigation
- Context API for state management
- REST Countries API for country data
- Custom CSS for styling
- LocalStorage for data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
```

2. Navigate to the project directory
```bash
cd tresit
```

3. Install dependencies
```bash
npm install
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
tresit/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── DestinationCard.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   └── Loading.jsx
│   ├── contexts/
│   │   └── TravelContext.jsx
│   ├── pages/
│   │   ├── AddDestination.jsx
│   │   ├── CountryDetails.jsx
│   │   ├── HomePage.jsx
│   │   └── TravelLog.jsx
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [REST Countries API](https://restcountries.com/) for providing country data
- [React Router](https://reactrouter.com/) for routing
- [Recharts](https://recharts.org/) for visualizations
