# Sleep Face Frontend 📱

Beautiful React Native mobile app for tracking sleep quality and skin health through daily selfie analysis.

## 🎯 Overview

Cross-platform mobile application built with React Native (Expo) that provides an intuitive interface for Sleep Face - helping users track their appearance, sleep quality, and skin health over time.

## ✨ Features

### 📸 Core Functionality
- **Daily Selfie Capture**: iPhone-style camera with gallery access
- **Real-time AI Analysis**: Instant processing with backend integration
- **Routine Logging**: Track sleep hours, water intake, skincare products, daily notes
- **Trend Visualization**: Beautiful charts showing progress over time
- **Smart Insights**: Data-driven recommendations based on analysis

### 🎨 User Experience
- **3-Tab Navigation**: 
  - 📊 Insights (left) - View analysis and trends
  - 📷 Camera (center) - Capture and analyze selfies
  - 👤 Profile (right) - Manage settings and history
- **Glassmorphic Design**: Modern UI with dark theme and gradient effects
- **Custom Fonts**: 
  - Baloo Bhaijaan 2 for content
  - JetBrains Mono for logo and special text
- **Smooth Animations**: Delightful user interactions

### 🎯 Gamification
- **Streak Tracking**: Daily login rewards
- **Progress Badges**: Achievements for milestones
- **Fun Labels**: Zombie 🧟, Normal 😐, Glow Queen 👑
- **Historical Comparison**: See improvements over time

## 🏗️ Architecture

```
frontend/
├── src/
│   ├── components/
│   │   ├── CustomIcon.tsx          # Icon component
│   │   ├── SkincareMultiSelect.tsx # Product selector
│   │   └── ThemeToggle.tsx         # Dark/light mode toggle
│   ├── contexts/
│   │   ├── AnalysisContext.tsx     # Analysis state management
│   │   ├── AuthContext.tsx         # Authentication state
│   │   └── ThemeContext.tsx        # Theme management
│   ├── data/
│   │   └── skincareProducts.ts     # Product database
│   ├── design/
│   │   └── DesignSystem.ts         # Colors, typography, spacing
│   ├── screens/
│   │   ├── AnalysisScreen.tsx      # Results & insights
│   │   ├── CameraScreen.tsx        # Photo capture
│   │   ├── HistoryScreen.tsx       # Historical data
│   │   ├── HomeScreen.tsx          # Main dashboard
│   │   ├── LoginScreen.tsx         # Login interface
│   │   ├── PhotoGalleryScreen.tsx  # Photo selection
│   │   ├── ProfileScreen.tsx       # User settings
│   │   └── RegisterScreen.tsx      # Registration
│   ├── services/
│   │   ├── analysisService.ts      # API integration
│   │   └── authService.ts          # Authentication service
│   ├── types/
│   │   └── index.ts                # TypeScript definitions
│   └── utils/
│       ├── imageCompression.ts     # Image optimization
│       ├── index.ts                # Utility functions
│       └── storage.ts              # AsyncStorage wrapper
├── App.tsx                         # Main application component
├── index.ts                        # Entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
└── tsconfig.json                   # TypeScript config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure backend URL**
   
   Edit `src/services/analysisService.ts`:
   ```typescript
   const API_BASE_URL = 'http://localhost:8000';  // Development
   // OR
   const API_BASE_URL = 'https://your-api.com';   // Production
   ```

### Running

#### Web Development
```bash
npm run web
```
Opens at: **http://localhost:8081**

#### iOS Simulator (Mac only)
```bash
npm run ios
```

#### Android Emulator
```bash
npm run android
```

#### Mobile Device (Expo Go)
```bash
npm start
```
Scan the QR code with Expo Go app:
- iOS: Camera app
- Android: Expo Go app

## 📱 Platform Support

| Platform | Status | Notes |
|----------|--------|-------|
| **Web** | ✅ Full Support | Desktop browsers |
| **iOS** | ✅ Full Support | iOS 13+ |
| **Android** | ✅ Full Support | Android 5+ |

## 🎨 Design System

### Colors
```typescript
primary: '#6366F1'      // Indigo
secondary: '#8B5CF6'    // Purple
success: '#10B981'      // Emerald
warning: '#F59E0B'      // Amber
error: '#EF4444'        // Red
background: '#1A1A2E'   // Dark blue
surface: '#16213E'      // Dark surface
```

### Typography
- **Content**: Baloo Bhaijaan 2 (warm, friendly)
- **Logo/Special**: JetBrains Mono (modern, tech)

### Components
- Glassmorphic cards with backdrop blur
- Gradient buttons and backgrounds
- Smooth animations and transitions
- Accessible touch targets (44px minimum)

## 📊 State Management

### AnalysisContext

Manages analysis results and routine data:

```typescript
const {
  currentAnalysis,      // Latest analysis result
  analysisHistory,      // Historical data
  saveAnalysisResult,   // Save new analysis
  loadHistory,          // Load historical data
  clearHistory          // Clear all data
} = useAnalysis();
```

### AuthContext

Manages user authentication:

```typescript
const {
  user,                 // Current user
  isAuthenticated,      // Auth status
  login,                // Login function
  logout,               // Logout function
  register              // Register function
} = useAuth();
```

### ThemeContext

Manages app theme:

```typescript
const {
  theme,                // Current theme
  toggleTheme           // Switch dark/light
} = useTheme();
```

## 🔌 API Integration

### Analysis Service

```typescript
import { analyzeImage } from '@/services/analysisService';

