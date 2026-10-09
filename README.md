# ExamHelper

## Gemini credentials

The Gemini client in `server.ts` reads `GEMINI_API_KEY` from the server environment. It also accepts the existing `REACT_APP_GEMINI_API_KEY` environment variable for compatibility; neither variable is read by the browser. There is no hardcoded fallback. Without a configured credential, the existing local fallback behavior remains available.

For local development, copy `.env.example` to `.env` and set your credential privately. The existing `.gitignore` excludes `.env` and its variants while keeping the empty example file.

For a deployed backend, configure `GEMINI_API_KEY` in its runtime environment. Do not rename it to `VITE_GEMINI_API_KEY` or reference it through `import.meta.env`: Vite includes `VITE_` variables in browser bundles. Keep Netlify secrets scanning enabled and do not add scan exclusions for this credential.

The removed fallback credential must be treated as compromised. Revoke or rotate it in Google AI Studio, then update the backend environment with the replacement. Removing it from the current source does not remove it from earlier commits; the repository owner must coordinate any history cleanup with collaborators. Never paste credentials into source, documentation, or build logs.

## Netlify deployment

The current Netlify configuration builds the Vite frontend and publishes `dist`. It does not run the Express backend in `server.ts`. Hosting the existing `/api/*` routes on Netlify requires a separate migration to Netlify Functions; adding an environment variable alone does not deploy that backend.
