## ⚠️ Important Notice (2025)

**This application is no longer functional for real-world use.**

The official Bangladesh Railway API provider (Shohoz) has implemented Cloudflare Turnstile (CAPTCHA) protection and now requires a valid, per-site API key for all authentication requests. As a result:

- **Open source users cannot log in or use the app** unless they have their own Cloudflare Turnstile sitekey and backend support.
- The maintainers of the official API have intentionally blocked public/automated access, making this app unusable for its original purpose.
- This is a decision by the official authority, not by the RailwayMatrixBD project or its contributors.

**If you are an end user:**
- You will not be able to use this app to check seat availability or book tickets.

**If you are a developer:**
- You must provide your own Cloudflare Turnstile sitekey and backend, which is not possible for most users.

**This repository remains for educational and reference purposes only.**

---

# 🚆 Railway Matrix BD

A cross-platform desktop and mobile application for checking Bangladesh Railway seat availability with intelligent matrix visualization and segmented route finding. Built with React TypeScript and Tauri v2 for native performance.

<p align="center">
  <img src="https://raw.githubusercontent.com/AhmedTrooper/RailwayMatrixBD/refs/heads/main/additionalFiles/First%20part.png" alt="First Part" width="400" />
  <img src="https://raw.githubusercontent.com/AhmedTrooper/RailwayMatrixBD/refs/heads/main/additionalFiles/Second%20Part.png" alt="Second Part" width="400" />
</p>

## 🎯 What This Application Does

Railway Matrix BD solves the problem of checking train seat availability between any two stations on a route by creating a visual matrix. Instead of checking individual segments manually, users get a comprehensive view of all possible route combinations with real-time seat counts and pricing.

## 🛠️ Technology Stack

**Frontend:**
- React 18.3.1 with TypeScript 5.6.2
- Zustand for state management
- HeroUI + Tailwind CSS for responsive UI
- Vite for development and build tooling

**Desktop/Mobile:**
- Tauri v2 for cross-platform native applications
- Rust backend (managed by Tauri framework)

**API Integration:**
- Bangladesh Railway API (railspaapi.shohoz.com)
- HTTP requests via Tauri's HTTP plugin

---

## 🏗️ Core Features & Implementation

### 1. **Authentication System**
**Developer:** AhmedTrooper  
**Files:** `src/store/AuthorizationStore.ts`, `src/components/home/LoginComponent.tsx`

The application requires user authentication to access the Bangladesh Railway API. The authentication flow manages login state and token persistence.

```typescript
// Core authentication logic
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

The system uses Zustand for state management and localStorage for session persistence across app restarts.

### 2. **Train Search Module**
**Developer:** AhmedTrooper  
**Files:** `src/store/trainStore.ts`, `src/components/home/TrainForm.tsx`

Users can search for available trains between origin and destination stations for a specific date. The module handles API calls and presents results in an interactive list.

```typescript
// Train search implementation
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

The search form includes dropdowns populated with 250+ stations and all available trains in the system.

### 3. **Seat Availability Matrix**
**Developer:** AhmedTrooper  
**Files:** `src/store/matrixStore.ts`, `src/components/home/MatrixBox.tsx`

This is the core feature that creates an N×N matrix showing seat availability between all station pairs on a selected train route.

```typescript
// Matrix generation algorithm
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

The matrix displays seat counts, pricing, and direct purchase links. Parallel API calls optimize performance for routes with many stations.

### 4. **Segmented Route Finder**
**Developer:** AhmedTrooper  
**Files:** `src/store/matrixStore.ts`, `src/components/home/SegmentedRoute.tsx`

When direct routes have no available seats, users can find alternative multi-segment routes using a breadth-first search algorithm.

```typescript
// Pathfinding algorithm for segmented routes
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
  return [];
}
```

This algorithm treats stations as graph nodes and available seats as edges to find the shortest connecting path.

### 5. **Journey Planning Interface**
**Developer:** AhmedTrooper  
**Files:** `src/store/journeyStore.ts`, `src/components/home/DatePickerComponent.tsx`

The journey planning module handles date selection, station dropdowns, and form validation.

```typescript
// Date formatting for API compatibility
journeyDateGenerator: (date: DateValue | null) => {
  if (!date) return;
  const tempDate = `${date.year}-${date.month}-${date.day}`;
  const { monthList } = get();
  const tempFormatedDate = `${date.day}-${monthList[date.month - 1]}-${date.year}`;
  set({ formattedJourneyDate: tempFormatedDate, journeyDate: tempDate });
}
```

The interface validates that origin and destination are different and dates are properly formatted before API calls.

### 6. **Cross-Platform UI System**
**Developer:** AhmedTrooper  
**Files:** `src/App.tsx`, `src/store/themeStore.ts`, `src/components/global/`

The application adapts its interface for desktop and mobile platforms with consistent theming.

```typescript
// Platform detection and theme management
detectMobileOS: () => {
  const currentOS = platform();
  set({ osName: currentOS });
  if (currentOS === "android" || currentOS === "ios") {
    set({ isMobileOS: true });
  } else {
    set({ isMobileOS: false });
  }
}

// Theme persistence
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

Different navigation components are rendered based on the detected platform (MenuBar for desktop, MobileMenuBar for mobile).

### 7. **Auto-Update System**
**Developer:** AhmedTrooper  
**Files:** `src/store/ApplicationStore.ts`, `update/metadata.json`

