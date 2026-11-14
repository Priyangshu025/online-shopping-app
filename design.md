# ShopNova Design Guide

A guide to making ShopNova feel clean, calm and trustworthy, in the spirit of premium retail sites like Apple India, while keeping its own identity. It is written against your actual code (React 18 + Vite + Tailwind 3 + lucide-react, Express backend), so every step points at real files.

---

## 1. Goal and Rules

**Goal:** a store that looks quiet and confident, loads fast, and is honest about security.

**Borrow the ideas:** lots of white space, big short headlines, one accent color, soft grey sections, rounded cards, subtle motion.

**Do not copy:** Apple's logo, photos, wording, icons, exact page layouts, or anything that suggests ShopNova is Apple. Use your own brand, copy and images.

Design principles to check every change against:

| Principle | In practice |
|---|---|
| Space is the design | Fewer elements per screen, bigger gaps |
| One accent color | Blue only for actions and links |
| Product first | Big, clean product images; UI stays out of the way |
| Two font weights | 400 for text, 600 for headings and prices |
| Honest trust cues | Only show security or compliance claims that are true |

---

## 2. Audit: What the Code Does Today

Counts are from `frontend/src`.

| What I found | Where | Why it fights the clean look |
|---|---|---|
| `font-black` x29, `font-extrabold` x14 | Everywhere | Very heavy type feels loud; use 600 |
| `rounded-3xl` x25, `rounded-2xl` x49 | Cards, hero, login | Too round and inconsistent; use one card radius |
| `bg-gradient-*` and blurred glow circles | Hero, promo banner, logo text | Reads as "template"; use flat colors |
| `text-[10px]` / `text-[11px]` x55, `text-xs` inputs | Badges, forms, login | Hard to read; inputs under 16px make iOS Safari zoom in |
| rose x58, emerald x40, amber x43, indigo x22, purple x4 | Badges, stock, icons | Too many colors; keep one accent plus success and danger |
| Dark hero with image overlay | `HomePage.jsx` L43-99 | Heavy; a light centered hero is calmer |
| Dark announcement bar with emoji | `Navbar.jsx` L40-42 | Adds noise on every page |
| 80px navbar with search bar, gradient logo, Log In and Sign Up | `Navbar.jsx` | Compact 56px bar with centered links is cleaner |
| Dark `bg-slate-900` footer, four differently colored icon tiles | `Footer.jsx` | Use a light grey footer with monochrome icons |
| Product images use `object-cover` on grey | `ProductCard.jsx` L22-30 | Crops products; use `object-contain` with padding |
| Quick View overlay, category text, brand text, rating, stock text and a border-top row on each card | `ProductCard.jsx` | Too many elements per card |
| Icon-only buttons with only `title` | Navbar, ProductCard | Add `aria-label` for screen readers |
| Font loaded is Plus Jakarta Sans, comment says Inter | `index.html` | Pick one (this guide uses Inter) |

Good things already in place that you should keep: Tailwind, `clsx` and `tailwind-merge` (perfect for a Button component), `lucide-react` (one consistent icon set), `₹` formatting with `toLocaleString('en-IN')`, lazy-loaded images, skeleton loaders on the home page.

---

## 3. Design Tokens (Tailwind)

### 3.1 `frontend/tailwind.config.js`

Replace the current `primary` and `brand` colors with semantic tokens:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: { DEFAULT: "#ffffff", alt: "#f5f5f7" },
        ink: { DEFAULT: "#1d1d1f", muted: "#6e6e73" },
        line: "#d2d2d7",
        accent: { DEFAULT: "#0a6cff", hover: "#0058d6", soft: "#eaf2ff" },
        success: "#1a7f37",
        danger: "#d92d20",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: { card: "20px" },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.06)",
        lift: "0 8px 28px rgba(0,0,0,0.10)",
      },
      maxWidth: { page: "1200px" },
    },
  },
  plugins: [],
};
```

Change `accent` to your own brand color if you like. Keep it to one.

### 3.2 `frontend/index.html`

- Replace the Google Fonts link with Inter: `family=Inter:wght@400;500;600;700&display=swap`.
- Change the `<body>` class to `bg-surface text-ink antialiased font-sans` (this removes the inline `font-['Plus_Jakarta_Sans',...]`).
- Remove the Razorpay `<script>` from here (see section 8, it should load only on the checkout page).

### 3.3 `frontend/src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body { @apply bg-surface text-ink min-h-screen antialiased selection:bg-accent selection:text-white; }
  h1 { @apply text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.07]; }
  h2 { @apply text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.1]; }
  h3 { @apply text-lg font-semibold tracking-tight; }
  :focus-visible { @apply outline-2 outline-offset-2 outline-accent; }
}

