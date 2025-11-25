# Mobile App Setup

## React Native Mobile App for Creator Project Tracker

### Prerequisites
- Node.js 18+
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)
- CocoaPods (for iOS)

### Installation

1. **Install dependencies**
   ```bash
   cd mobile
   npm install
   ```

2. **iOS Setup**
   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Configure Environment**
   
   Create `mobile/.env`:
   ```bash
   API_URL=http://localhost:5000
   FIREBASE_API_KEY=your-key
   FIREBASE_AUTH_DOMAIN=your-domain
   FIREBASE_PROJECT_ID=your-project
   # Add all Firebase config
   ```

4. **Configure Firebase**
   
   **iOS:**
   - Download `GoogleService-Info.plist` from Firebase Console
   - Place in `mobile/ios/` directory
   - Add to Xcode project
   
   **Android:**
   - Download `google-services.json` from Firebase Console
   - Place in `mobile/android/app/` directory

### Running the App

**iOS:**
```bash
npm run ios
# Or specific simulator
npx react-native run-ios --simulator="iPhone 14 Pro"
```

**Android:**
```bash
npm run android
# Make sure Android emulator is running
```

### Project Structure

```
mobile/
├── src/
│   ├── screens/         # App screens
│   ├── components/      # Reusable components
│   ├── contexts/        # React contexts
│   ├── services/        # API services
│   ├── utils/          # Utilities
│   └── navigation/     # Navigation config
├── ios/                # iOS native code
├── android/            # Android native code
└── App.js             # Entry point
```

### Key Screens to Implement

1. **LoginScreen** - Email/password and Google OAuth
2. **DashboardScreen** - Overview with stats
3. **ProjectsScreen** - Kanban board view
4. **ProjectDetailScreen** - View/edit project
5. **CalendarScreen** - Calendar with events
6. **BrandDealsScreen** - List of deals
7. **BrandDealDetailScreen** - Deal details
8. **AIToolsScreen** - AI generation tools (Pro only)
9. **SettingsScreen** - User settings
10. **SubscriptionScreen** - Upgrade to Pro

### Push Notifications Setup

1. **iOS:**
   - Enable Push Notifications in Xcode capabilities
   - Upload APNs certificate to Firebase Console
   
2. **Android:**
   - Firebase automatically handles FCM
   
3. **Request Permission:**
   ```javascript
   import messaging from '@react-native-firebase/messaging';
   
   async function requestUserPermission() {
     const authStatus = await messaging().requestPermission();
     const enabled =
       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
       authStatus === messaging.AuthorizationStatus.PROVISIONAL;
     return enabled;
   }
   ```

### API Integration

Create `src/services/api.js`:
```javascript
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import { API_URL } from '@env';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const user = auth().currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Storage

Use AsyncStorage for local data:
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save
await AsyncStorage.setItem('key', value);

// Get
const value = await AsyncStorage.getItem('key');
```

### Styling

Use React Native Paper for consistent UI:
```javascript
import { Button, Card, TextInput } from 'react-native-paper';
```

### Testing

```bash
npm test
```

### Building for Production

**iOS:**
```bash
cd ios
xcodebuild -workspace YourApp.xcworkspace \
  -scheme YourApp \
  -configuration Release \
  -archivePath build/YourApp.xcarchive archive
```

**Android:**
```bash
cd android
./gradlew assembleRelease
# APK will be in android/app/build/outputs/apk/release/
```

### Troubleshooting

**iOS Build Issues:**
- Clean build folder: Xcode > Product > Clean Build Folder
- Delete Pods: `cd ios && rm -rf Pods && pod install`

**Android Build Issues:**
- Clean Gradle: `cd android && ./gradlew clean`
- Reset Metro: `npx react-native start --reset-cache`

**Common Issues:**
- Metro bundler port conflict: Kill process on port 8081
- Simulator not found: Check Xcode simulator list
- Android SDK path: Update `local.properties`

### Additional Features to Implement

1. **Offline Support** - Cache data locally
2. **Biometric Auth** - Face ID / Touch ID
3. **Deep Linking** - Open specific screens from URLs
4. **Share Extension** - Share content to app
5. **Widgets** - iOS/Android home screen widgets

### Performance Optimization

- Use React.memo for components
- Implement FlatList for long lists
- Use Hermes JavaScript engine
- Enable ProGuard (Android)
- Optimize images with FastImage

### App Store Submission

See `DEPLOYMENT.md` for detailed instructions on:
- iOS App Store submission
- Android Play Store submission
- App review guidelines
- Required screenshots and assets
