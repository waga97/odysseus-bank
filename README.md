# Odysseus Bank

Payment Transfer Module with Biometric Authentication for the Odysseus Bank mobile app.

## Overview

This module handles the complete P2P money transfer flow, including recipient selection, amount entry, transfer limits validation, biometric authentication (with PIN fallback), and transaction processing. Built with React Native + Expo, targeting both iOS and Android.

## Tech Stack

- **React Native 0.81** + **Expo 54** (managed workflow with dev client)
- **TypeScript** with strict mode enabled
- **React Navigation 6** - native stack for performant transitions
- **Zustand** - lightweight state management with shallow selectors
- **expo-local-authentication** - Face ID / Touch ID / Fingerprint
- **expo-contacts** - DuitNow contact-based transfers
- **Jest** + React Native Testing Library for unit tests

## Prerequisites

- Node.js 18+
- Xcode 15+ (iOS development)
- Android Studio (Android development)
- CocoaPods (iOS native dependencies)
- Physical device recommended for biometric testing

## Getting Started

### Install dependencies

```bash
npm install
```

### Development Build (Recommended)

Biometrics require a dev build - they wont work in Expo Go due to permission limitations.

**iOS:**

```bash
npx expo prebuild
cd ios && pod install && cd ..
npx expo run:ios --device
```

**Android:**

```bash
npx expo prebuild
npx expo run:android --device
```

Then start the dev server:

```bash
npx expo start --dev-client
```

### Quick Start (Expo Go)

For UI development without biometrics:

```bash
npx expo start
```

Note: Biometric auth will fail in Expo Go. The app will automatically fall back to PIN entry (default: `123456`).

## Project Structure

```
src/
├── components/ui/       # Reusable UI components (Button, Input, Avatar, etc.)
├── features/            # Feature-based screen modules
│   ├── home/            # Dashboard with balance, quick actions
│   ├── transfer/        # Transfer hub (recipient selection)
│   ├── bank-selection/  # Bank picker for inter-bank transfers
│   ├── recipient/       # Manual account entry
│   ├── contacts/        # DuitNow contact picker
│   ├── amount/          # Amount entry with limit validation
│   ├── review/          # Transfer confirmation
│   ├── biometric/       # Auth screen (biometric + PIN fallback)
│   ├── processing/      # Transaction processing with retry logic
│   ├── success/         # Success screen with receipt sharing
│   ├── error/           # Error handling with user-friendly messages
│   ├── history/         # Paginated transaction history
│   └── settings/        # App settings and limits display
├── navigation/          # React Navigation config
├── stores/              # Zustand stores (auth, account, transfer)
├── services/
│   ├── api/             # API client setup (ready for real backend)
│   └── mocks/           # Mock API with configurable delays and failures
├── hooks/               # Custom React hooks (network status, animations)
├── utils/               # Helper functions (currency, validation, retry)
├── theme/               # Design tokens (colors, typography, spacing)
├── types/               # TypeScript interfaces and types
└── config/              # Centralized app configuration
```

## Architecture Decisions

### Feature-Based Structure

Each feature is self-contained with its own screen components. Shared UI lives in `components/ui/`. This keeps features isolated and makes it easy to find related code.

### Single Source of Truth for Configuration

All configurable values live in `src/config/app.ts`. This includes mock data, transfer limits, API delays, validation thresholds, and feature flags. The mock API and validation logic pull from this config, ensuring consistency across the app.

### Mock-First Development

The app runs entirely on mock data via `services/mocks/`. The mock API simulates network delays, random failures, and can return different account states for testing. To swap to a real backend, update the imports in the API endpoints.

### Transfer Validation

All transfer validation logic lives in `utils/validateTransfer.ts` - single source of truth used by both the mock API and UI. This prevents validation drift between frontend and backend.

Validation checks:

- Sufficient balance (hard block)
- Per-transaction limit (hard block)
- Daily limit remaining (hard block, with configurable warning threshold)
- Monthly limit remaining (hard block, with configurable warning threshold)

### Error Handling

Errors are mapped to user-friendly messages in the error screen. The app includes:

- Automatic retry with exponential backoff for transient network failures
- Specific error screens for each error type (insufficient funds, daily/monthly limits, network error, invalid account)
- Offline detection with banner notification

### Biometric Auth Flow

The BiometricAuthScreen handles multiple auth scenarios:

1. Primary biometric (Face ID / Touch ID / Fingerprint)
2. Fallback to 6-digit PIN after biometric failure
3. Retry mechanisms with attempt counting
4. Device biometric not available gracefully falls back to PIN
5. Biometric toggle in Settings to enable/disable

