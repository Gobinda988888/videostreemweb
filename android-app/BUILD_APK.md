# DesiixVideo Android APK Build Instructions

## Requirements
1. **Android Studio** - Download from: https://developer.android.com/studio
2. **JDK 11 or higher**

## Build Steps

### Method 1: Using Android Studio (Easiest)

1. **Open Project:**
   - Open Android Studio
   - Click "Open" → Select `android-app` folder
   - Wait for Gradle sync to complete

2. **Generate Keystore (First time only):**
   ```bash
   # In Android Studio Terminal
   keytool -genkey -v -keystore desiixvideo.keystore -alias desiixvideo -keyalg RSA -keysize 2048 -validity 10000
   # Enter password: desiix@123
   # Fill other details as prompted
   ```

3. **Build APK:**
   - Click "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"
   - Wait for build to complete
   - APK will be at: `app/build/outputs/apk/debug/app-debug.apk`

4. **Build Signed Release APK:**
   - Click "Build" → "Generate Signed Bundle / APK"
   - Select "APK" → Next
   - Create new keystore or use existing
   - Select "release" build variant
   - APK will be at: `app/build/outputs/apk/release/app-release.apk`

### Method 2: Command Line Build

1. **Install Android SDK:**
   - Download command line tools from Android Developer website
   - Set ANDROID_HOME environment variable

2. **Build Debug APK:**
   ```bash
   cd android-app
   gradlew.bat assembleDebug
   # APK: app/build/outputs/apk/debug/app-debug.apk
   ```

3. **Build Release APK:**
   ```bash
   cd android-app
   gradlew.bat assembleRelease
   # APK: app/build/outputs/apk/release/app-release.apk
   ```

## Install APK on Phone

### Option 1: Direct Install
1. Copy APK to phone
2. Open file manager → Click APK
3. Allow "Install from unknown sources"
4. Click Install

### Option 2: ADB Install
```bash
adb install app-debug.apk
```

## Features
✅ Full website in native Android app
✅ Splash screen with logo
✅ Back button navigation
✅ Hardware acceleration
✅ Offline caching
✅ Video playback support
✅ JavaScript enabled
✅ Local storage support

## App Info
- Package: `com.desiixvideo.app`
- Min SDK: 21 (Android 5.0)
- Target SDK: 34 (Android 14)
- Version: 1.0

## Troubleshooting

**Build Failed:**
- Run: `gradlew.bat clean`
- Sync Gradle again

**APK Not Installing:**
- Enable "Unknown sources" in Settings
- Check if older version is installed (uninstall first)

**White screen on open:**
- Check internet connection
- Website URL is correct: https://desiixvideo.me/

## Online APK Builder (No Android Studio needed)

If you don't want to install Android Studio, use online services:

1. **AppGeyser** - https://appgeyser.com/
   - Free, no coding needed
   - Just enter website URL
   - Download APK instantly

2. **AppsGeyser** - https://www.appsgeyser.com/
   - Enter: https://desiixvideo.me/
   - Add icon and name
   - Download APK

3. **Appy Pie** - https://www.appypie.com/
   - Drag and drop builder
   - Add WebView component
   - Export APK

## Quick Build (If you have Android Studio)

```bash
# Open terminal in android-app folder
gradlew.bat assembleDebug

# APK ready at:
# app\build\outputs\apk\debug\app-debug.apk

# Install via ADB:
adb install app\build\outputs\apk\debug\app-debug.apk
```

Done! 🚀
