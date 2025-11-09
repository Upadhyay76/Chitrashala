# Chitrashala

Chitrashala is art gallary showcase web application built with the T3 Stack.

## Getting Started

To get started with Chitrashala, follow these steps:

### 1. Clone the repository

```bash
git clone <your-fork-repository-url>
cd chitrashala
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up your environment variables

Create a `.env` file in the root of your project and add the following:

```dotenv
# DATABASE_URL: Your PostgreSQL connection string.
# Example: postgresql://user:password@host:port/database
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication
# You can generate a strong secret using `openssl rand -base64 32`
BETTER_AUTH_SECRET="<YOUR_BETTER_AUTH_SECRET>"

# GitHub OAuth credentials
BETTER_AUTH_GITHUB_CLIENT_ID="<YOUR_GITHUB_CLIENT_ID>"
BETTER_AUTH_GITHUB_CLIENT_SECRET="<YOUR_GITHUB_CLIENT_SECRET>"

# Google OAuth credentials (if applicable)
GOOGLE_CLIENT_ID="<YOUR_GOOGLE_CLIENT_ID>"
GOOGLE_CLIENT_SECRET="<YOUR_GOOGLE_CLIENT_SECRET>"

# Public URL for the application (for production)
# Example: NEXT_PUBLIC_APP_URL="https://chitrashala.com"
# For local development:
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**How to get your OAuth credentials:**

*   **GitHub:**
    1.  Go to your GitHub Developer settings: [https://github.com/settings/developers](https://github.com/settings/developers)
    2.  Click on "OAuth Apps" or "New OAuth App".
    3.  Fill in the application details.
    4.  For "Homepage URL", use `http://localhost:3000` for local development.
    5.  For "Authorization callback URL", use `http://localhost:3000/api/auth/callback/github` for local development.
    6.  Generate a new client secret and copy the Client ID and Client Secret into your `.env` file.

*   **Google (if applicable):
    1.  Go to the Google Cloud Console: [https://console.cloud.google.com/](https://console.cloud.google.com/)
    2.  Create a new project or select an existing one.
    3.  Navigate to "APIs & Services" > "Credentials".
    4.  Click "Create Credentials" > "OAuth client ID".
    5.  Select "Web application" as the application type.
    6.  Add `http://localhost:3000` to "Authorized JavaScript origins".
    7.  Add `http://localhost:3000/api/auth/callback/google` to "Authorized redirect URIs".
    8.  Copy the Client ID and Client Secret into your `.env` file.

### 4. Database Setup

Chitrashala uses Drizzle ORM for database interactions.

*   **Generate migrations:**
    ```bash
    pnpm db:generate
    ```
*   **Push schema to the database:**
    ```bash
    pnpm db:push
    ```
*   **Run migrations (if you have existing migrations):**
    ```bash
    pnpm db:migrate
    ```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Available Scripts

In the project directory, you can run:

*   `pnpm dev`: Runs the app in development mode with `--turbo`.
*   `pnpm build`: Builds the application for production.
*   `pnpm start`: Starts a production Next.js server.
*   `pnpm preview`: Builds and then starts a production Next.js server.
*   `pnpm typecheck`: Checks TypeScript types.
*   `pnpm check`: Runs Biome checks on the codebase.
*   `pnpm check:write`: Runs Biome checks and automatically fixes issues.
*   `pnpm check:unsafe`: Runs Biome checks with `--unsafe` fixes.
*   `pnpm db:generate`: Generates Drizzle migrations.
*   `pnpm db:migrate`: Applies Drizzle migrations to the database.
*   `pnpm db:push`: Pushes the Drizzle schema to the database (for schema synchronization, often used in development).
*   `pnpm db:studio`: Opens Drizzle Studio for database visualization.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

*   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
*   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
*   [T3 Stack Documentation](https://create.t3.gg/) - learn about the T3 Stack.
*   [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview) - learn about Drizzle ORM.
*   [Better Auth Documentation](https://github.com/aliimam/better-auth) - learn about Better Auth.
