# 🚆 Railway Matrix BD

# 🚆 Railway Matrix BD

A **cross-platform desktop and mobile application** built with Tauri v2 and React TypeScript for Bangladesh Railway seat availability checking. I built this to learn modern web technologies and solve the problem of checking train seat availability across different route segments.

---

<p align="center">
  <img src="https://raw.githubusercontent.com/AhmedTrooper/RailwayMatrixBD/refs/heads/main/additionalFiles/First%20part.png" alt="First Part" width="400" />
  <img src="https://raw.githubusercontent.com/AhmedTrooper/RailwayMatrixBD/refs/heads/main/additionalFiles/Second%20Part.png" alt="Second Part" width="400" />
</p>

## 🎯 What This Project Does

This app helps users check Bangladesh Railway train seat availability by:
- Creating a visual matrix showing which train segments have available seats
- Allowing users to find alternative routes when direct routes are full
- Providing real-time seat counts and pricing information
- Working offline as a native desktop/mobile app

## 🛠️ Tech Stack I Used

**Frontend:**
- React 18.3.1 + TypeScript 5.6.2
- Zustand for state management  
- HeroUI + Tailwind CSS for styling
- Vite for build tooling

**Backend/Native:**
- Tauri v2 for cross-platform desktop apps
- Rust backend (handled by Tauri)

**API Integration:**
- Bangladesh Railway API (railspaapi.shohoz.com)
- Tauri HTTP plugin for API calls

---

## 🏗️ Project Features & Implementation

I organized the app into several key modules. Here's what each one does and how I implemented it:

### 1. 🔐 **User Authentication System**
**Developer:** AhmedTrooper  
**Files:** `src/store/AuthorizationStore.ts`, `src/components/home/LoginComponent.tsx`

Users must login to access the railway API. I implemented a simple authentication flow:

```typescript
// Core login logic I wrote
fetchToken: async () => {
  const payLoad = {
    mobile_number: mobileNumber,
    password: loginPassword,
  };
  
  const response = await fetch(loginUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payLoad),
  });
  
  if (response.status === 200) {
    setBearerToken(data["token"]);
    setIsLoggedIn(true);
    localStorage.setItem("bearerToken", data["token"]);
  }
}
```

**My Approach:** I used Zustand to manage auth state and localStorage to persist login sessions. The component conditionally shows login/logout UI based on auth state.

### 2. 🚄 **Train Search & Selection**
**Developer:** AhmedTrooper  
**Files:** `src/store/trainStore.ts`, `src/components/home/TrainForm.tsx`, `src/components/home/UserTrainListComponent.tsx`

Users can search for trains between stations and dates. Here's how I built it:

```typescript
// Train search API call I implemented
fetchUserTrainList: async () => {
  const tempUrl = `https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2?from_city=${originStation}&to_city=${destinationStation}&date_of_journey=${formattedJourneyDate}&seat_class=SHULOV`;
  
  let response = await fetch(tempUrl, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });
  
  let trains = responseObject.data.trains.map((train) => train.trip_number.trim());
  set({ userTrainList: trains });
}
```

**My Approach:** I created a form with dropdowns for origin/destination stations and a date picker. When users search, I fetch available trains and display them in a clickable list.

### 3. 🧮 **Seat Availability Matrix**
**Developer:** AhmedTrooper  
**Files:** `src/store/matrixStore.ts`, `src/components/home/MatrixBox.tsx`

This is the core feature - a matrix showing seat availability between all station pairs on a train route.

