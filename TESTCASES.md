# Test Cases

Manual testing guide for the Payment Transfer Module. Covers both successful flows and error scenarios.

## Happy Flow Tests

### 1. Basic Transfer (Recent Recipient)

**Steps:**

1. Open app and tap "Transfer" on home screen
2. Select a recipient from "Recent" list
3. Enter amount (e.g. RM 100)
4. Add optional note
5. Tap "Continue"
6. Review transfer details
7. Tap "Confirm Transfer"
8. Authenticate with Face ID / Touch ID (or enter PIN: 123456)
9. Wait for processing to complete

**Expected:** Transfer succeeds, success screen shows with reference number. Balance updates on home screen.

---

### 2. Transfer to New Recipient (Account Number)

**Steps:**

1. Tap "Transfer" > "New Recipient"
2. Select a bank from the list
3. Enter account number (any 10+ digits)
4. Tap "Continue"
5. Enter amount and complete transfer flow

**Expected:** Recipient lookup succeeds, transfer completes normally.

---

### 3. DuitNow Transfer (Phone Number)

**Steps:**

1. Tap "Transfer" > "DuitNow"
2. Allow contacts permission if prompted
3. Select a contact with phone number
4. Enter amount and complete transfer

**Expected:** Phone number is used for DuitNow lookup, transfer completes.

---

### 4. Transfer with PIN Authentication

**Steps:**

1. Go to Settings > disable "Face ID Authentication" toggle
2. Start a transfer
3. On auth screen, enter PIN: 123456

**Expected:** PIN is accepted, transfer proceeds to processing.

---

### 5. Transfer with Limit Warning

**Steps:**

1. Check your remaining daily limit in Settings
2. Start a transfer with amount above 80% of remaining limit
3. Continue through the flow

**Expected:** Yellow warning banner appears on amount screen saying "Approaching daily limit". Transfer still allowed.

---

### 6. View Transaction History

**Steps:**

1. From home screen, tap "History" or scroll down to transactions
2. Pull down to refresh

**Expected:** Shows list of recent transactions including any transfers just made.

---

## Error Flow Tests

### 1. Insufficient Funds

**Error Name:** INSUFFICIENT_FUNDS

**How to Trigger:**

- Enter an amount higher than your current account balance
- Default balance is RM 73,566.75 (check Settings for current balance)

**Steps:**

1. Start a transfer to any recipient
2. Enter amount: RM 80,000 (or any amount above your balance)
3. Complete auth and wait for processing

**Expected:** Error screen appears with title "Insufficient Funds" and message about low balance.

---

### 2. Daily Limit Exceeded

**Error Name:** DAILY_LIMIT_EXCEEDED

**How to Trigger:**

- Make multiple transfers until you hit the daily limit
- Default daily limit is RM 10,000 with RM 2,000 already used (RM 8,000 remaining)

**Steps:**

1. Make a transfer of RM 4,000
2. Make another transfer of RM 4,000
3. Try to make a third transfer of any amount above RM 100

**Expected:** Error screen appears with title "Daily Limit Reached".

Alternative: You can also change `transferLimits.daily.used` in `src/config/app.ts` to be close to the limit value.

---

### 3. Invalid Account Number

**Error Name:** INVALID_ACCOUNT

**How to Trigger:**

- Use the special test account number: `111122223333`

**Steps:**

1. Tap Transfer > New Recipient
2. Select any bank
3. Enter account number: `111122223333`
4. Complete the transfer flow

**Expected:** Error screen appears with title "Recipient Not Found" after processing starts.

---

### 4. Network Error

**Error Name:** NETWORK_ERROR

**How to Trigger:**

- The mock API has a configurable random failure rate (default 5%)
- Run multiple transfers and eventually one will fail with network error

**Steps:**

1. Start a transfer (any recipient, any amount)
2. Complete the transfer flow
3. Repeat if needed (5% chance per transfer)

**Expected:** Error screen appears with title "Connection Error" and message about checking internet.

Note: The app includes automatic retry logic with exponential backoff (3 attempts), so transient failures may recover automatically. If all retries fail, the error screen appears.

To test more reliably, change `mockApi.networkFailureRate` in `src/config/app.ts` to `1.0` for 100% failure rate.

---

### 5. Wrong PIN Entry

**Error Name:** N/A (not an API error)

**How to Trigger:**

- Enter incorrect PIN on auth screen

**Steps:**

1. Go to Settings > disable Face ID Authentication
2. Start any transfer
3. On PIN screen, enter wrong PIN (e.g. 000000)

**Expected:** PIN dots shake, error message "Incorrect PIN. Please try again." appears. PIN field clears for retry.

---

### 6. Biometric Auth Cancelled

**Error Name:** N/A (not an API error)

**How to Trigger:**

- Cancel Face ID / Touch ID prompt

**Steps:**

1. Make sure Face ID is enabled in Settings
2. Start a transfer
3. When biometric prompt appears, tap "Cancel"

**Expected:** Screen shows "Authentication cancelled" with retry option. User can tap "Use PIN instead" as fallback.

---

### 7. Per-Transaction Limit Exceeded

**Error Name:** Blocked at UI level (doesn't reach API)

**How to Trigger:**

- Enter amount above per-transaction limit
- Default per-transaction limit is RM 6,000

**Steps:**

1. Start any transfer
2. Enter amount: RM 7,000

**Expected:** Continue button is disabled. Error message shows "Exceeds per-transaction limit of RM 6,000.00"

---

### 8. Monthly Limit Exceeded

**Error Name:** MONTHLY_LIMIT_EXCEEDED

**How to Trigger:**

- Enter amount that would exceed monthly remaining
- Default monthly limit is RM 20,000 with RM 15,000 used (RM 5,000 remaining)

**Steps:**

1. Start any transfer
2. Enter amount: RM 6,000 (above RM 5,000 remaining)

**Expected:** Continue button is disabled. Error message shows amount exceeds monthly limit.

Note: Monthly limit is also enforced at the API level, so even if UI validation is bypassed, the transfer will fail.

---

## Configuration Tips

You can adjust these values in `src/config/app.ts` to make testing easier:

| Setting                            | Default  | What it affects                     |
| ---------------------------------- | -------- | ----------------------------------- |
| `pinCode`                          | 123456   | PIN for auth fallback               |
| `mockBalances.current`             | 73566.75 | Account balance shown               |
| `transferLimits.daily.used`        | 2000     | How much of daily limit is "used"   |
| `transferLimits.monthly.used`      | 15000    | How much of monthly limit is "used" |
| `transferLimits.perTransaction`    | 6000     | Max single transfer amount          |
| `loadingDelay`                     | 800      | API response delay in ms            |
| `features.enableBiometrics`        | true     | Default state of Face ID toggle     |
| `mockApi.networkFailureRate`       | 0.05     | Network error probability (0-1)     |
| `mockApi.transferDelay`            | 1500     | Transfer processing delay in ms     |
| `validation.limitWarningThreshold` | 0.8      | Warn at this % of limit (0-1)       |

Changes to config take effect on app reload - no rebuild needed.

---

## Quick Reference: Test Account Numbers

| Account Number   | Triggers              |
| ---------------- | --------------------- |
| `111122223333`   | Invalid Account error |
| Any other number | Normal success flow   |

---

Last updated: Feb 1, 2026
