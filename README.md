# Gmail Labels Manager (gPanel Cloud Integration Challenge)

This repository contains a small full-stack application that integrates with the **Google Gmail API** to manage Gmail **Labels**:

List Gmail Labels (DataGrid)  
Create a Gmail Label  
Update a Gmail Label  
Delete a Gmail Label  
Click a label row to view label details

---

## Tech Stack

### Backend

- Java 17
- Spring Boot (Maven)
- Google Gmail API
- OAuth 2.0 (Installed App flow)

### Frontend

- React + TypeScript (Vite)
- MUI (Material UI) + MUI X DataGrid
- TanStack Query
- React Router
- React Hook Form

---

## Repository Structure

    |-- backend/
    |-- src/
    |-- pom.xml
    |-- .secrets/          # local only (gitignored)
    |-- .tokens/           # local only (gitignored)
      |-- target/            # build output(gitignored)
    |-- frontend/
    |-- src/
    |-- vite.config.ts
    |-- package.json

---

## Prerequisites

- macOS / Linux / Windows
- **Java 17**
- **Maven 3+**
- **Node.js 18+** (or 20+)

## Verify:

```bash
java -version
mvn -v
node -v
npm -v

Google Cloud Setup (Get credentials.json)

You need an OAuth client JSON so the backend can authenticate to Gmail.
	1.	Go to Google Cloud Console:
	-	https://console.cloud.google.com/
	2.	Select or create a Project
	3.	Enable Gmail API
	-	APIs & Services -> Library -> Search "Gmail API" -> Enable
	4.	Configure OAuth consent screen
	-	Google Auth platform (or APIs & Services -> OAuth consent screen)
	-	User type: External
	-	Add your Google account under Test users
	5.	Create OAuth Client
	-	Credentials (or Google Auth platform -> Clients)
	-	Create OAuth client -> Desktop app
	6.	Download the client JSON file
	7.	Save it as:
		backend/.secrets/credentials.json
```

# Backend: Run

## 1) Set environment variables

From the backend/ folder:

    cd backend

### Use Java 17

    export JAVA_HOME=$(/usr/libexec/java_home -v 17)
    export PATH="$JAVA_HOME/bin:$PATH"

### Gmail OAuth files

    export GOOGLE_CREDENTIALS_PATH="$(pwd)/.secrets/credentials.json"

    export GOOGLE_TOKENS_DIR="$(pwd)/.tokens"

    mkdir -p "$GOOGLE_TOKENS_DIR"

## 2) Start Spring Boot

    mvn clean spring-boot:run

Backend runs at:

    http://localhost:8080

OAuth Login (First Time Only)

When the backend first calls Gmail, Google will prompt you to login and approve access.

Trigger OAuth by opening:

    http://localhost:8080/api/labels

If you see "Google hasn’t verified this app", click Continue (normal for testing apps).

Tokens will be stored here:
`backend/.tokens/`

If tokens become corrupted (EOFException)

Reset them:

    rm -rf backend/.tokens

    mkdir -p backend/.tokens

Then restart backend and hit `/api/labels` again.

### Backend API Endpoints

    - GET /api/labels - list labels
    - GET /api/labels/{id} - label details
    - POST /api/labels - create label
    - PUT /api/labels/{id} - update label
    - DELETE /api/labels/{id} - delete label

`Note`: Gmail system labels (INBOX, SENT, etc.) cannot be updated/deleted.

# Frontend: Run

## 1) Install dependencies

    cd frontend
    npm install

## 2) Start Vite dev server

    npm run dev

Frontend runs at:

    http://localhost:5173

The frontend calls /api/\*, and Vite proxies it to the backend:

    http://localhost:8080

# How to Test the App (UI)

    1.	Start backend: mvn spring-boot:run
    2.	Start frontend: npm run dev
    3.	Open: http://localhost:5173/labels

## Requirements checklist

### 1. List labels

    You should see a DataGrid populated with Gmail labels

### 2. Create label

    •	Click Create Label
    •	Enter name like UI-Test-Label
    •	Submit → new label appears in list

### 3. Update label

    •	Click Edit on a user label you created
    •	Change name → Save → list updates

### 4. Delete label

    •	Click Delete on a user label you created
    •	Confirm → label disappears

### 5. Details view

    •	Click on a row (not the Edit/Delete buttons)
    •	Navigates to /labels/:id
    •	Shows label details (counts, visibility, etc.)

# How to Test the App(Backend with curl)

## List labels

    curl -s http://localhost:8080/api/labels | head

## Create label

    curl -s -X POST http://localhost:8080/api/labels \
    -H "Content-Type: application/json" \
    -d '{"name":"TestLabel-123","labelListVisibility":"labelShow","messageListVisibility":"show"}'

## Update label

    curl -s -X PUT http://localhost:8080/api/labels/<ID> \
    	-H "Content-Type: application/json" \
    	-d '{"name":"TestLabel-Updated","labelListVisibility":"labelShow","messageListVisibility":"show"}'

## Get label details

    curl -s http://localhost:8080/api/labels/<ID>

## Delete label

    curl -i -X DELETE http://localhost:8080/api/labels/<ID>

# .gitignore Notes

    This repo should ignore:
    	- backend/.secrets/ (OAuth client JSON)
    	- backend/.tokens/ (OAuth tokens)
    	- backend/target/ (Maven build output)
    	- node_modules/
    	- *.log
