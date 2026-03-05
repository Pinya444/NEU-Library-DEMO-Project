# 📚 NEU Library – Visitor Management System

A web-based visitor logging system for the **New Era University Library**.  
Built with **Next.js 14**, **Firebase** (Auth, Firestore), and **TypeScript**.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Google Sign-In** | Restricted to `@neu.edu.ph` institutional accounts only |
| **First-time Onboarding** | One-time college/office selection stored in Firestore |
| **Visit Logging** | Students and faculty log their reason for visiting (Reading, Research, Computer Use, Studying) |
| **Welcome Screen** | High-visibility confirmation with auto-return for kiosk mode |
| **Admin Dashboard** | Real-time stats cards, visit trend sparkline, college & reason breakdowns |
| **Date Filtering** | Today / This Week / This Month / Custom range filters |
| **User Search** | Look up visitors by institutional email, view full visit history |
| **Block System** | Admins can block/unblock users with mandatory reason; blocked users see "Access Denied" |
| **Audit Log** | Immutable block/unblock history per user stored in Firestore |

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript (strict mode)
- **Auth**: Firebase Authentication (Google provider)
- **Database**: Cloud Firestore
- **Styling**: Tailwind CSS
- **Fonts**: Playfair Display + DM Sans (Google Fonts)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Firebase project](https://console.firebase.google.com/) with **Blaze** or **Spark** plan
- Google Sign-In enabled in Firebase Authentication

### 1. Clone the repo

```bash
git clone https://github.com/your-username/neu-library-visitor-app.git
cd neu-library-visitor-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your Firebase project values from  
**Firebase Console → Project Settings → Your apps → SDK setup & configuration**.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### 4. Deploy Firestore rules & indexes

```bash
npm install -g firebase-tools
firebase login
firebase use --add          # select your project
firebase deploy --only firestore:rules,firestore:indexes
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔐 Firebase Setup Checklist

- [ ] **Authentication → Sign-in method → Google → Enable**
- [ ] Add `localhost` to **Authorized domains** (for local dev)
- [ ] Add your production domain to Authorized domains
- [ ] **Firestore Database → Create database** (Production mode)
- [ ] Deploy `firestore.rules` and `firestore.indexes.json`
- [ ] **Set the first admin manually** — find your user document in Firestore and set `role: "admin"` (users cannot self-assign admin role)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, global CSS)
│   ├── page.tsx                # Redirects / → /login
│   ├── login/page.tsx          # Google Sign-In screen
│   ├── onboarding/page.tsx     # First-time college/office setup
│   ├── checkin/page.tsx        # Returning user: reason selection
│   ├── welcome/page.tsx        # Post-check-in success screen
│   └── dashboard/
│       └── admin/page.tsx      # Admin dashboard (protected)
├── components/
│   ├── AuthGuard.tsx           # Route protection wrapper
│   ├── ReasonCard.tsx          # Check-in reason tile
│   ├── admin/
│   │   ├── StatCard.tsx        # Animated summary card
│   │   ├── DateRangePicker.tsx # Preset + custom date filter
│   │   ├── CollegeBreakdownChart.tsx
│   │   ├── ReasonDonutChart.tsx
│   │   ├── TrendSparkline.tsx
│   │   ├── BlockModal.tsx      # Block/unblock confirmation dialog
│   │   └── UserSearchPanel.tsx # Email search + detail + block log
│   └── ui/
│       ├── BlockBadge.tsx      # Status pill + toggle button atoms
│       └── AccessDenied.tsx    # Full-screen denied screen
├── hooks/
│   ├── useAuth.ts              # Firebase auth state + routing
│   ├── useVisitLog.ts          # Check-in state machine
│   ├── useAdminDashboard.ts    # Stats + user search state
│   └── useBlockAction.ts      # Block modal state machine
├── lib/
│   ├── firebase.ts             # Firebase app init
│   ├── userService.ts          # users collection operations
│   ├── visitLogService.ts      # logs collection operations
│   ├── adminService.ts         # Admin aggregation queries
│   └── blockService.ts         # Block/unblock + audit log
└── types/
    ├── user.ts                 # NEUUser, UserRole, BlockAction
    ├── visitLog.ts             # VisitLog, VisitReason
    └── analytics.ts            # AdminStats, DateRange, etc.
```

---

## 🗺 User Flow

```
/login  ──(Google Sign-In)──► New user?
                                  ├── Yes → /onboarding  (select college/office, one time only)
                                  └── No  → isBlocked?
                                               ├── Yes → /checkin shows "Access Denied"
                                               └── No  → /checkin  (select reason)
                                                             └── Submit → /welcome (8s auto-return)

Admin users → /dashboard/admin  (stats, charts, user search, block controls)
```

---

## 🔒 Security Model

**Block enforcement uses defense-in-depth:**

1. **Client gate** — `checkBlockStatus()` fires on `/checkin` load. Blocked users never see the form.
2. **Firestore rule gate** — `/logs create` rule checks `isNotBlocked()` server-side. Even a direct SDK call is rejected with `PERMISSION_DENIED`.

**Users can never self-escalate:**  
The `users` create rule enforces `role == "user"`. Admins must be set manually in the Firestore console.

**Logs are immutable:**  
`update` and `delete` are disabled on `/logs` for all non-admin users. Block history events are immutable for everyone.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript check without emitting |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request against `main`

The CI workflow will automatically run lint and type checks on your PR.

---

## 📄 License

MIT © Angelo Joseph P. Cruz — New Era University
