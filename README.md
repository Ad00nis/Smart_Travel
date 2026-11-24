# Smart Travel Planner 🌍

**An intelligent, full-stack travel discovery and planning platform designed to simplify destination research, travel comparison and itinerary management.**

Smart Travel Planner is a web application that helps users discover countries and holiday destinations based on their interests, budget and travel preferences. It combines data-driven destination discovery, climate insights, comparative analysis, AI-assisted itinerary generation and currency conversion in one integrated platform.

## ✨ Key Features

### 🌎 Intelligent Country Discovery
- Explore 35 countries across multiple continents.
- Filter destinations by continent, interests, travel preferences and budget.
- Interactive charts and budget controls for exploring travel options.
- Access country profiles containing descriptions, climate information, average temperatures, peak travel periods and rainy seasons.

### 📍 Destination Exploration & Comparison
- Explore multiple holiday destinations within each country.
- Access destination-specific information, including climate and travel costs.
- Compare two destinations within the same country to evaluate their respective travel characteristics and suitability.

### 🤖 AI-Powered Itinerary Generation
- Generate personalised travel itineraries using AI integration.
- Customise generated itineraries by adding activities and adjusting schedules.
- Modify activity timings to suit individual travel preferences.
- Export completed itineraries as downloadable PDF documents.

### 💱 Currency Conversion
- Integrated currency conversion functionality for international travel planning.
- Retrieve up-to-date exchange-rate information through external data integration.
- Simplify financial planning by allowing users to check currency values before travelling.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Component-based frontend development and application interfaces |
| JavaScript | Application logic and interactive functionality |
| Tailwind CSS | Responsive styling and UI development |
| Node.js | Backend runtime environment |
| Express.js | REST API development and backend routing |
| SQLite | Application data persistence |
| Groq API | AI-powered itinerary generation |
| External APIs | Currency and other integrated data services |
| Git & GitHub | Version control and source code management |
| Render | Application deployment |

## 🏗️ Application Architecture

The application follows a full-stack architecture, separating the frontend presentation layer from backend services and external integrations.

**Frontend**
- React-based user interface.
- Interactive filtering, charts and destination comparison.
- Itinerary management and PDF export functionality.
- API communication with backend services.

**Backend**
- Node.js and Express REST API.
- Handles application requests and external service integrations.
- Manages AI-powered itinerary generation.
- Coordinates communication between the frontend, data storage and external APIs.

**External Integrations**
- Groq API for AI-generated travel itineraries.
- Currency data services for exchange-rate information.

## 🚀 Getting Started

### Prerequisites
- Node.js and npm
- MongoDB connection
- Groq API key
- Required external API credentials

### Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/smart-travel-planner.git
cd smart-travel-planner
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory and configure the required environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
```

Add any additional environment variables required by your external integrations.

Start the backend:

```bash
npm start
```

### Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The application should now be accessible through the local development URL provided by Vite.

## 🔐 Environment & Security

- API credentials are stored in environment variables rather than committed to source control.
- Environment files should remain excluded through `.gitignore`.
- External API requests are handled through the appropriate application services.

## 🎯 Project Objective

Smart Travel Planner demonstrates the practical application of full-stack development, third-party API integration, AI-assisted functionality and interactive data-driven interfaces.

The project focuses on bringing multiple stages of travel planning into one cohesive experience, reducing the need to switch between separate platforms for destination research, comparison, itinerary preparation and currency checks.

---

**Built with React, Node.js, Express, MongoDB and AI integration.**
