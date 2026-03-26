# AI Assistant Setup

## 1) Create environment file
Copy `.env.example` to `.env` and set your key:

- `OPENAI_API_KEY`
- `OPENAI_MODEL` (optional, default is `gpt-4o-mini`)
- `PORT` (optional, default `3001`)

## 2) Start backend API
```bash
npm run server
```

## 3) Start frontend
In another terminal:
```bash
npm run dev
```

## 4) Test assistant
Open the website and click the floating **Ask AI** button.

The widget calls `/api/assistant` (proxied by Vite in development) and falls back to local logic if the API is unavailable.
