# Breezy Weather App

## Overview
Breezy Weather App is a modern weather application built with React, TypeScript, and Vite. It provides users with real-time weather data, forecasts, and interactive weather maps. The app is designed to be responsive and user-friendly, offering a seamless experience across devices.

### Key Features
- **Current Weather**: Displays real-time weather conditions, including temperature, humidity, wind speed, and more.
- **Forecast**: Provides a detailed weather forecast for the upcoming days.
- **Interactive Weather Map**: Features a map with layers for temperature, precipitation, and wind, powered by OpenWeatherMap.
- **Air Quality Index**: Shows the air quality index for the selected location.
- **Sunrise and Sunset Times**: Displays the sunrise and sunset times for the day.
- **UV Index**: Provides the UV index to help users plan outdoor activities safely.
- **Theme Toggle**: Supports light and dark themes for better accessibility.
- **Location Search**: Allows users to search for weather data by city or use geolocation to detect their current location.

### Technologies Used
- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **APIs**: WeatherAPI for weather data, OpenWeatherMap for map layers
- **UI Components**: Custom reusable components built with accessibility in mind

### Folder Structure
- **src/components**: Contains reusable UI components and weather-specific components like `WeatherMap`, `WeatherCard`, and `ForecastCard`.
- **src/pages**: Includes the main pages of the app, such as `Index.tsx` for the home page.
- **src/services**: Contains API service files, such as `weatherService.ts` for fetching weather data.
- **src/hooks**: Custom React hooks for theme management and toast notifications.
- **src/types**: TypeScript type definitions for weather data and other entities.

### How to Run the App
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd breezy-weather-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the app in your browser at `http://localhost:8080`.

### Deployment
The app is deployed on Vercel for production. Visit the live app at: [Breezy Weather App](https://breezy-weather-app.vercel.app)

### Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to improve the app.

### License
This project is licensed under the MIT License.

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d1ed41fa-0e77-49e7-b199-b10ed1576655

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d1ed41fa-0e77-49e7-b199-b10ed1576655) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d1ed41fa-0e77-49e7-b199-b10ed1576655) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
