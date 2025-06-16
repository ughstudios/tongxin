# AGENT Instructions

This repository is a Rails 8.0 project.

## Development Environment

- The project supports Ruby **3.2.2 or newer**. Ensure compatibility with
  **Ruby 3.4.4 (2025-05-14 revision a38531fd3f) +PRISM [arm64-darwin24]**.
- `.ruby-version` currently specifies Ruby 3.2.2. Bundler allows newer versions.
- Keep code in standard Ruby style (two-space indentation, no trailing spaces).

## Contributing

1. After making changes, run the test script to install dependencies,
   migrate, seed the database, and verify the homepage in the Rails test
   environment. The script starts the server in the background so you can
   continue working while it checks the app:

   ```bash
   scripts/test_homepage.sh
   ```

   If any command fails due to missing dependencies or other issues,
   mention it in the Testing section.
2. Commit with clear messages.
3. Cite modified lines in PR summaries.
