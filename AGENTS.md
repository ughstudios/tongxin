# AGENT Instructions

This repository is a Next.js project. The former Rails backend has been
removed in favor of API routes under `pages/api`.

## Development Environment

- Install Node.js **18 or newer**.
- Keep code formatted with standard JavaScript style (two-space indentation,
  no trailing spaces).

## Contributing

1. After making changes, install dependencies and start the dev server from the
   project root to verify the homepage:

   ```bash
   npm install
   npm run dev &
   curl -I http://localhost:3000
   pkill -f "next dev"
   ```

Final
1. If any command fails due to missing dependencies or other issues, mention it
in the Testing section.
2. Commit with clear messages.
3. Cite modified lines in PR summaries.
