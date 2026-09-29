# DMBA Mobile — web wireframe

A runnable browser translation of the DMBA member mobile app's UI. The app is
React Native / Expo styled with NativeWind (Tailwind classes); this is Vite +
React + Tailwind v3 inside a 393×852 iPhone frame. It has no data layer, no
auth and no API calls: every screen renders fictitious placeholder data, and
every loading, empty and error state is reachable from the URL. The UI source it ports from is `../dmba-mobile-ui-extract/`.

## Run

```bash
npm install && npm run dev      # http://localhost:5173
npm run build                   # tsc --noEmit && vite build
npm run preview                 # serve dist/
node scripts/smoke.mjs 5173     # with the dev server running: every route answers 200 with the app shell
```

Dependencies are exactly `react`, `react-dom`, `react-router-dom`, `lucide-react`,
plus the build tools (`vite`, `@vitejs/plugin-react`, `typescript`,
`tailwindcss` v3, `postcss`, `autoprefixer`, `@types/react`, `@types/react-dom`).
Add nothing else.

## Layout

| Path | What it is |
|---|---|
| `src/shared/theme/tokens.js` (+ `.d.ts`) | Copied **verbatim** from the app: every colour and the font families. `tailwind.config.js` requires it. A small Vite transform serves its `module.exports` line as `export {…}`; the file on disk is untouched. |
| `src/shared/theme/{colors,gradients,withAlpha}.ts` | Copied from the app. `gradientCss(tuple, angle?)` in `gradients.ts` turns a gradient tuple into a CSS `linear-gradient(…)`. |
| `src/shared/i18n/en.json` | Copied verbatim. `index.ts` provides `t()` and `useTranslation()` (dotted keys, `{{name}}`, `_one`/`_other` plurals, missing key → the key itself). |
| `src/shared/icons.tsx` | `<Icon name="chevron-forward" size color />` — Ionicons names mapped to lucide. Unknown names render `Circle`. |
| `src/shared/components/` | Every design-system primitive, same file names, exports and props as the app. The `*Classes.ts` builders are copied as is. |
| `src/shared/layout/` | `PhoneFrame`, `TabBar`, `TabsLayout`, `ModalSheet`, `StackScreen`, `Placeholder`, `NotFound`. |
| `src/routes.json`, `src/routes.tsx` | The route list (path, title, presentation, a sample URL) and the router. |
| `public/fonts/`, `public/images/` | Oxygen Regular + Bold (SIL OFL) and the header logo. |

The `@/` import alias resolves from the project root, as in the app, so
`@/src/shared/components/Card` works unchanged.

## Routes

Presentation follows the app's root stack: **tab** routes get the AppHeader and
TabBar; **push** routes are full screens that draw their own `ScreenHeader`;
**modal** routes open in a page sheet with a title and Close; **formSheet** is
the AI advisor sheet; **bare** routes have no chrome.

| Presentation | Routes |
|---|---|
| tab | `/` (Home), `/benefits`, `/activity`, `/search` (Find Care), `/profile` |
| bare | `/login`, `/verify` |
| modal | `/id-card`, `/messages/compose`, `/submit-claim`, `/spending-claim`, `/substantiate`, `/benefit-cards`, `/eligibility-scanner` |
| formSheet | `/chat/assistant` |
| push | `/claim/:id`, `/prior-auth/:id`, `/provider/:npi`, `/facility/:id`, `/search/map`, `/medication/:name`, `/messages`, `/messages/:threadId`, `/messages/:threadId/attachment/:attachmentId`, `/chat/:conversationId`, `/account/:type`, `/spending-activity`, `/receipt/:fileKey`, `/article/:slug`, `/dashboard/customize`, `/contact`, `/settings/privacy`, `/settings/notifications`, `/settings/help`, `/settings/change-password`, `/settings/family-permissions`, `/settings/sign-in-verification`, `*` (not found) |

**Where screens are registered.** Each feature slice registers its screens in
its own file under `src/screens/` (`home`, `benefits`, `findcare`, `activity`,
`profile`, `messaging`, `money`), mapping a route path to an element. Feature code
lives under `src/features/<feature>/`, mirroring the extract file for file.

## Things to try

