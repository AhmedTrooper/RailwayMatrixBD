# 🚆 Railway Matrix BD

# 🚆 Railway Matrix BD

**Railway Matrix BD** is a sophisticated **cross-platform desktop and mobile application** built with **Tauri v2** and **React TypeScript** for comprehensive Bangladesh Railway seat availability analysis. This native application provides advanced matrix-based seat visualization, intelligent segmented routing algorithms, and real-time ticket availability tracking.

---

<p align="center">
  <img src="https://raw.githubusercontent.com/AhmedTrooper/RailwayMatrixBD/refs/heads/main/additionalFiles/First%20part.png" alt="First Part" width="400" />
  <img src="https://raw.githubusercontent.com/AhmedTrooper/RailwayMatrixBD/refs/heads/main/additionalFiles/Second%20Part.png" alt="Second Part" width="400" />
</p>

## 🏗️ Architecture Overview

This application demonstrates **senior-level architectural patterns** with a clean separation of concerns, advanced state management, and sophisticated algorithmic implementations.

### **Core Architecture Components:**
- **Tauri v2 Native Shell** - Cross-platform desktop runtime
- **React 18 + TypeScript** - Type-safe frontend with modern hooks
- **Zustand State Management** - Lightweight, performant global state
- **HeroUI + Tailwind CSS** - Modern component library with utility-first styling
- **Custom Matrix Algorithm** - Advanced seat availability calculation engine
- **Segmented Route Pathfinding** - BFS-based intelligent route discovery

---

## 🧠 Advanced Features & Technical Implementation

### 🔍 **Matrix-Based Seat Availability Engine**
**Location:** `src/store/matrixStore.ts:createMatrix()`

- **N×N Matrix Generation**: Creates dynamic seat availability matrix for all route combinations
- **Concurrent API Fetching**: Parallel HTTP requests with `Promise.all()` for optimal performance
- **Real-time Data Processing**: Live seat count aggregation from Bangladesh Railway API
- **Smart Caching**: Efficient data structure management with TypeScript interfaces

```typescript
// Core matrix calculation algorithm
const dataMatrix: SeatType[][] = Array.from({ length: size }, () => Array(size).fill(null));
for (let i = 0; i < size - 1; i++) {
  for (let j = i + 1; j < size; j++) {
    // Parallel API fetching for each route segment
  }
}
```

### 🎯 **Intelligent Segmented Route Pathfinding**
**Location:** `src/store/matrixStore.ts:findSegmentedRoute()`

- **Breadth-First Search (BFS) Algorithm**: Finds optimal multi-segment routes
- **Graph Traversal**: Treats stations as nodes and seat availability as weighted edges  
- **Path Optimization**: Discovers alternative routes when direct paths are unavailable
- **Cycle Detection**: Prevents infinite loops with visited set tracking

```typescript
const queue: number[][] = [[start]];
const visited: Set<string> = new Set();
// BFS implementation for optimal pathfinding
```

### 🏪 **Advanced State Management Architecture**
**Tech Stack:** Zustand with TypeScript interfaces

**Store Implementations:**
- **`journeyStore.ts`** - Journey planning, date handling, station selection
- **`matrixStore.ts`** - Matrix calculations, segmented routing, seat data
- **`trainStore.ts`** - Train information, route validation, API integration
- **`authorizationStore.ts`** - User authentication, token management
- **`applicationStore.ts`** - Version control, update detection, metadata handling

### 📡 **Real-Time API Integration**
**Integration Points:**
- **Bangladesh Railway API**: Live seat availability data
- **Authentication Service**: Secure token-based authentication
- **Train Route Service**: Real-time train information and schedules
- **Update Service**: Automatic version checking and update notifications

### 🎨 **Responsive UI Architecture**
**Location:** `src/components/`

- **Atomic Design Pattern**: Reusable component hierarchy
- **Mobile-First Responsive**: Adaptive layouts for desktop and mobile
- **Dark/Light Theme Support**: System preference detection with localStorage persistence
- **Loading States**: Sophisticated loading indicators and error boundaries

### 🔐 **Authentication & Security**
**Features:**
- **JWT Token Management**: Secure authentication with bearer tokens
- **Local Storage Encryption**: Secure credential storage
- **Session Persistence**: Automatic login state restoration
- **Input Validation**: Comprehensive form validation and sanitization

---

## 🎯 **Core Features**

### 💎 **Matrix Visualization**
- **Dynamic Route Matrix**: N×N grid showing seat availability for all route combinations
- **Color-Coded Availability**: Visual indicators for different seat classes and availability
- **Interactive Matrix**: Click-to-navigate interface with sticky headers
- **Real-Time Updates**: Live seat count updates with toast notifications

### 🚄 **Train Management System** 
**Data Coverage:** 120+ Bangladesh Railway trains with comprehensive route information

- **Intelligent Train Search**: Auto-complete with 120+ train database
- **Route Validation**: Smart origin-destination validation
- **Schedule Integration**: Date-aware journey planning with proper overnight handling
- **Train Details**: Comprehensive train information including operating days and routes

### 🗓️ **Advanced Date & Journey Planning**
- **Smart Date Selection**: Future date validation with timezone handling
- **Journey Optimization**: Multi-criteria route optimization
- **Date Format Handling**: International date format support
- **Calendar Integration**: Native date picker with proper localization

### 📱 **Cross-Platform Native Experience**
- **Tauri v2 Integration**: True native performance with web technologies
- **Platform Detection**: Automatic mobile/desktop UI adaptation
- **Custom Window Controls**: Frameless windows with custom decorations
- **Native Notifications**: System-level update notifications

