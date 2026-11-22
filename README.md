# PizzaHub 🍕

**Discover local pizza shops, browse real menus, and order food that arrives hot.**

PizzaHub is a full-stack pizza ordering and delivery platform built with Next.js 16. Customers explore neighborhood kitchens, vendors manage menus and orders, and admins keep the platform healthy. It combines role-based dashboards, Stripe payments, image uploads, and a warm, animated UI.

[Live website](https://pizzahub-asgorfaiyaz.vercel.app) · [Client repository](https://github.com/asgorfaiyaz/pizzahub.git)

---

## ✨ Features

### For everyone
- **Homepage** with a pizza hero, approved featured items, category browsing, and subtle Motion animations
- **Browse menu** with live search, status/category/location filters, sorting, and pagination
- **Item details** with image gallery, restaurant/vendor info, related items, and ordering
- **Authentication** with email/password and Google sign-in, customer/vendor roles at sign-up
- **Custom error pages** for 404, unauthorized, forbidden, and unexpected errors
- **Dark mode** and a responsive, pizza-friendly design system

### Customers
- Personal overview with order statistics
- Order history with detailed delivery info, status, and cancellation for pending orders
- Checkout demo flow and Stripe-backed premium upgrade success/cancel pages
- Profile settings with name and avatar updates

### Vendors
- Overview with live menu/order/subscription stats
- Menu item management: create, edit, delete, availability, and ImgBB image uploads
- Customer order management with status updates
- Subscription page with usage limits and Stripe checkout for Premium
- Restaurant info page with editable location, hours, and phone

### Admins
- Platform overview: users, vendors, customers, menu items, pending items, transactions
- User management with search, role filtering, pagination, block/unblock, and detail dialogs
- Menu moderation: approve, reject, set pending/inactive, and delete items
- Transaction history with pagination

### Security & architecture
- Edge proxy plus layout-level role guards (`customer`, `vendor`, `admin`)
- Blocked accounts are redirected with a clear reason; sessions are revoked by the backend
- Shared server-only API client (`serverApiFetch`) for auth headers, parsing, and error handling
- API `401` → `/unauthorized`, `403` → `/forbidden`, blocked accounts → sign-in notice
- Protected server actions for all mutations; tokens never reach the browser

---

## 🛠 Tech stack

| Area | Packages |
|---|---|
| Framework | `next@16.4.6` (App Router, Cache Components, Turbopack), `react@19.3.0`, `react-dom@19.3.0` |
| Language | `typescript@5` |
| Styling | `tailwindcss@4.3.3`, `@tailwindcss/turbopack`, `tw-animate-css`, `class-variance-authority`, `cn` |
| UI components | `shadcn`, `@base-ui/react`, `lucide-react`, `react-icons`, `next-themes` |
| Animation | `motion` |
| Forms & validation | `react-hook-form`, `zod`, `@hookform/resolvers` |
| Auth & database | `better-auth`, `mongodb` |
| Payments | Stripe (checkout sessions, confirmation, webhooks) |
| Images | ImgBB upload API |
| Notifications | `sonner` + shadcn toast primitives |
| Tooling | `eslint`, `eslint-config-next`, `babel-plugin-react-compiler` |

---

## 🔗 Links

| Resource | Link |
|---|---|
| Live website | https://pizzahub-asgorfaiyaz.vercel.app |
| Client repository | https://github.com/asgorfaiyaz/pizzahub.git |
| Server repository | _Add the backend repository URL here_ |

---

## ⚙️ Environment variables

Create a `.env` file in the project root. Use `.env.example` as a starting point.

| Variable | Used for |
|---|---|
| `MONGODB_URI` | MongoDB connection for Better Auth sessions/users |
| `BETTER_AUTH_URL` | Public base URL for Better Auth |
| `BETTER_AUTH_SECRET` | Secret used to sign auth tokens/cookies |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `SERVER_URL` | Backend API base URL, e.g. `http://localhost:5000/api/v1` |
| `IMGBB_API_KEY` | API key for image uploads |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key for checkout sessions |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature verification (optional if not used locally) |

> Never commit real credentials. `.env` is ignored by Git.

---

## 🚀 Installation

```bash
# 1. Clone the client repository
git clone https://github.com/asgorfaiyaz/pizzahub.git
cd pizzahub

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Fill in every variable listed above

# 4. Make sure the backend is running and SERVER_URL points to it
```

---

## ▶️ Run locally

```bash
# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start the production build
npm start

# Lint
npm run lint
```

The backend must be reachable at `SERVER_URL` for menu items, orders, overviews, transactions, and subscription endpoints.

---

## 📚 Key learnings

- **Reusable API client:** `serverApiFetch` centralizes API URLs, authentication, response parsing, and error handling for public and protected requests. See [Why `serverApiFetch` is worth having](doc/learnings/reusable-api-client.md).
- **Secure image uploads:** Menu images are validated in the form, uploaded to ImgBB through a server action, and sent to the backend as image URLs without exposing the API key.
- **Framework errors vs. app errors:** `redirect()` throws an internal signal that a `try/catch` can swallow; `unstable_rethrow()` lets Next.js handle it while ordinary API errors still reach your handler. See [Understanding `redirect()` and `unstable_rethrow()`](doc/learnings/unstable-rethrow.md).
- **Blocked users and the proxy:** the edge proxy and server guards must agree on blocked accounts or they create a redirect loop. See [Blocked users and the proxy](doc/learnings/blocking-and-proxy.md).
