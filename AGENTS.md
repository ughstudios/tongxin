# AGENT Instructions

This repository is a Rails 8.0 project.

## Development Environment

- The project supports Ruby **3.2.2 or newer**. Ensure compatibility with
  **Ruby 3.4.4 (2025-05-14 revision a38531fd3f) +PRISM [arm64-darwin24]**.
- `.ruby-version` currently specifies Ruby 3.2.2. Bundler allows newer versions.
- Keep code in standard Ruby style (two-space indentation, no trailing spaces).

## Contributing

1. After making changes, run the setup script to install dependencies:

   ```bash
   scripts/setup.sh
   ```

2. Prepare the database:

   ```bash
   bin/rails db:migrate
   bin/rails db:setup
   ```

3. Start the server and verify the homepage responds:

   ```bash
   bin/rails s -d
   curl -I http://localhost:3000
   pkill -f puma
   ```

   If any command fails due to missing dependencies or other issues,
   mention it in the Testing section.
4. Commit with clear messages.
5. Cite modified lines in PR summaries.
