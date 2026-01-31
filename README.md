# Odysseus Bank

A React Native banking app built with Expo.

## Features

- Fund transfers (Bank & DuitNow)
- Biometric authentication (Face ID / Touch ID / Fingerprint)
- Contact picker for DuitNow transfers

## Prerequisites

- Node.js 18+
- Xcode (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)
- Physical device (for biometric testing)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Choose your run method

#### Option A: Expo Go (Limited Features)

```bash
npx expo start
```

Scan the QR code with Expo Go app.

**Note:** Biometrics (Face ID / Touch ID / Fingerprint) will NOT work in Expo Go due to permission limitations.

#### Option B: Development Build (Recommended)

For biometric authentication to work, you need a development build.

**iOS:**

```bash
npx expo install expo-dev-client
npx expo prebuild
cd ios && pod install && cd ..
npx expo run:ios --device
```

**Android:**

```bash
npx expo install expo-dev-client
npx expo prebuild
npx expo run:android --device
```

Then start the dev server:

```bash
npx expo start --dev-client
```

## Running on iOS Device

1. Connect your iPhone via USB
2. Run `npx expo run:ios --device`
3. Select your device from the list
4. The app will install and launch

## Running on Android Device

1. Enable USB debugging on your Android device
2. Connect your device via USB
3. Run `npx expo run:android --device`
4. Select your device from the list
5. The app will install and launch

## Biometric Authentication

Biometrics require a **development build** on a **physical device**.

### Why Expo Go doesn't work

- Expo Go app doesn't have biometric permissions
- Your app runs inside Expo Go, inheriting its permission limitations
- Development builds create your own app with proper permissions

### iOS Simulator

If using iOS Simulator:

1. Go to Features > Face ID > Enrolled
2. When prompted, go to Features > Face ID > Matching Face

### Android Emulator

If using Android Emulator:

1. Go to Extended Controls (three dots)
2. Go to Fingerprint
3. Touch the sensor to simulate fingerprint

## Project Structure

```
src/
├── components/ui/     # Reusable UI components
├── features/          # Feature screens
│   ├── home/          # Home dashboard
│   ├── transfer/      # Transfer hub
│   ├── amount/        # Amount entry
│   ├── review/        # Transfer review
│   ├── biometric/     # Biometric auth
│   ├── processing/    # Transfer processing
│   ├── success/       # Success screen
│   └── contacts/      # Contact picker
├── navigation/        # React Navigation setup
├── stores/            # Zustand state stores
├── services/          # API & mock services
└── theme/             # Design tokens
```

## Tech Stack

- React Native + Expo
- TypeScript
- React Navigation
- Zustand (state management)
- expo-local-authentication (biometrics)
- expo-contacts (contact picker)