const result = await analyzeImage({
  imageUri: 'file://...',
  userId: 'user123',
  routine: {
    sleep_hours: 7.5,
    water_intake: 8,
    skincare_products: ['vitamin_c', 'retinol'],
    daily_note: 'Feeling great!'
  }
});
```

### Response Format

```typescript
{
  sleep_score: 84,
  skin_health_score: 78,
  features: {
    dark_circles: 65.2,
    puffiness: 58.4,
    brightness: 72.1,
    wrinkles: 68.9,
    texture: 71.5,
    pore_size: 63.7
  },
  fun_label: "Glow Queen 👑",
  smart_summary: {
    daily_summary: "Good progress! ...",
    key_insights: [...],
    recommendations: [...]
  }
}
```

## 📦 Dependencies

### Core
- `expo`: ~52.0.0 - Development platform
- `react`: 18.3.1 - UI framework
- `react-native`: 0.76.5 - Mobile framework
- `typescript`: ~5.3.3 - Type safety

### Navigation
- `@react-navigation/native`: ^7.0.12
- `@react-navigation/bottom-tabs`: ^7.2.2
- `@react-navigation/native-stack`: ^7.2.3

### UI Components
- `expo-linear-gradient`: ~14.0.2 - Gradients
- `expo-blur`: ~14.0.1 - Blur effects
- `react-native-chart-kit`: ^6.12.0 - Charts
- `@expo/vector-icons`: ^14.0.4 - Icons

### Camera & Media
- `expo-camera`: ~16.0.8 - Camera access
- `expo-image-picker`: ~16.0.5 - Gallery access
- `expo-image-manipulator`: ~13.0.5 - Image processing

### Storage & Auth
- `@react-native-async-storage/async-storage`: 2.1.0
- `expo-secure-store`: ~14.0.0
- Firebase SDK (if using Firebase auth)

## 🧪 Testing

### Manual Testing Checklist

- [ ] Camera capture works on web/mobile
- [ ] Gallery photo selection works
- [ ] Routine data saves correctly
- [ ] API integration with backend
- [ ] Historical data persistence
- [ ] Charts display correctly
- [ ] Streak tracking accurate
- [ ] Navigation smooth
- [ ] Fonts load properly

### Test User Flow

1. Open app → Camera screen
2. Take selfie or select from gallery
3. Fill routine data (sleep, water, products)
4. Click "Analyze Photo"
5. View results in Insights tab
6. Check historical data
7. Verify streak counter

## 🎯 Performance Optimization

### Image Compression

```typescript
import { compressImage } from '@/utils/imageCompression';

const compressed = await compressImage(uri, {
  quality: 0.8,
  maxWidth: 1024,
  maxHeight: 1024
});
```

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const HistoryScreen = lazy(() => import('./screens/HistoryScreen'));

<Suspense fallback={<Loading />}>
  <HistoryScreen />
</Suspense>
```

### Memory Management

- Clear camera cache after upload
- Compress images before storage
- Limit history to 30 days
- Use FlatList for large lists

## 🔧 Configuration

### app.json

```json
{
  "expo": {
    "name": "Sleep Face",
    "slug": "sleepface",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow Sleep Face to capture your daily selfie"
        }
      ]
    ]
  }
}
```

## 📱 Building for Production

### iOS (Mac only)

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

### Web

```bash
npm run build:web
```

## 🐛 Debugging

### Expo DevTools

```bash
npm start
# Press 'd' to open DevTools
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Press 'w' for web browser
```

### React Native Debugger

1. Install: `brew install --cask react-native-debugger`
2. Open debugger
3. Shake device → Debug Remote JS

### Logs

```bash
npx react-native log-ios      # iOS logs
npx react-native log-android  # Android logs
```

## 🔐 Security

- Secure storage for tokens
- Image data never cached
- HTTPS-only API communication
- Input sanitization
- Permission handling

## 🌐 Deployment

### Expo EAS

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Build**
   ```bash
   eas build --platform all
   ```

4. **Submit to stores**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)

## 🤝 Contributing

1. Create feature branch
2. Follow existing code style
3. Test on iOS and Android
4. Submit pull request

## 📄 License

MIT License - See LICENSE file for details

---

**Made with ❤️ for better sleep and skin health**

