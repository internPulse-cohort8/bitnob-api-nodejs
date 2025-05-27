# Fintech Backend API

A Node.js backend for [your fintech product description] using Bitnob API.

## Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Fill in the required environment variables in `.env`.

## Git Workflow

We follow a two-branch workflow:

- `main`: Production branch (protected)
- `dev`: Development branch (protected)

### Working on a feature:

1. Pull latest changes from `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   ```

2. Create a feature branch:
   ```bash
   git checkout -b feat/your-feature-name
   ```

3. Make your changes and commit:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

4. Push your branch:
   ```bash
   git push origin feat/your-feature-name
   ```

5. Create a Pull Request (PR) from your feature branch to `dev`.

## Running Checks Locally

Before pushing your code or creating a PR, run these checks:

1. Build:
   ```bash
   npm run build
   ```

2. Lint:
   ```bash
   npm run lint
   ```

3. Tests:
   ```bash
   npm run test
   ```

## CI/CD Overview

Our CI/CD pipeline runs on GitHub Actions:

- **CI Pipeline**:
  - Runs on every PR to `dev` or `main`
  - Runs build, lint, and tests
  - All checks must pass before merge

- **CD Pipeline**:
  - Runs on push to `main`
  - Automatically deploys to Render
