# ExamHelper

## Gemini credentials

The Gemini client in `server/api.ts` reads credentials only from the server environment. It accepts the existing `REACT_APP_GEMINI_API_KEY` setting first, then `GEMINI_API_KEY`; neither variable is read by the browser. There is no hardcoded fallback. Without a configured credential, the existing local fallback behavior remains available.

For local development, copy `.env.example` to `.env` and set your credential privately. The existing `.gitignore` excludes `.env` and its variants while keeping the empty example file.

In Netlify, open **Project configuration > Environment variables** and privately set your newly rotated Gemini key as `GEMINI_API_KEY`, with the **Functions** scope and the deployment contexts you use (including Production). Remove the old `REACT_APP_GEMINI_API_KEY` setting when switching to the new name so it cannot take precedence. Redeploy after changing environment variables. Do not rename it to `VITE_GEMINI_API_KEY` or reference it through `import.meta.env`: Vite includes `VITE_` variables in browser bundles. Keep Netlify secrets scanning enabled and do not add scan exclusions for this credential.

The removed fallback credential must be treated as compromised. Revoke or rotate it in Google AI Studio, then update the backend environment with the replacement. Removing it from the current source does not remove it from earlier commits; the repository owner must coordinate any history cleanup with collaborators. Never paste credentials into source, documentation, or build logs.

## Netlify deployment

Netlify builds the Vite frontend into `dist` and deploys the existing `/api/*` routes through `netlify/functions/api.mts`. The function shares the API implementation with the local Express server without starting a listening server or importing Vite in production. The browser keeps using the same API URLs.

Gemini requests go directly to Google using your own server-side key, not Netlify AI Gateway. Automatically injected gateway credentials are ignored when `GOOGLE_GEMINI_BASE_URL` is present; do not set that variable for direct Google access. Google API usage and quota apply to your key. The API endpoints are public, so configure key restrictions and quota alerts in Google before sharing the site widely.

After redeployment, visit `/api/health` on your site. `hasApiKey: true` confirms a credential was available to the function; it does not verify that Google accepts the key or that quota is available. AI endpoints retain their existing local fallbacks if Gemini is unavailable. Uploaded documents must fit Netlify's synchronous function request limits; base64 encoding increases the request size.
