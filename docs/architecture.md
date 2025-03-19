# 🚀 LOOKYM Architecture

This document outlines the architectural design of the LOOKYM application, explaining the structure, patterns, and technologies used.

---

## 🏗️ Application Structure

LOOKYM follows a modular architecture with clear separation of concerns:

```
lookym-project/
├── app/                 # 📱 Application screens and navigation
│   ├── (tabs)/          # 🏷️ Tab-based navigation screens
│   ├── auth/            # 🔐 Authentication screens
│   ├── chat/            # 💬 Chat screens
│   ├── _layout.tsx      # 🏗️ Root layout configuration
│   ├── assets/          # 🎨 Static assets (images, fonts)
├── components/          # 🧩 Reusable UI components
├── constants/           # ⚙️ Application constants
├── docs/                # 📖 Project documentation
├── hooks/               # 🪝 Custom React hooks
├── mocks/               # 🔍 Mock data for development
├── store/               # 🗄️ Zustand state management
├── types/               # 📝 TypeScript type definitions
├── utils/               # 🛠️ Utility functions
```

---

## 🏛️ Architectural Patterns

### 📂 File-Based Routing
LOOKYM uses **Expo Router's** file-based routing system, similar to Next.js:

- 📁 Files in the `app/` directory automatically become routes.
- 📂 Nested directories create nested routes.
- 🏷️ Special directories like `(tabs)` create tab-based navigation.
- 🔗 Dynamic routes use `[param]` syntax.

### 🏗️ Component Architecture
Components follow a hierarchical structure:

- **📱 Screen Components**: Top-level components that represent entire screens.
- **📦 Container Components**: Manage data and state for sections of the UI.
- **🎨 Presentational Components**: Focus on rendering UI elements.
- **🔹 Atomic Components**: Small, reusable UI elements.

---

## 🎛️ State Management
LOOKYM uses **Zustand** for state management with the following stores:

- 🔐 **Auth Store**: Manages authentication state.
- 📰 **Feed Store**: Handles video feed data and interactions.
- 💬 **Chat Store**: Manages chat conversations and messages.
- 🎥 **Video Store**: Handles video upload and playback state.

Each store follows a similar pattern:
- ✅ State definition with TypeScript interfaces.
- 🔄 Action functions that modify state.
- 💾 Persistence configuration where needed.

---

## 📊 Data Flow

- **🛜 API Layer**: Communicates with Supabase and Cloudinary.
- **🗄️ Store Layer**: Manages application state.
- **🎨 Component Layer**: Consumes state and renders UI.
- **🖱️ User Interaction**: Triggers actions that update state.

---

## 🛠️ Technology Stack

### 🎨 Frontend
- ⚛️ **React Native**: Core framework for mobile development.
- 🚀 **Expo**: Development platform and toolchain.
- 📝 **TypeScript**: For type safety and better developer experience.

### 🎛️ State Management
- 🗂️ **Zustand**: Lightweight state management.
- 💾 **AsyncStorage**: Persistence layer.

### 🌐 External Services
- 🔑 **Supabase**: Authentication and database.
- ☁️ **Cloudinary**: Video storage and streaming.

### 🎨 UI Components
- 🏗️ **React Native Components**: Core UI building blocks.
- 🚏 **Expo Router**: Navigation and routing.
- 🖼️ **Lucide Icons**: Icon library.

---

## 🔐 Authentication Flow
1. 👤 User enters credentials or uses OAuth provider.
2. 🔑 Authentication request sent to Supabase.
3. ✅ On success, JWT token stored in secure storage.
4. 🔄 Auth store updates authentication state.
5. 🚪 Protected routes become accessible.

---

## 📺 Video System Architecture

### 📤 Upload Flow
1. 📹 Video captured or selected from device.
2. ⚙️ Processed and compressed if needed.
3. ☁️ Uploaded to Cloudinary.
4. 🏷️ Metadata stored in Supabase.

### 🎥 Playback Flow
1. 🗂️ Video metadata fetched from Supabase.
2. ☁️ Streaming URL generated from Cloudinary.
3. ▶️ Video played using optimized player component.

---

## 🔴 Real-time Features

- 💬 **Chat**: Uses Supabase Realtime for instant messaging.
- 🔔 **Notifications**: Real-time updates for new messages and interactions.
- 🔄 **Feed Updates**: Live updates for new content and interactions.