```typescript
// Matrix creation logic I developed
createMatrix: async () => {
  const dataMatrix: SeatType[][] = Array.from({ length: size }, () => 
    Array(size).fill(null)
  );
  
  const fetchTasks: Promise<void>[] = [];
  
  for (let i = 0; i < size - 1; i++) {
    for (let j = i + 1; j < size; j++) {
      const from = routeList[i];
      const to = routeList[j];
      
      const task = async () => {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${bearerToken}` },
        });
        const availableSeats = (train?.seat_types || [])
          .filter((s) => s.seat_counts.online + s.seat_counts.offline > 0);
        dataMatrix[i][j] = availableSeats;
      };
      fetchTasks.push(task);
    }
  }
  
  await Promise.all(fetchTasks);
}
```

**My Approach:** I create an N×N matrix where each cell represents a route segment. I make parallel API calls for better performance and display the results in a responsive HTML table with color coding.

### 4. 🗺️ **Segmented Route Finding**
**Developer:** AhmedTrooper  
**Files:** `src/store/matrixStore.ts`, `src/components/home/SegmentedRoute.tsx`

When direct routes are unavailable, users can find multi-segment routes. I implemented a simple pathfinding algorithm:

```typescript
// Route finding algorithm I wrote
findSegmentedRoute: (start: number, end: number, dataMatrix: any[][]): number[] => {
  const queue: number[][] = [[start]];
  const visited: Set<string> = new Set();

  while (queue.length > 0) {
    const path = queue.shift()!;
    const last = path[path.length - 1];

    if (last === end) return path;

    for (let next = 0; next < dataMatrix.length; next++) {
      const edge = dataMatrix[last][next];
      
      if (edge && Array.isArray(edge) && edge.length > 0 && !path.includes(next)) {
        const newPath = [...path, next];
        const key = newPath.join("-");
        if (!visited.has(key)) {
          queue.push(newPath);
          visited.add(key);
        }
      }
    }
  }
  return []; // No path found
}
```

**My Approach:** This is basically a breadth-first search (BFS) algorithm. I treat stations as nodes and available seats as edges. It finds the shortest path between two stations.

### 5. 🎨 **UI & Theme System**
**Developer:** AhmedTrooper  
**Files:** `src/App.tsx`, `src/store/themeStore.ts`, `src/components/global/`

I built a responsive UI that works on both desktop and mobile with dark/light theme support:

```typescript
// Theme management I implemented
useEffect(() => {
  if (dark) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}, [dark]);
```

**My Approach:** I used Tailwind's dark mode with localStorage persistence. The app detects mobile vs desktop and shows different navigation components.

### 6. 📱 **Cross-Platform Setup**
**Developer:** AhmedTrooper  
**Files:** `src-tauri/tauri.conf.json`, `src-tauri/src/lib.rs`

I configured Tauri to build for Windows and Android:

```json
{
  "productName": "Railway Matrix BD",
  "version": "0.8.0",
  "app": {
    "windows": [{
      "decorations": false,
      "transparent": true,
      "minWidth": 300,
      "minHeight": 400
    }]
  },
  "bundle": {
    "targets": "all",
    "android": { "versionCode": 8 }
  }
}
```

**My Approach:** I used Tauri's default setup with some customization for window appearance and mobile support.

### 7. 🔄 **Auto-Update System**
**Developer:** AhmedTrooper  
**Files:** `src/store/ApplicationStore.ts`, `update/metadata.json`

I added a simple update checker that compares versions:

```typescript
// Update detection I wrote
detectUpdate: async () => {
  const response = await fetch(metadataUrl);
  const data: Metadata = await response.json();
  setOnlineVersion(data.version);
  
  if (onlineVersion > applicationVersion) {
    setIsUpdateAvailable(true);
  }
}
```

**My Approach:** I host a JSON file with version info and compare it with the current app version. Shows notification if update is available.

---

## 🧪 **What I Learned**

### **State Management:**
- How to use Zustand for global state (simpler than Redux)
- Managing complex state across multiple stores
- Persisting state with localStorage

### **API Integration:**
- Working with external APIs and handling authentication
- Making parallel HTTP requests for better performance
- Error handling and loading states

### **Algorithm Implementation:**
- Implementing BFS pathfinding algorithm
- Working with matrices and nested loops
- Optimizing performance with Promise.all()

### **Cross-Platform Development:**
- Setting up Tauri for desktop apps
- Configuring builds for different platforms
- Handling responsive design for mobile/desktop

---

## 📁 **Project Structure**

```
src/
├── components/
│   ├── home/           # Main app components
│   └── global/         # Shared components (navbar, footer)
├── store/              # Zustand state management
├── constants/          # Static data (stations, trains)
├── interface/          # TypeScript type definitions
└── routes/             # React Router pages