The PIN is configurable in `src/config/app.ts` (default: `123456`).

### State Management

Using Zustand for its simplicity. Three stores:

- `authStore` - user auth state, biometric preferences
- `accountStore` - accounts, recipients, transactions, transfer limits
- `transferStore` - current transfer in progress

Optimized with:

- Computed selectors for derived state (recent recipients, favorites)
- Shallow equality comparisons to prevent unnecessary re-renders
- Memoized action selectors

### Performance Optimizations

- `React.memo` on frequently rendered components (Button)
- `useMemo` for filtered/computed arrays
- Paginated transaction history (5 per page)
- FlatList with proper virtualization settings
- Skeleton loading states instead of spinners

### Accessibility

Interactive components include:

- `accessibilityRole` for semantic meaning
- `accessibilityLabel` for screen readers
- `accessibilityState` for disabled/loading states
- `accessibilityHint` for additional context

### Design Token System

All visual constants are centralized:

- `theme/colors.ts` - semantic color palette
- `theme/typography.ts` - font sizes and weights
- `theme/spacing.ts` - consistent spacing scale
- `theme/componentSizes.ts` - icon sizes, touch targets, etc.

This makes global design changes easy and keeps the UI consistent.

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

Tests cover:

- Transfer validation logic (25+ test cases)
- Currency formatting
- Mock API behavior (limits, transactions, error scenarios)
- Store state management (auth, accounts)
- Retry utility with exponential backoff

### Manual Testing

For manual testing flows including happy paths, error scenarios, and how to trigger each error type, see **[TESTCASES.md](./TESTCASES.md)**.

The test cases document includes:

- Step-by-step flows for all transfer scenarios
- How to trigger each error type (insufficient funds, limits, network errors)
- Test account numbers for specific behaviors
- Configuration tips for testing different states

## Linting & Formatting

```bash
# Lint check
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

Pre-commit hooks run lint and prettier automatically via husky + lint-staged.

## Configuration

All app settings are centralized in `src/config/app.ts`:

```typescript
{
  loadingDelay: 800,                    // Simulated API delay (ms)
  pinCode: '123456',                    // Fallback PIN for auth

  mockBalances: {
    current: 73566.75,                  // Default account balance
    savings: 10000.0,
  },

  transferLimits: {
    daily: { limit: 10000, used: 2000 },
    monthly: { limit: 20000, used: 15000 },
    perTransaction: 6000,
  },

  mockApi: {
    networkFailureRate: 0.05,           // 5% chance of network error
    transferDelay: 1500,                // Transfer processing time (ms)
  },

  validation: {
    limitWarningThreshold: 0.8,         // Warn at 80% of limit
  },

  features: {
    enableHaptics: true,
    enableBiometrics: true,
    enableOfflineMode: true,
  },
}
```

Changing these values affects the whole app - no rebuild needed for config tweaks.

## Simulating Different Scenarios

| Scenario          | How to Trigger                                             |
| ----------------- | ---------------------------------------------------------- |
| Low balance       | Change `mockBalances.current` in config                    |
| Near daily limit  | Set `transferLimits.daily.used` close to `limit`           |
| Biometric failure | Use simulator with no Face ID enrolled, or deny permission |
| Network error     | Set `mockApi.networkFailureRate` to `1.0` for 100% failure |
| Invalid account   | Use account number `111122223333`                          |
| Offline mode      | Toggle airplane mode - the app shows an offline banner     |

See [TESTCASES.md](./TESTCASES.md) for complete testing guide.

## Known Limitations

- TransactionDetails screen is a placeholder (not implemented yet)
- No real API integration - mock only
- No push notifications
- Receipt sharing uses native share sheet
- Tests exclude type-checking (tsconfig excludes test dirs)

## Troubleshooting

**Biometrics not working in Expo Go:**
This is expected. Use `npx expo run:ios` or `npx expo run:android` with a dev client.

**iOS Simulator biometrics:**
Go to Features > Face ID > Enrolled, then Features > Face ID > Matching Face when prompted.

**Android Emulator fingerprint:**
Use Extended Controls > Fingerprint > Touch Sensor.

**Pod install fails:**
Delete `ios/Pods` and `ios/Podfile.lock`, then run `pod install` again.

## Scripts Reference

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `npm start`          | Start Expo dev server          |
| `npm run ios`        | Run on iOS device/simulator    |
| `npm run android`    | Run on Android device/emulator |
| `npm test`           | Run Jest tests                 |
| `npm run lint`       | ESLint check                   |
| `npm run type-check` | TypeScript check               |
| `npm run format`     | Prettier format                |

---

Last updated: Feb 1, 2026
Author : Arshad
