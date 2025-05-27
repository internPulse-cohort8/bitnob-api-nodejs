# Bitnob Integration Nodejs

This project is a Node.js backend API built to integrate with the Bitnob API as part of the InternPulse Cohort 8 program. It simulates the backend infrastructure of a fintech product (e.g., crypto wallet, savings app, transaction tracker) by providing essential crypto-related features.

## Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/internPulse-cohort8/bitnob-api-nodejs.git
   cd bitnob-api-nodejs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file :
   ```bash
   touch .env # echo. > .env for windows

   ```

4. Fill in the required environment variables in `.env`.

## Git Workflow

We follow a two-branch workflow:

- `main`: Production branch (protected)
- `dev`: Development branch (protected). Always pull from dev

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
   ### example ofGood commit messages:
   ```
   feat: add user authentication endpoint
   fix: resolve payment processing timeout issue
   docs: update API documentation for webhook handlers
   refactor: simplify database connection logic
   test: add unit tests for transaction service
   ci: update Node.js version in GitHub Actions
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
