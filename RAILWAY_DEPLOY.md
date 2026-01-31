# Deploying Govi-Isuru to Railway (No Dockerfile)

Yes, you can deploy without Dockerfiles! Railway uses **Nixpacks** to automatically detect and build your application based on files like `package.json` and `requirements.txt`.

## Prerequisites
1. **CRITICAL**: I have just deleted the `Dockerfile`s from your local project. **You MUST commit and push these deletions to GitHub** now.
   ```bash
   git add .
   git commit -m "Remove Dockerfiles for Railway Nixpacks"
   git push origin <your-branch-name>
   ```
   *Railway will only switch to Nixpacks if it sees these files are gone from the repo.*
2. Create a [Railway](https://railway.app/) account.

## Step-by-Step Deployment Guide

### 1. Database (MongoDB)
1. In your Railway project, click **New** -> **Database** -> **MongoDB**.
2. Once created, go to the **Variables** tab of the MongoDB service.
3. Copy the `MONGO_URL`.

### 2. Backend Service (Node.js)
1. Click **New** -> **GitHub Repo** -> Select `Govi-Isuru`.
2. **Settings**:
   - **Root Directory**: `server`
   - **Build Command**: (Leave empty, Railway will detect `npm install`)
   - **Start Command**: `npm start` (I added this script for you)
   - **Watch Patterns**: `server/**`
3. **Variables**:
   - `MONGO_URI`: (Paste `MONGO_URL`)
   - `JWT_SECRET`: (Set a strong secret)
   - `REFRESH_TOKEN_SECRET`: (3f6cee2a0e49e05bded468cde1bb7d1d30ee93aa3c628d1cb41c74b1df9fc931)
   - `AI_SERVICE_URL`: `https://govi-ai.up.railway.app` (Add this after deploying AI Service)
   - `HUGGINGFACE_API_TOKEN`: `hf_...` (Your Hugging Face Token)
   - `NEWS_API_KEY`: `...` (Your News API Key)
   - `GMAIL_USER`: `your-email@gmail.com`
   - `GMAIL_APP_PASSWORD`: `your-app-password`
   - `FRONTEND_URL`: `https://govi-isuru.up.railway.app` (Add this after deploying Frontend)
4. **Deploy**. Railway will build utilizing Nixpacks.
5. Go to **Networking** -> Generate Domain (e.g., `govi-backend.up.railway.app`).

### 3. AI Service (Python)
1. Click **New** -> **GitHub Repo** -> Select `Govi-Isuru`.
2. **Settings**:
   - **Root Directory**: `ai-service`
   - **Build Command**: (Leave empty, Railway detects `requirements.txt`)
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Watch Patterns**: `ai-service/**`
3. **Variables**:
   - `PORT`: `8000` (Optional, as Railway assigns a port, but `uvicorn` needs to bind to it. Using `$PORT` in the command is safest).
4. **Deploy**.
5. Go to **Networking** -> Generate Domain (e.g., `govi-ai.up.railway.app`).
6. **Update Backend**: Add `AI_SERVICE_URL` -> `https://govi-ai.up.railway.app` in Backend Variables.

### 4. Frontend Service (React)
1. Click **New** -> **GitHub Repo** -> Select `Govi-Isuru`.
2. **Settings**:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run serve` (I added this script to use `serve` package)
   - **Watch Patterns**: `client/**`
3. **Variables**:
   - `REACT_APP_API_URL`: `https://govi-backend.up.railway.app` (Your Backend Domain)
     - **CRITICAL**: This must be added *before* deployment so it gets baked into the build.
4. **Deploy**.
5. Go to **Networking** -> Generate Domain.

## Key Changes Made for This Support
- **Server**: Added `"start": "node index.js"` to `package.json`.
- **Client**: Added `serve` dependency and `"serve": "serve -s build -l 3000"` script. ensure you run `npm install` and push changes.

## Troubleshooting
- If Frontend gives "Invalid Host Header", ensure `serve` is running correctly.
- If Backend fails, check `MONGO_URI` connection string.
- **If AI Service fails with `ImportError: libxcb.so.1: cannot open shared object file`**:
  - This is already fixed in `ai-service/nixpacks.toml` with the required system libraries.
  - Ensure you've committed and pushed the updated `nixpacks.toml` file.
  - Redeploy the AI service on Railway to apply the changes.

