# Stage 1: Build Frontend
FROM node:20 AS build-frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-backend
WORKDIR /app
COPY backend/backend.csproj ./
RUN dotnet restore
COPY backend/ ./
RUN dotnet publish -c Release -o out

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build-backend /app/out ./
COPY --from=build-frontend /app/dist ./wwwroot/app

# Create a directory for persistent data
RUN mkdir -p /app/data

# Expose port 8080
EXPOSE 8080

# Set entrypoint
ENTRYPOINT ["dotnet", "backend.dll"]
