# Contributing to rmsn-link

Thank you for your interest in contributing to **rmsn-link**! This project is a local-first, serverless link shortener built with Astro, Lucide Icons, and Nginx/Docker.

Follow this guide to set up your environment, write/run tests, and submit contributions.

---

## Development Setup

### Prerequisites
- **Node.js** (v22 or later recommended)
- **npm** (v10 or later)
- **Docker & Docker Compose** (optional, for containerization tests)

### Local installation
1. Clone the repository:
   ```bash
   git clone https://github.com/rafifmsn/rmsn-link.git
   cd rmsn-link
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your local environment configuration:
   ```bash
   cp .env.example .env
   ```
   Modify `.env` variables if you want to customize your local dev server settings.

4. Start the Astro development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:4321` in your browser.

---

## Testing

To ensure that the application logic remains secure and correct, we write unit tests for the core utilities (such as token obfuscation, username sanitization, and URL parsing/normalization).

- **Test Runner**: [Vitest](https://vitest.dev/)
- **Test Command**:
  ```bash
  npm run test
  ```
  This runs all test files matching `*.test.ts`.

Always run tests before opening a Pull Request.

---

## Docker Deployment Testing

You can test build-time brand name configurations inside containerized deployments using Docker Compose:

1. Build the image with custom arguments:
   ```bash
   docker compose build --build-arg PUBLIC_BRAND_NAME="My Custom Brand"
   ```

2. Run the container:
   ```bash
   docker compose up -d
   ```

3. Shut down the container when finished:
   ```bash
   docker compose down
   ```

---

## Submitting a Pull Request

1. **Create a Branch**: Create a descriptive feature branch from `main`.
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Commit Message**: Use clean, descriptive commit messages.
3. **Verify Code Quality**:
   - Ensure all unit tests pass: `npm run test`
   - Ensure the static build compiles: `npm run build`
4. **Push & Open PR**: Push to your fork and create a Pull Request on GitHub. Use the provided Pull Request template to check off all requirements.
