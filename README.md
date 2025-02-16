# Filmyuk - Movie Discovery App

A modern movie discovery application built with React, NextUI, and TMDB API. This project was created as a take-home test for GoBlock.

## Features

- Browse trending movies
- Search for specific movies
- View detailed movie information
- Watch movie trailers
- Add movies to favorites
- Share movies on social media
- Responsive design for all devices
- Modern UI with NextUI components

## Tech Stack

- React 18
- TypeScript
- Vite
- NextUI
- TailwindCSS
- React Router DOM
- TMDB API

## Getting Started

1. Clone the repository

2. Install dependencies using your preferred package manager:

   ```bash
   # Using npm
   npm install

   # Using Bun
   bun install
   ```

3. Create a `.env` file in the root directory and add your TMDB API key:
   ```
   VITE_TMDB_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   # Using npm
   npm run dev

   # Using Bun
   bun dev
   ```

## Scripts

```bash
# Development
npm run dev     # or: bun dev

# Build
npm run build   # or: bun run build

# Preview
npm run preview # or: bun run preview

# Lint
npm run lint    # or: bun run lint
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── config/        # Configuration files
├── hooks/         # Custom React hooks
├── layouts/       # Page layouts
├── pages/         # Route pages
├── styles/        # Global styles
└── types/         # TypeScript type definitions
```

## Best Practices

- Component-based architecture
- TypeScript for type safety
- Responsive design
- Error handling
- Loading states
- Clean and maintainable code
- SOLID principles
- Proper file structure

## Deployment

The application can be deployed to Vercel or Netlify. The build command is:

```bash
npm run build
```

## License

MIT