### 🔄 **Auto-Update System**
**Location:** `src/store/ApplicationStore.ts`

- **Version Detection**: Automatic version comparison
- **Severity-Based Updates**: Critical vs optional update handling  
- **Update Metadata**: Rich update information with download links
- **User-Controlled Updates**: Optional update installation

---

## 🛠️ **Technology Stack**

### **Frontend Framework**
- **React 18.3.1** - Modern React with concurrent features
- **TypeScript 5.6.2** - Full type safety with strict mode
- **Vite 6.0.3** - Next-generation build tool with HMR

### **UI/UX Libraries**
- **HeroUI 2.7.9** - Modern component library with accessibility
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Framer Motion 12.16.0** - Production-ready motion library
- **Lucide React** - Beautiful SVG icon library

### **State Management**
- **Zustand 5.0.5** - Lightweight state management
- **Lodash 4.17.21** - Utility functions for data manipulation

### **Native Desktop Runtime**
- **Tauri v2** - Rust-based native app framework
- **Tauri Plugins**: HTTP, OS detection, file system access

### **Development Tools**
- **TypeScript ESLint** - Code quality and consistency
- **PostCSS + Autoprefixer** - CSS optimization
- **Path Aliases** - Clean import resolution with `@/*` mapping

---

## 📦 **Installation & Usage**

### **Download Options**
Download from [**Releases**](https://github.com/AhmedTrooper/RailwayMatrixBD/releases):

| Platform | Format | Status | Architecture |
|----------|---------|---------|--------------|
| 🪟 Windows | `.msi`, `.exe` | ✅ Available | x64, ARM64 |
| 🤖 Android | `.apk` | ✅ Available | ARM64, x86_64 |  
| 🍎 macOS | `.dmg` | ⏳ Coming Soon | Intel, Apple Silicon |
| 🐧 Linux | `.AppImage`, `.deb` | ⏳ Coming Soon | x64, ARM64 |

### **Development Setup**

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production  
npm run build

# Run Tauri development
npm run tauri dev

# Build Tauri application
npm run tauri build
```

### **Environment Configuration**
- **Development Port**: 1420 (Vite HMR)
- **HMR Protocol**: WebSocket on port 1421
- **Path Aliases**: `@/*` → `src/*`

---

## 🧩 **Code Architecture Highlights**

### **Custom Matrix Algorithm Implementation**
```typescript
// Parallel seat availability fetching with error handling
const fetchTasks: Promise<void>[] = [];
for (let i = 0; i < size - 1; i++) {
  for (let j = i + 1; j < size; j++) {
    const task = async () => {
      const availableSeats = (train?.seat_types || [])
        .filter((s: any) => s.seat_counts.online + s.seat_counts.offline > 0);
      dataMatrix[i][j] = availableSeats;
    };
    fetchTasks.push(task);
  }
}
await Promise.all(fetchTasks);
```

### **BFS Route Pathfinding**
```typescript
const queue: number[][] = [[start]];
const visited: Set<string> = new Set();
while (queue.length > 0) {
  const path = queue.shift()!;
  const last = path[path.length - 1];
  if (last === end) return path;
  // Graph traversal with cycle detection
}
```

### **Zustand Store Pattern**
```typescript
export const useMatrixStore = create<MatrixStore>((set, get) => ({
  // State management with TypeScript interfaces
  createMatrix: async () => { /* Advanced matrix calculation */ },
  findSegmentedRoute: (start, end, matrix) => { /* BFS pathfinding */ }
}));
```

---

## 🎯 **Advanced Features Deep Dive**

### **Segmented Route Intelligence**
- Discovers multi-hop routes when direct routes are unavailable
- Optimizes for seat availability across multiple segments  
- Provides alternative routing suggestions
- Handles complex railway network topologies

### **Real-Time Data Processing**
- Concurrent API requests for optimal performance
- Smart error handling with fallback mechanisms
- Toast notification system for user feedback
- Loading state management with skeleton UI

### **Cross-Platform Optimization**
- Platform-specific UI adaptations (mobile vs desktop)
- Native window controls and decorations
- System theme detection and synchronization
- Responsive breakpoint management

---

## 🔧 **Configuration Files**

### **Tauri Configuration** (`src-tauri/tauri.conf.json`)
```json
{
  "productName": "Railway Matrix BD",
  "version": "0.8.0",
  "identifier": "com.railway-matrix-sutsoa.app",
  "app": {
    "windows": [{
      "decorations": false,
      "transparent": true,
      "minWidth": 300,
      "minHeight": 400
    }]
  }
}
```

### **TypeScript Configuration** (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": { "@/*": ["*"] },
    "strict": true,
    "noUnusedLocals": true
  }
}
```

---

## 🚀 **Performance Optimizations**

- **Parallel API Requests**: Concurrent seat availability fetching
- **Efficient State Updates**: Zustand's minimal re-render approach
- **Tree Shaking**: Vite's optimized bundle splitting
- **Lazy Loading**: Component-level code splitting
- **Memory Management**: Proper cleanup in useEffect hooks

---

## 🙏 **Acknowledgements**

Technical inspiration from:
- [**Bangladesh Railway Train Seat Matrix Web Application**](https://github.com/nishatrhythm/Bangladesh-Railway-Train-Seat-Matrix-Web-Application) - Matrix visualization concepts
- [**Bangladesh Railway Train Seat Availability Web Application**](https://github.com/nishatrhythm/Bangladesh-Railway-Train-Seat-Availability-Web-Application) - API integration patterns

---

## 📄 **License**

MIT License - See [LICENSE](./LICENSE) for details

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