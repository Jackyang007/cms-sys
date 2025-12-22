# CMS Frontend (React)

A lightweight React frontend that uses Strapi APIs and the Strapi Design System components.

## Getting started

```bash
cd cms-frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## API base URL

The app reads `VITE_API_BASE` from `.env`.

```
VITE_API_BASE=http://127.0.0.1:11337
```

## Pages

- `/` activities list
- `/activities/:id` activity edit view
