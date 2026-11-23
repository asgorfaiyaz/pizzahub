# 🍕 PizzaHub
 
**Discover local pizza shops, browse real menus, and order food that arrives hot.**
 
PizzaHub is a full-stack, multi-vendor pizza ordering platform. Customers explore neighborhood kitchens and place orders, vendors manage their menus and incoming orders, and admins moderate the platform. It features role-based dashboards, Stripe payments, and a responsive, animated UI with dark mode.
 
---
 
## 🔗 Links
 
| Resource          | Link                                        |
| ----------------- | ------------------------------------------- |
| Live website      | https://pizzahub-asgorfaiyaz.vercel.app     |
| Client repository | https://github.com/asgorfaiyaz/pizzahub    |
| Server repository | https://github.com/asgorfaiyaz/pizzahub-api |
 
---
 
## ⭐ Key Highlights
 
- **Role-based authentication & authorization:** Better Auth (email/password + Google) with `customer`, `vendor`, and `admin` roles, enforced at the edge proxy, in layout guards, and in backend middleware (`requireVendor`, `requireAdmin`).
- **Secure Stripe webhooks:** Server-side Checkout sessions with HMAC-SHA256 signature verification on the raw payload and idempotency checks, so upgrades happen only through verified webhooks, never through frontend trust.
- **Advanced server-side search, filtering, sorting & pagination:** Case-insensitive search, category/location/status filters, sorting, and pagination, all handled on the server with Zod-validated query parameters.
- **MongoDB aggregation pipelines:** Heavy use of `$match`, `$lookup`, `$unwind`, `$project`, `$sort`, `$skip`/`$limit`, and more to join menu items with vendor profiles and compute dashboard stats efficiently in a single query.
---
 
## ✨ Features
 
**Everyone**
- Homepage with featured items and category browsing
- Menu browsing with live search, filters, sorting, and pagination
- Item details with image gallery, vendor info, and related items
- Custom 404, unauthorized, forbidden, and error pages
- Dark mode and responsive design
**Customers**
- Overview with order statistics
- Order history, delivery details, and cancellation of pending orders
- Profile settings (name and avatar)
**Vendors**
- Overview with live menu, order, and subscription stats
- Menu management: create, edit, delete, availability, image uploads (ImgBB)
- Accept or reject customer orders
- Free plan (3 active items) with Stripe Checkout upgrade to Premium
- Editable restaurant info (location, hours, phone)
**Admins**
- Platform overview: users, vendors, customers, items, transactions
- User management: search, role filter, block/unblock with instant session revocation
- Menu moderation: approve, reject, deactivate, delete
- Read-only transaction ledger
---
 
## 🛠 Technology Stack
 
### Client (Next.js)
 
| Area               | Packages                                                                 |
| ------------------ | ------------------------------------------------------------------------ |
| Framework          | `next`, `react`, `react-dom`                                             |
| Language           | `typescript`                                                             |
| Styling            | `tailwindcss`, `tw-animate-css`, `class-variance-authority`              |
| UI components      | `shadcn`, `@base-ui/react`, `lucide-react`, `react-icons`, `next-themes` |
| Animation          | `motion`                                                                 |
| Forms & validation | `react-hook-form`, `zod`, `@hookform/resolvers`                          |
| Auth & database    | `better-auth`, `mongodb`                                                 |
| Notifications      | `sonner`                                                                 |
| Tooling            | `eslint`, `eslint-config-next`, `babel-plugin-react-compiler`            |
 
### Server (Express)
 
| Area        | Packages / Tools                   |
| ----------- | ---------------------------------- |
| Runtime     | Node.js (ES Modules)               |
| Language    | `typescript`                       |
| Framework   | `express`                          |
| Database    | `mongodb` (native driver)          |
| Validation  | `zod`                              |
| Payments    | `stripe`                           |
| Security    | `cors`                             |
| Environment | `dotenv`                           |
| Dev tooling | `tsx`                              |
 
---
 
## 🚀 Installation
 
**Prerequisites:** Node.js v18+, a MongoDB instance (local or Atlas), and optionally the [Stripe CLI](https://docs.stripe.com/stripe-cli) for local webhooks.
 
### 1. Server
 
```bash
git clone https://github.com/asgorfaiyaz/pizzahub-api.git
cd pizzahub-api
npm install
cp .env.example .env   # fill in the variables below
```
 
### 2. Client
 
```bash
git clone https://github.com/asgorfaiyaz/pizzahub.git
cd pizzahub
npm install
cp .env.example .env   # fill in the variables below
```
 
---
 
## ⚙️ Environment Variables
 
> Never commit real credentials. `.env` is ignored by Git.
 
### Client (`.env`)
 
| Variable                             | Used for                                          |
| ------------------------------------ | ------------------------------------------------- |
| `MONGODB_URI`                        | MongoDB connection for Better Auth                |
| `BETTER_AUTH_URL`                    | Public base URL for Better Auth                   |
| `BETTER_AUTH_SECRET`                 | Secret for signing auth tokens/cookies            |
| `GOOGLE_CLIENT_ID`                   | Google OAuth client ID                            |
| `GOOGLE_CLIENT_SECRET`               | Google OAuth client secret                        |
| `SERVER_URL`                         | Backend API base URL (e.g. `http://localhost:5000/api/v1`) |
| `IMGBB_API_KEY`                      | Image upload API key                              |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key                            |
| `STRIPE_SECRET_KEY`                  | Stripe secret key                                 |
| `STRIPE_WEBHOOK_SECRET`              | Stripe webhook signature secret (optional locally) |
 
### Server (`.env`)
 
| Variable                | Used for                                      |
| ----------------------- | --------------------------------------------- |
| `PORT`                  | Port the Express server listens on (`5000`)   |
| `MONGODB_URI`           | MongoDB connection string                     |
| `MONGODB_DB`            | MongoDB database name (`pizzahub`)            |
| `CLIENT_URL`            | Frontend URL for CORS and redirects           |
| `STRIPE_SECRET_KEY`     | Stripe secret key                             |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`)   |
 
---
 
## ▶️ Run Locally
 
Start the **server first**, then the client.
 
### Server (http://localhost:5000)
 
```bash
npm run dev          # development with hot reload
npm run build        # compile TypeScript
npm start            # run the production build
```
 
Health check: `curl http://localhost:5000/health`
 
To test Stripe webhooks locally:
 
```bash
stripe login
stripe listen --forward-to localhost:5000/api/v1/webhooks/stripe
```
 
Copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET`.
 
### Client (http://localhost:3000)
 
```bash
npm run dev          # development server
npm run build        # production build
npm start            # run the production build
npm run lint         # lint
```
 
The backend must be reachable at `SERVER_URL` for menu items, orders, dashboards, and subscriptions to work.
 
---
 
## 📡 API Overview
 
| Role     | Example endpoints                                                                 |
| -------- | --------------------------------------------------------------------------------- |
| Public   | `GET /menu-items`, `GET /menu-items/:id`, `GET /menu-items/locations`              |
| Customer | `GET/POST /customers/orders`, `PATCH /customers/orders/:id/cancel`                 |
| Vendor   | `/vendors/menu-items`, `/vendors/orders`, `/vendors/subscription`                  |
| Admin    | `/admin/users`, `/admin/menu-items`, `/admin/transactions`                         |
| Webhook  | `POST /webhooks/stripe` (signature verified)                                       |
 
All routes are prefixed with `/api/v1`.
 