| URL | Shows |
|---|---|
| `/login?step=mfa-select`, `?step=mfa-code`, `?state=error` | Sign-in and its MFA steps |
| `/` , `/?state=loading`, `/?accounts=error` | Home dashboard, loading, vendor-outage cards |
| `/benefits?tab=coverage&sub=pharmacy` | Coverage › Pharmacy (type two letters to see medication results) |
| `/benefits?tab=navigation`, `?tab=estimateCosts` | Care Navigation and Estimate Costs |
| `/activity`, `/activity?tab=preauth`, `/activity?tab=hsa-fsa` | Claims, preauthorizations, spending accounts |
| `/claim/denied`, `/prior-auth/denied` | Denied claim and denied preauthorization panels |
| `/submit-claim`, `/spending-claim` | The two claim wizards, stepped with the real buttons |
| `/search?state=results&tab=facilities` | Find Care results |
| `/messages`, `/messages?tab=advisor`, `/messages/thread-scan` | Inbox, advisor history, blocked/pending attachments |
| `/chat/assistant`, `/chat/new` | AI advisor sheet and a new conversation |
| `/account/hsa`, `/eligibility-scanner`, `/benefit-cards` | Spending-account detail and tools |
| `/profile?tab=settings`, `/settings/family-permissions?view=dependent`, `/id-card` | Settings, family permissions, ID card |

Most screens also accept `?state=loading`, `?state=empty` and `?state=error`.

## Translation rules

| React Native | Web |
|---|---|
| `<View className="…">` | `<div className="…">` — classes copied exactly |
| `<Text>` | `<span>` / `<p>`; `accessibilityRole="header"` → `<h2>` |
| `<Pressable>`, `<TouchableOpacity>` | `<button type="button">`, same `className`; `onPress` → `onClick` |
| `<ScrollView>`, `<FlatList>` | `ScreenScrollView` or a scrolling div / mapped list |
| `<Ionicons name="x">` | `<Icon name="x">` from `src/shared/icons.tsx` |
| `<LinearGradient colors={t}>` | `style={{ background: gradientCss(t) }}` |
| `accessibilityLabel` / `accessibilityHint` | `aria-label` / `title` or `aria-description` |
| `style={{ paddingHorizontal: 16 }}` | the CSS equivalent (`paddingLeft`/`paddingRight`) |
| `useSafeAreaInsets()` | top 0 (the frame draws the 59px status bar), bottom 34 |
| `t("key")`, `useTranslation()` | unchanged, from `@/src/shared/i18n` |
| `router.push(x)` / `router.back()` | `useNavigate()(x)` / `navigate(-1)` |
| hooks from `api/`, `hooks/`, stores | placeholder data in the shape of the feature's `types.ts` |

**Layout defaults.** Inside the phone screen, every `div`, `button`, `a`, `label`,
`nav`, `section`, `header`, `footer`, `main`, `ul` and `li` gets React Native's
defaults: `display:flex; flex-direction:column; position:relative; flex-shrink:0`
(`src/index.css`, zero specificity). NativeWind class strings therefore lay out as
they do on the phone, and any Tailwind class still overrides the default.
`<span>` stays inline. Use it for text.

## Placeholder data rules

Sample data is generic and fictitious, e.g. "Jordan Avery". Never use a nine-digit
id starting `1002345`, a string starting `00u`, an `@example.invalid` email, or a
`555-01xx` phone number. Use no real people and no URLs to DMBA environments. The
only phone numbers allowed are the ones already in `en.json`.

## Fonts

The app uses Oxygen only where a component opts in with `font-sans` /
`font-sans-bold` (the typography primitives and a few screens). Everything else
renders in the phone's system font, SF Pro on iOS. The wireframe does the same:
the phone screen defaults to the Apple system font stack, so on a Mac it matches
the phone; on Windows it falls back to the OS UI font.

## Known differences from the app

- All names, ids, amounts, dates, providers and coverage rows are placeholders.
  Coverage and advisor text is deliberately generic and states no real DMBA
  plan figures.
- Images from the content system (article heroes) are grey gradient blocks; the
  ID card is drawn in HTML; maps and the camera are static stand-ins.
- The header's unread badge shows a fixed 2.
- Sheets dim an empty backdrop; the previous screen is not kept mounted behind them.
- Swipe rows have no gesture: a small "⋯" button at the row's bottom-right reveals the actions.
- Native pickers, alerts and action sheets are browser equivalents (date input,
  `window.confirm`, a small overlay).
- Helpers that the UI extract does not include (data hooks, formatters,
  validation) are small local stand-ins inside each feature.
- Links out of the app, downloads, calls and shares are inert.

## Using this in Figma Make

1. Start with `src/shared/theme/tokens.js`, `tailwind.config.js` and `src/index.css`
   (tokens, fonts, React Native layout defaults).
2. Then `src/shared/components/` and `src/shared/layout/` (primitives, phone frame,
   tab bar, sheets).
3. Then one screen, e.g. `src/features/dashboard/` with `src/screens/home.tsx`,
   and compare it with this running wireframe before going wider.