@layer components {
  .container-page { @apply mx-auto w-full max-w-page px-6 lg:px-10; }
  .section        { @apply py-12 sm:py-24; }
  .input          { @apply h-12 w-full rounded-lg border border-line bg-white px-4 text-base
                           focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/20; }
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

Keep the scrollbar styles if you like them, or simplify them to the neutral `line` color.

### 3.4 Type scale

| Role | Size | Weight |
|---|---|---|
| Hero headline | 36px mobile, 56px desktop | 600 |
| Section title | 28px mobile, 40px desktop | 600 |
| Card title | 17-18px | 600 |
| Body | 16-17px | 400 |
| Caption | 14px (never below 13px) | 400 |
| Price | 18px | 600 |

Never use `text-[10px]` or `text-[11px]`. Inputs are always 16px.

---

## 4. Find-and-Replace Map (do this first)

This converts most of the app in one pass. Do it per file and look at the result.

| Current | Replace with |
|---|---|
| `bg-blue-600`, `hover:bg-blue-700` | `bg-accent`, `hover:bg-accent-hover` |
| `text-blue-600`, `text-blue-700` | `text-accent` |
| `bg-blue-50/100` | `bg-accent-soft` |
| `text-slate-900`, `text-slate-800`, `text-slate-700` | `text-ink` |
| `text-slate-400`, `text-slate-500`, `text-slate-600` | `text-ink-muted` |
| `border-slate-100/200/300` | `border-line` (use `border-line/60` for very light) |
| `bg-slate-50`, `bg-slate-100` | `bg-surface-alt` |
| `font-black`, `font-extrabold` | `font-semibold` |
| `font-bold` on body text | `font-semibold` or `font-medium` |
| `rounded-3xl`, `rounded-2xl` on cards | `rounded-card` |
| `rounded-xl` on buttons | `rounded-full` |
| `shadow-xl`, `shadow-lg`, `shadow-md` | `shadow-card` (hover: `shadow-lift`) |
| `text-[10px]`, `text-[11px]`, `text-xs` | `text-sm` |
| `rose-*`, `amber-*`, `emerald-*` | `danger` / `success` only where the meaning is real (errors, out of stock, in stock); otherwise `ink-muted` |
| `indigo-*`, `purple-*` | remove, use `accent` or neutral |
| `bg-gradient-*`, blur "glow" circles | flat `bg-surface-alt` or `bg-accent` |

---

## 5. Reusable UI Components

Create `frontend/src/components/ui/` and build these first. Pages then stop repeating long class strings. You already have `clsx` and `tailwind-merge`.

**`ui/cn.js`**
```js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...a) => twMerge(clsx(a));
```

**`ui/Button.jsx`**
```jsx
import { cn } from "./cn";

const styles = {
  primary:   "bg-accent text-white hover:bg-accent-hover",
  secondary: "border border-accent text-accent hover:bg-accent-soft hover:text-accent-hover",
  ghost:     "text-accent hover:underline",
};

export default function Button({ variant = "primary", className, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-medium",
        "transition active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
```
Also make a `LinkButton` with the same classes for `<Link>`. Use **one primary button per section.**

**Other small components:** `Section` (wraps `.section` + `.container-page`, with optional `alt` background), `Badge` (one neutral pill style), `Price` (current price, optional struck-through old price, `en-IN` formatting).

---

## 6. File-by-File Changes

Work in this order. Test in the browser after each file.

### 6.1 `Navbar.jsx` (259 lines)

- **Remove the announcement bar** (L39-42), or move it to the home page only as a slim grey strip with no emoji.
- Make the header **56px tall**: `bg-white/80 backdrop-blur-xl border-b border-line/60`.
- Logo: plain wordmark `ShopNova` in `text-ink font-semibold`. Drop the blue square and the gradient text.
- **Center links** from your real categories: Audio, Electronics, Computers, Wearables, Lifestyle (match `categoryVisuals` in `HomePage.jsx`). Style: `text-sm text-ink hover:text-ink-muted`.
- **Search** stays (shopping needs it) but becomes a search icon that opens a full-width search bar below the header, instead of the always-visible pill with its own blue button.
- Right side: search, wishlist, cart (icons only, with `aria-label`), then an account icon. Replace the Log In and Sign Up pair with a single "Sign in" text link when logged out.
- Cart count badge: small `bg-accent` circle. Wishlist badge: same style, and **remove `animate-pulse`**.
- User dropdown: white card, `rounded-card`, `shadow-lift`, neutral hover (`hover:bg-surface-alt`). Admin link in `text-ink`, not indigo.
- Mobile: slide-in panel with 48px-tall links.

### 6.2 `HomePage.jsx` (210 lines)

**Hero (L43-99):** replace with a light, centered hero.
- Background `bg-surface-alt`, no image overlay, no gradient.
- Structure: one headline (max about 8 words), one supporting sentence, two actions (**Shop now** primary, **Browse audio** as text link with `›`).
- Below it, one large product image on a clean background.
- Remove the "Next-Generation E-Commerce Experience" pill and the stats row (100%, 2-Day, 4.9 ★). Only keep stats you can prove.

**Category grid (L101-139):** use calm cards, not dark image tiles with gradients.
- `bg-surface-alt rounded-card`, product-style image centered with padding, name below in `text-ink`, one-line description in `text-ink-muted`.
- Drop the uppercase blue "Collections" eyebrow, or keep it very quiet.

**Featured products (L141-173):** centered section title, 4-column grid, `gap-6`. Remove the lightning icon and "Trending & Handpicked" label. Keep the skeleton loaders but use `bg-surface-alt`.

**Promo banner (L175-203):** the blue-indigo gradient with blur circles goes. Use a plain `bg-surface-alt rounded-card` block with one line of text and a text link, or remove it. The coupon is already shown elsewhere.

Use `<Section>` between blocks, alternating white and `surface-alt`.

### 6.3 `ProductCard.jsx` (136 lines)

Target markup (simplified):

```jsx
<article className="group flex flex-col rounded-card bg-surface-alt p-6 transition duration-200 hover:-translate-y-1 hover:shadow-lift">
  <Link to={`/products/${product._id}`} className="block">
    <div className="aspect-square overflow-hidden rounded-xl bg-white p-4">
      <img src={image} alt={product.name} loading="lazy"
           className="h-full w-full object-contain" />
    </div>
    <p className="mt-4 text-sm text-ink-muted">{product.brand || "ShopNova"}</p>
    <h3 className="mt-1 line-clamp-2 text-lg font-semibold text-ink">{product.name}</h3>
  </Link>

  <div className="mt-auto flex items-end justify-between pt-4">
    <div>
      <Price value={activePrice} old={hasDiscount ? product.price : null} />
      {stockNote}  {/* only show "Only N left" or "Out of stock" */}
    </div>
    <Button aria-label={`Add ${product.name} to cart`} disabled={product.stock <= 0}
            className="px-4 py-2 text-sm">Add</Button>
  </div>
</article>
```

Specific changes:
- **Remove the Quick View overlay** (L52-61). The whole card already links to the product.
- **Remove the category text** and the `border-t` pricing row.
- Image: `object-contain` on a white or light square, with padding. (If your product photos are lifestyle shots from Unsplash, they will look better on the product detail page than in the grid; clean product-on-white images are what make this style work.)
- Rating: show it on the product detail page, or as a single small `4.5 (120)` line in muted text. No amber star fill.
- Discount badge: one neutral pill (`bg-ink text-white` or `bg-accent-soft text-accent-hover`), `text-xs font-semibold`, not rose.
- Stock: show nothing when in stock. Show "Only N left" in `text-ink-muted`, and "Out of stock" in muted text with the button disabled. Remove the green "In Stock" text.
- Wishlist heart: keep, but a small neutral round button with `aria-label`. Filled state uses `text-accent` or `text-danger`, one choice.

### 6.4 `Footer.jsx` (132 lines)

- Background `bg-surface-alt`, text `text-ink-muted`, links `hover:text-ink`. Remove the dark slate theme.
- **Value highlights (L10-51):** move them into a light trust strip above the footer, with monochrome `text-ink-muted` icons (no blue/green/amber/purple tiles).
- Remove the uppercase section headings; use `text-sm font-semibold text-ink`.
- Logo: same plain wordmark as the navbar.
- Bottom bar: copyright and region on the left, payment methods on the right as plain text or real payment logos. The mono grey chips (UPI, Razorpay, Visa) can become a simple text row.
- **Honesty fixes:** see section 8 (compliance claims, fake address and phone, links to `#`).

### 6.5 Forms: `LoginPage.jsx`, `RegisterPage.jsx`, `CheckoutPage.jsx`, `ProfilePage.jsx`

- Use the `.input` class: 48px tall, 16px text, label above in `text-sm text-ink-muted`. The current `py-2.5 text-xs` inputs are about 38px tall with 12px text.
- Card: `bg-white border border-line rounded-card p-8`, no `shadow-xl`.
- Heading: `text-3xl font-semibold`. Remove the blue icon square on top of the login card.
- **Remove the "Instant Demo Sign In" panel** from the login page (L47-68) before going live (see section 8).
- Errors: `text-sm text-danger` under the field, not toast-only.
- Checkout: single column on mobile, order summary in a `surface-alt` card on the right on desktop. Number the steps (Contact, Delivery, Payment, Review). Remove emoji from toasts (`🎉 Order placed successfully!` becomes "Order placed").

### 6.6 `ProductDetailPage.jsx` (452 lines), `CartPage.jsx`, `CartItem.jsx`, `PriceSummary.jsx`

- Detail page: gallery on the left (`object-contain`, thumbnails below), sticky purchase panel on the right. Order: name, price, short text, options, delivery estimate, one **Add to cart** primary button, then a quiet trust row (delivery, returns, warranty).
- Specs as a clean two-column table; reviews below.
- Cart: plain rows with `border-b border-line`, a quantity stepper with a neutral border, and a `surface-alt` summary card. One primary **Checkout** button.
- Apply the find-and-replace map from section 4.

### 6.7 Lower priority

- `ProductsPage.jsx` / `ProductFilters.jsx`: neutral filter chips (`border border-line rounded-full`, active = `bg-ink text-white`).
- `MyOrdersPage.jsx`, `OrderDetailPage.jsx`, `OrderStatusTimeline.jsx`, `WishlistPage.jsx`: tokens only.
- **Admin pages** (`pages/admin/*`, `AdminLayout`, `AdminSidebar`, `StatCard`): leave for last. They are internal, so use the same tokens but there is no need to make them airy.

---

## 7. Motion and Accessibility

**Motion:** 150-300ms, `ease-out`. Use it for hover lift on cards (`hover:-translate-y-1`), button press (`active:scale-[0.98]`), and the navbar blur. No pulsing badges, no bounce, no auto-playing carousels. The reduced-motion rule in `index.css` covers users who ask for less.

**Accessibility checklist**
- Text contrast at least 4.5:1. Measured with these tokens: `ink-muted` on white 5.07, `ink-muted` on `surface-alt` 4.66, white on `accent` 4.56 (all pass, but do not make `ink-muted` or `accent` any lighter). `accent` text on `accent-soft` is only 4.05 and fails, so on a soft blue background use `accent-hover` text instead.
- Every icon-only button gets an `aria-label`.
- Inputs have real `<label>` elements.
- Tap targets are at least 44x44px.
- Visible focus ring on all interactive elements (set globally in `index.css`).
- Product images have meaningful `alt` text.

**Performance:** keep `loading="lazy"` below the fold and add `width`/`height` to images. Serve images as WebP and under about 150KB each. Note that free Render instances sleep when idle, so the first visit can take 30+ seconds; the skeleton loaders help, and a free uptime ping can keep it awake.

---

## 8. Make the "Secure" Look Real

A clean design earns trust, but a "Secure checkout" label on an insecure flow does the opposite. I read the code and these are the issues I found. **Fix these before showing security claims to real customers.**

| # | Finding | Where | Fix |
|---|---|---|---|
| 1 | **Payment is simulated.** The browser invents a payment ID and signature with `Math.random()` and sends them to `/payments/verify`. A real gateway must never be trusted from the browser. (I have not yet read `paymentController.js`; check that it verifies the signature.) | `CheckoutPage.jsx` L95-107 | Use real Razorpay Checkout on the client. On the server, verify the signature (HMAC-SHA256 of `order_id\|payment_id` with your key secret) and only then create the order. Use test keys until this works. |
| 2 | **Demo logins are public.** One-click "Demo Admin" button fills `admin@shopnova.com / admin123`, and the server prints both demo logins on startup. If the seed ran on Render, anyone can sign in as admin. | `LoginPage.jsx` L47-68, `server.js` startup logs | Delete the demo panel and the log lines. Change or remove the seeded admin account in production. |
| 3 | **CORS is open:** `cors({ origin: '*', credentials: true })`. | `backend/server.js` | Set `origin` to your site's URL from an env variable. |
| 4 | **No security headers or rate limiting.** Dependencies are only `cors`, `express`, `jsonwebtoken`, `bcryptjs`, etc. | `backend/server.js`, `backend/package.json` | Add `helmet`, add `express-rate-limit` on `/api/auth` (login/register), and limit request size with `express.json({ limit: "10kb" })`. |
| 5 | **Razorpay script loads on every page.** | `index.html` | Load it only when the checkout page opens. |
| 6 | **Compliance claims and placeholders.** The footer says "Compliant with DPDP Act 2023 & Consumer Protection Rules", legal links point to `#terms`, `#privacy` etc. (nothing there), and the address and phone number look made up. Hero stats ("4.9 ★", "100% Genuine Brands") are also unproven. | `Footer.jsx` L99-117, `HomePage.jsx` L82-97 | Write the real policy pages (Terms, Privacy, Returns, Shipping, Contact) and link them, or remove the claims and placeholders. |
| 7 | **JSON-file store.** `backend/data/users.json`, `orders.json` etc. are tracked in git and act as the fallback database. On Render, files reset on redeploy. | `backend/data/*`, `config/db.js` | Use MongoDB Atlas in production (set `MONGO_URI`). Check that the tracked JSON files hold only seed/demo data, never real customers. |

Worth checking next (I have not read these files): where `AuthContext` stores the JWT (httpOnly cookie is safer than `localStorage`), whether `authMiddleware` protects every admin route, and whether product and order inputs are validated on the server.

**UI cues that are fine once the above is true:** a lock icon and "Secure checkout" by the payment step, accepted payment icons, clear delivery and returns info on product pages, taxes and shipping shown before payment, and an order confirmation with order ID.

---

## 9. Step-by-Step Plan

**Phase 1: Foundation**
1. Update `tailwind.config.js`, `index.html` (Inter, body class) and `index.css` (sections 3.1-3.3).
2. Create `components/ui/` with `cn`, `Button`, `Section`, `Badge`, `Price` (section 5).

**Phase 2: Shared chrome**
3. `Navbar.jsx`, then `Footer.jsx`, using sections 6.1 and 6.4.
4. Check `MainLayout` spacing (footer currently has `mt-20`).

**Phase 3: Storefront**
5. `ProductCard.jsx`, then `HomePage.jsx` (hero, categories, featured, promo).
6. `ProductsPage` + `ProductFilters`, then `ProductDetailPage`.
7. `CartPage`, `CartItem`, `PriceSummary`, then `CheckoutPage`.
8. Login, Register, Profile, Orders, Wishlist.

**Phase 4: Security and polish**
9. Work through the section 8 table (items 1-7).
10. Run the find-and-replace map (section 4) once more across the repo and fix leftovers (`grep -rE "rose-|amber-|indigo-|purple-|font-black|text-\[1" frontend/src`).
11. Accessibility and mobile pass at 375px width; Lighthouse 90+ on Home and Product pages.
12. Remove unused code and colors, deploy to Render, and test on a real phone.

---

## 10. Final Checklist

- [ ] No `font-black`, `font-extrabold`, gradients, glow circles or `text-[1x px]` left
- [ ] Only one accent color, plus `success` and `danger` used with real meaning
- [ ] One card radius (`rounded-card`), one shadow style
- [ ] All inputs are 16px and 48px tall
- [ ] Every icon-only button has an `aria-label`
- [ ] No emoji in the navbar, toasts or headings
- [ ] No Apple logos, photos, text or icons anywhere
- [ ] Demo logins removed; payment verified server-side; CORS restricted
- [ ] Real policy pages exist, or the claims are removed
- [ ] Looks right at 375px, 768px and 1280px

---

## 11. Prompts for an AI Coding Assistant

> "Read `design.md`. Do Phase 1: update `tailwind.config.js`, `index.html` and `index.css`, and create the `components/ui` files. Change nothing else."

> "Using `design.md` section 6.3, rewrite `ProductCard.jsx`. Keep the cart and wishlist logic exactly as it is."

> "Using `design.md` section 6.1, rebuild `Navbar.jsx`. Keep all auth, cart, wishlist and search behavior."

> "Go through `design.md` section 8, item 2, and remove the demo login panel and startup log lines."

Do one component at a time, check it in the browser, and commit after each step so you can roll back easily.
