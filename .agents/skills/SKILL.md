# Coding Guidelines for AI Agents

Welcome! As an AI agent working on the P2K2 project, you are expected to maintain the highest standards of code quality. Please follow these instructions carefully.

## Technology Stack & Library Usage

This project follows a strict set of core technologies. **DO NOT add additional UI libraries, CSS frameworks, or icon sets** without explicit approval:

- **UI Framework**: [Nuxt UI v3](https://ui3.nuxt.dev/) (Vue 3 + Tailwind CSS).
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/docs/v4-beta). Use Tailwind classes for all styling.
- **Icons**: [@nuxt/icon](https://nuxt.com/modules/icon). Always use the `<UIcon />` component with the `mdi:` prefix (from the Material Design Icons collection).

## Linting Requirements

The project uses strict linting and formatting rules to ensure consistency and stability. **You MUST run the following command before submitting any changes:**

```bash
pnpm run lint
```

This command runs:

- **ESLint**: For Javascript/Typescript logic and Vue SFCs.
- **Typecheck**: Via `nuxt typecheck` to ensure type safety.
- **Stylelint**: For CSS and Vue styles.

### Infrastructure Note

If you encounter errors related to `vue-router/volar/sfc-route-blocks`, ensure that `vue-router` is at version **5.x**. This dependency alignment is required for compatibility with the Nuxt 4 setup and Volar routing integration.

## Development and Verification

When making UI changes or working on core application logic, you should verify your work using the development server:

```bash
pnpm dev
```

- **Browser Testing**: Use the browser tool to navigate to the local URL (standard Nuxt port is 3000) to confirm that components render correctly and interactions behave as expected.
- **Hot Reloading**: The server supports HMR, so you can keep it running while you iterate on code.

## Pull Request Process

1. Implement your changes.
2. Run `pnpm run lint`.
3. Fix any reported issues.
4. Verify that `nuxt typecheck` passes (included in lint).
5. Explain your changes clearly in your response.

Stay agile. Stay precise.