src-tauri/              # Rust backend configuration
update/                 # Update metadata
```

---

## 🚀 **Running the Project**

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Run as desktop app
npm run tauri dev

# Build desktop app
npm run tauri build
```

---

## 🎯 **Current Status & Future Plans**

**What Works:**
- ✅ User authentication and session management
- ✅ Train search and selection
- ✅ Matrix visualization with real data
- ✅ Segmented route finding
- ✅ Cross-platform builds (Windows, Android)
- ✅ Dark/light theme support
- ✅ Auto-update system

**What I Want to Add:**
- 🔄 Better error handling and offline support
- 🔄 More sophisticated routing algorithms  
- 🔄 iOS and Linux builds
- 🔄 Better caching for frequently searched routes
- 🔄 User preferences and favorites

---

## 🙏 **Acknowledgements**

I got inspiration and learned from:
- [Bangladesh Railway Train Seat Matrix Web Application](https://github.com/nishatrhythm/Bangladesh-Railway-Train-Seat-Matrix-Web-Application) - Matrix visualization approach
- [Bangladesh Railway Train Seat Availability Web Application](https://github.com/nishatrhythm/Bangladesh-Railway-Train-Seat-Availability-Web-Application) - API usage patterns

---

## 📄 **License**

MIT License

---

<p align="center">
  <img src="https://raw.githubusercontent.com/AhmedTrooper/RailwayMatrixBD/refs/heads/main/additionalFiles/First%20part.png" alt="First Part" width="400" />
  <img src="https://raw.githubusercontent.com/AhmedTrooper/RailwayMatrixBD/refs/heads/main/additionalFiles/Second%20Part.png" alt="Second Part" width="400" />
</p>



## 📖 Overview

Plan your train journey with an intelligent and instant interface. This native application offers powerful features like segmented seat tracking, fare breakdowns, and smart route planning — available on both desktop and Android.

---

## ✨ Features

- 🧮 **Segmented Seat Matrix**  
  View seat availability across all route segments of a train

- 🎯 **Smart Routing Engine**  
  Supports direct, mixed-class, and segmented route planning

- 📊 **Fare Matrix Breakdown**  
  Visual fare analysis by seat class and segment

- 🗓️ **Date-Aware Journey Support**  
  Handles overnight and multi-day routes properly

- 🚄 **Complete Train Coverage**  
  Supports all 120+ Bangladesh Railway trains

- 📱 **Native, Responsive UI**  
  Seamless experience on both desktop and mobile devices

- ⚡ **Queue-Free Performance**  
  No server delay — the app runs locally and instantly

- 🔒 **Zero Authentication**  
  All core features available without login

---

## 🛠️ Tech Stack

- ⚛️ **React (TypeScript)** – Frontend UI  
- 🦀 **Tauri v2** – Cross-platform native app shell  
- ⚡ **Vite** – Fast and modern build tool  
- 🎨 **Tailwind CSS** – Utility-first styling framework
- 🎶 **Hero UI** - UI framework
- 🥳 **Zustand** - Global store management
---

## 📦 Installation

Download the latest release from the [**Releases**](https://github.com/AhmedTrooper/RailwayMatrixBD/releases) section:

| Platform      | Format     | Status       |
|---------------|------------|--------------|
| 🪟 Windows     | `.msi`, `.exe` | ✅ Available |
| 🤖 Android     | `.apk`     | ✅ Available |
| 🍎 macOS       | `.dmg` (TBD) | ⏳ Coming soon |
| 🐧 Linux       | `.AppImage`, `.deb` (TBD) | ⏳ Coming soon |

> **No setup required** — just download and run.

---

## 🙏 Acknowledgements

With ❤️ to [**Bangladesh Railway Train Seat Matrix Web Application**](https://github.com/nishatrhythm/Bangladesh-Railway-Train-Seat-Matrix-Web-Application) and [**Bangladesh Railway Train Seat Availability Web Application**](https://github.com/nishatrhythm/Bangladesh-Railway-Train-Seat-Availability-Web-Application) for the matrix concept and inspiration.

---

## 📄 License

[MIT License](./LICENSE)