The application includes version checking and update notifications.

```typescript
// Update detection logic
detectUpdate: async () => {
  const response = await fetch(metadataUrl);
  const data: Metadata = await response.json();
  setOnlineVersion(data.version);
  
  if (applicationVersion && onlineVersion && applicationVersion < onlineVersion) {
    setIsUpdateAvailable(true);
    setShowWarningDialog(true);
  }
}
```

Update metadata is hosted remotely and includes version info, changelog, and platform compatibility.

### 8. **Native Window Management**
**Developer:** AhmedTrooper  
**Files:** `src/components/global/menubar/MenuBar.tsx`, `src-tauri/tauri.conf.json`

Desktop builds include custom window controls and dragging functionality.

```typescript
// Window control implementation
const startDraggingWindow = async () => {
  await getCurrentWindow().startDragging();
};

const handleFullScreen = async () => {
  let screenStatus = await getCurrentWindow().isFullscreen();
  if (screenStatus) {
    await getCurrentWindow().setFullscreen(false);
  } else {
    await getCurrentWindow().setFullscreen(true);
  }
};
```

The application uses frameless windows with custom title bar controls for minimize, maximize, and close operations.

---

## 📊 Data Management

### **Static Data**
- **Station List:** 250+ Bangladesh Railway stations in `src/constants/StationList.ts`
- **Train List:** 130+ train services with route numbers in `src/constants/TrainList.ts`

### **State Management Structure**
The application uses Zustand stores for different concerns:

- `AuthorizationStore`: Login state and token management
- `MatrixStore`: Seat matrix data and segmented routing
- `TrainStore`: Train search results and route information
- `JourneyStore`: Trip planning data (dates, stations)
- `ApplicationStore`: Version control and update checking
- `ThemeStore`: UI appearance preferences
- `OsInfoStore`: Platform detection

### **API Integration**
All external API calls use the Bangladesh Railway booking system:
- Base URL: `https://railspaapi.shohoz.com/v1.0/web/`
- Authentication: Bearer token required
- Endpoints: `/auth/sign-in`, `/bookings/search-trips-v2`

---

## 🏗️ Project Architecture

```
src/
├── components/
│   ├── home/              # Main application features
│   │   ├── MatrixBox.tsx           # Matrix visualization
│   │   ├── SegmentedRoute.tsx      # Alternative route finding
│   │   ├── TrainForm.tsx           # Search interface
│   │   ├── LoginComponent.tsx      # Authentication UI
│   │   └── [25+ other components]
│   └── global/            # Shared UI components
│       ├── menubar/       # Navigation (desktop/mobile)
│       └── footer/        # Application info
├── store/                 # Zustand state management
├── constants/             # Static data (stations, trains)
├── interface/             # TypeScript type definitions
├── routes/                # React Router pages
└── ui/                    # Reusable UI components

src-tauri/                 # Rust backend configuration
└── tauri.conf.json       # Cross-platform build settings

update/                    # Update system metadata
```

---

## 🚀 Development Setup

**Prerequisites:**
- Node.js 18+ and npm
- Rust toolchain (for Tauri)
- For mobile builds: Android SDK

**Installation & Development:**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run as desktop application
npm run tauri dev

# Build for production
npm run build
npm run tauri build
```

**Available Platforms:**
- ✅ Windows (MSI/EXE installers)
- ✅ Android (APK packages)
- 🔄 macOS (planned)
- 🔄 Linux (planned)

---

## 🎯 Technical Considerations

### **Performance Optimizations**
- Parallel API requests for matrix generation using `Promise.all()`
- Responsive table rendering with sticky headers for large matrices
- LocalStorage caching for authentication and preferences
- Efficient state management with Zustand's selective subscriptions

### **Error Handling**
- Network error recovery with user feedback via toast notifications
- Form validation for required fields and logical constraints
- API rate limiting awareness and retry mechanisms
- Graceful degradation when offline

### **Accessibility**
- Keyboard navigation support
- Screen reader compatible table structures
- High contrast dark/light theme options
- Responsive design for various screen sizes

---

## 📄 Current Status

**Implemented Features:**
- ✅ User authentication with session persistence
- ✅ Train search across 250+ stations
- ✅ Real-time seat availability matrix visualization  
- ✅ Segmented route pathfinding algorithm
- ✅ Cross-platform desktop and mobile builds
- ✅ Dark/light theme system
- ✅ Automatic update checking
- ✅ Native window controls for desktop

**Known Limitations:**
- Requires internet connection for all functionality
- Limited to SHULOV seat class searches
- No offline caching of route data
- Update system requires manual installation

**Future Enhancements:**
- Offline mode with cached data
- Multi-class seat searches (AC, First Class, etc.)
- Route favorites and history
- Push notifications for seat availability
- iOS platform support

---

## 🙏 Acknowledgements

Inspiration and learning from:
- [Bangladesh Railway Train Seat Matrix Web Application](https://github.com/nishatrhythm/Bangladesh-Railway-Train-Seat-Matrix-Web-Application) - Matrix visualization approach
- [Bangladesh Railway Train Seat Availability Web Application](https://github.com/nishatrhythm/Bangladesh-Railway-Train-Seat-Availability-Web-Application) - API usage patterns

---

## 📄 License

MIT License