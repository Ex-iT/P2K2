# Coding Guidelines for AI Agents

Welcome! As an AI agent working on the P2K2 project, you are expected to maintain the highest standards of code quality. Please follow these instructions carefully.

## Technology Stack

This project uses the following technologies (from package.json):

### Core Framework

- **Nuxt**: v4.4.2 (Vue 3 SSR/SSG framework)
- **Vue**: v3.5.32
- **Vue Router**: v5.0.4 (explicitly required for Nuxt 4 compatibility)

### UI & Styling

- **@nuxt/ui**: v3.2.0 (Vue 3 component library)
- **Tailwind CSS**: v4.2.2 (utility-first CSS framework)
- **@nuxt/icon**: v1.15.0 (icon integration)
- **@iconify-json/mdi**: v1.2.3 (Material Design Icons)

### Utilities

- **@vueuse/core**: v13.9.0 (Vue Composition Utilities)
- **@vueuse/nuxt**: v13.5.0

### Development & Quality

- **TypeScript**: v5.9.3
- **vue-tsc**: v3.2.6 (Vue TypeScript checker)
- **ESLint**: v9.39.4 (via @nuxt/eslint)
- **Stylelint**: v16.26.1 (CSS linting)

## Library Usage Rules

**DO NOT add additional UI libraries, CSS frameworks, or icon sets** without explicit approval:

- Use `@nuxt/ui` components for UI elements
- Use Tailwind CSS classes for custom styling
- Use `<UIcon />` with `mdi:` prefix for icons

## Linting Requirements

**You MUST run the following command before submitting any changes:**

```bash
pnpm run lint
```

This runs:

1. **ESLint**: `eslint .` - JavaScript/TypeScript/Vue SFCs
2. **Typecheck**: `nuxt typecheck .` - TypeScript validation
3. **Stylelint**: `stylelint **/*.{css,vue}` - CSS validation

### Common Issues

If you encounter errors related to `vue-router/volar/sfc-route-blocks`, ensure `vue-router` is at version **5.x**. This is required for Nuxt 4 + Volar compatibility.

## WebSocket Implementation

The P2K2 app connects to `wss://www.livep2000.nl:443/LSM/websocket` for live P2000 emergency alerts.

### Key Implementation Patterns

1. **Single Connection**: Use one WebSocket connection
2. **Session Handling**: Capture COO/UID from auth response (COM:7) for reconnection
3. **Wait for Auth**: Queue region requests until authentication completes

### Multi-Region Selection

Instead of sending multiple requests, combine region RADs into a single full RAD:

```typescript
// In utils/radixUtils.ts
import { combineRADs } from '~/utils/radixUtils'

// In useSocket.ts - requestRegionData
const combinedRad = combineRADs(maps)
sendWsMessage({ COM: 12, FRQ: false, RAD: combinedRad })
```

**Why this works**: The server expects a full RAD (all 10 keys) to filter properly. Partial RAD returns 0 items.

### Region Selection Logic

- "Alle regios" is **exclusive** - selecting it clears individual region selections
- When nothing is selected, default to "Alle regios"
- Unchecking "Alle regios" defaults to first individual region
- See `components/RegionsMenu.vue` for the dropdown implementation
- See `composables/useSocket.ts` for WebSocket request logic
- See `pages/index.vue` for integration with region selection state

### Reference Files

- `composables/useSocket.ts` - WebSocket connection, session handling, region requests
- `composables/useWebStorage.ts` - LocalStorage persistence
- `components/RegionsMenu.vue` - Region selection dropdown (v-model)
- `pages/index.vue` - Main page, connects socket, loads/saves settings
- `config.ts` - Region definitions (REGIONS array)
- `utils/radixUtils.ts` - RAD binary conversion and combining
- `WEBSOCKET.md` - Detailed protocol documentation

### Important Implementation Details

1. **Session cookies**: Save COO and UID from auth response, include in handshake on reconnect
2. **Auth timing**: Wait for COM:7 before sending data requests
3. **Full RAD required**: All 10 keys must be present in RAD object
4. **FRQ=false always**: Never use FRQ=true with a RAD - it ignores the filter

## Development

Start the development server:

```bash
pnpm dev
```

- Access at `http://localhost:3000`
- Hot Module Replacement (HMR) enabled

## Pull Request Process

1. Implement your changes
2. Run `pnpm run lint`
3. Fix any reported issues
4. Verify `nuxt typecheck` passes
5. Explain changes clearly

Stay agile. Stay precise.
