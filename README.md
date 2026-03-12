# 🚆 Railway Matrix BD

| 🌟🌟🌟🌟🌟🌟🌟 **Support the Developer!**🌟🌟🌟🌟🌟🌟🌟 |
| :--- |
| If you find Railway Matrix BD helpful, please consider giving a ⭐️ to my primary project: **🌟[OSGUI]🌟(https://github.com/AhmedTrooper/OSGUI)**.<br><br>**What is OSGUI?** It's a lightning-fast, cross-platform desktop GUI for `yt-dlp`. It allows you to easily download high-quality videos from YouTube, X (Twitter), Facebook, and **1000+ other websites** with built-in concurrent downloading and FFmpeg processing. Starring it helps me keep these open-source tools free and actively updated! 🚀 |
| 🌟🌟🌟🌟🌟🌟🌟 **Support the Developer!**🌟🌟🌟🌟🌟🌟🌟 |


A cross-platform desktop and mobile application for checking Bangladesh Railway seat availability with intelligent matrix visualization and segmented route finding. Built with React TypeScript and Tauri v2 for native performance.

<p align="center">
  <img src="https://raw.githubusercontent.com/AhmedTrooper/RailwayMatrixBD/refs/heads/main/additionalFiles/First%20part.png" alt="First Part" width="400" />
  <img src="https://raw.githubusercontent.com/AhmedTrooper/RailwayMatrixBD/refs/heads/main/additionalFiles/Second%20Part.png" alt="Second Part" width="400" />
</p>

## 🔑 Getting Started - Authentication Setup

Before using the application, you need to obtain authentication credentials from the Bangladesh Railway website:

1. **Login to Bangladesh Railway:** Visit [https://eticket.railway.gov.bd/](https://eticket.railway.gov.bd/) and login with your account
2. **Open Browser Developer Tools:** Press `F12` or right-click and select "Inspect"
3. **Navigate to Application/Storage Tab:**
   - In Chrome/Edge: Go to **Application** → **Local Storage** → `https://eticket.railway.gov.bd`
   - In Firefox: Go to **Storage** → **Local Storage** → `https://eticket.railway.gov.bd`
4. **Copy Required Values:** Find and copy these three values:
   - `token` - Your authentication Bearer token
   - `x-device-key` (SSDK) - Device security key
   - `x-device-id` (UUDID) - Unique device identifier
5. **Paste in Railway Matrix BD:** Open the app, navigate to the Authorization form, and paste each value into the corresponding field

**Note:** These credentials are session-specific and stored locally in your app. You may need to refresh them periodically if they expire.

---

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

### 1. **Persistent Authentication Store with Zustand**

**Developer:** AhmedTrooper  
**Files:** `src/store/AuthorizationStore.ts`, `src/components/home/AuthorizationComponent.tsx`

**Problem:** Need secure, persistent storage for multiple authentication credentials (token, SSDK, UUDID) that survives app restarts.

**Solution:** Implemented Zustand store with persist middleware using localStorage.

```typescript
// Persistent authentication store with middleware
interface AuthorizationStoreState {
  token: string | null;
  ssdk: string | null;
  uudid: string;
  setToken: (token: string) => void;
  setSsdk: (ssdk: string) => void;
  setUudid: (uudid: string) => void;
  resetAuthData: () => void;
}

export const useAuthorizationStore = create<AuthorizationStoreState>()(
  persist(
    (set) => ({
      token: null,
      ssdk: null,
      uudid: "",
      setToken: (token: string) => set({ token }),
      setSsdk: (ssdk: string) => set({ ssdk }),
      setUudid: (uudid: string) => set({ uudid }),
      resetAuthData: () => set({ token: null, ssdk: null, uudid: "" }),
    }),
    {
      name: "railwaymatrix_auth", // localStorage key
      version: 2, // Migration support
    }
  )
);
