# CONECTA - San Cristobal Travel App

CONECTA is a modern travel app for San Cristobal de las Casas, Chiapas, designed to connect digital navigation with the old charm of San Cristobal streets. It targets expats, travelers, and international locals.

## Features

- Transit routes and maps
- Local guide with events and attractions
- Market navigator with vendor information
- User reviews
- Multilingual support (English and Spanish)
- Admin dashboard for content management
- Striking visual design with animations and effects

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Maps**: Google Maps API

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account
- Google Maps API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/conecta.git
   cd conecta
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

4. Add your API keys to the `.env` file:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_supabase_project_id
   ```

5. Set up the Supabase database:
   ```
   cd supabase
   npm install
   node test-connection.js
   ```

   Follow the instructions in `supabase/README.md` to set up your database.

6. Start the development server:
   ```
   npm run dev
   ```

7. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Setting Up Supabase

1. Create a new project on [Supabase](https://app.supabase.com)
2. Get your project URL and anon key from the API settings
3. Run the database setup scripts in the `supabase` directory
4. Create an admin user using the provided script:
   ```
   cd supabase
   npm run create-admin
   ```

## Admin Dashboard

Access the admin dashboard at `/admin`. You'll need to log in with an admin account.

To create an admin account:
1. Sign up through the app
2. Use the admin creation script to set the user as an admin

## Development

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build

## Localization

The app supports English (default) and Spanish languages. Language can be switched in the app settings.
