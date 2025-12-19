# Eat Better Project Setup Guide

This guide explains how to set up and run the **Eat Better** project on macOS.

## Prerequisites

Before starting, ensure you have the following installed:

1.  **Git**: [Install Git](https://git-scm.com/downloads) or use `brew install git`.
2.  **.NET 9.0 SDK**: [Download .NET 9.0](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)
    *   Verify installation: `dotnet --version`
3.  **Node.js & npm**: [Download Node.js](https://nodejs.org/) (LTS recommended) or use `brew install node`.
    *   Verify installation: `node -v` and `npm -v`

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository_url>
cd eat-better
```

### 2. Using Antigravity

Antigravity is your AI coding assistant. You can use it to help develop features, debug code, or understand the project.

*   **Chat**: Open the AI chat panel to ask questions or request changes (e.g., "Add a new page for users").
*   **Context**: Antigravity uses your open files as context. Open the file you want to discuss to get better results.
*   **Commands**: You can ask it to run terminal commands, create files, or refactor code directly.

### 3. Start the Backend

The backend is built with ASP.NET Core.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Start the server:
    ```bash
    dotnet run
    ```
3.  The backend will start on **http://localhost:5265**. All API requests are handled here.

### 4. Start the Frontend

The frontend is a Vite + React + TypeScript application.

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies (first time only):
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser to **http://localhost:5173**.

## Troubleshooting

*   **Address already in use**: If you see an error about port 5265 or 5173 being in use:
    *   Find the process: `lsof -i :5265`
    *   Kill it: `kill -9 <PID>`
