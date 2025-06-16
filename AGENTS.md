# AGENT Instructions

This repository is a Rails 8.0 project.

## Development Environment

- The project supports Ruby **3.2.2 or newer**. Ensure compatibility with
  **Ruby 3.4.4 (2025-05-14 revision a38531fd3f) +PRISM [arm64-darwin24]**.
- `.ruby-version` currently specifies Ruby 3.2.2. Bundler allows newer versions.
- Keep code in standard Ruby style (two-space indentation, no trailing spaces).

## Contributing

1. After making changes, run `bundle exec rake -T | head` to verify Rake tasks
   load. If the command fails due to missing Ruby versions, mention it in the
   Testing section.
2. Commit with clear messages.
3. Cite modified lines in PR summaries.
