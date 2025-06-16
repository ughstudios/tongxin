# TongXin \u540c\u5fc3

TongXin (\u201cOne Heart\u201d) is a minimal social media application built with Ruby on Rails 8.0. The goal is to provide a platform where users can share posts and comments in a simple interface. The project is kept intentionally lightweight so it can be expanded as needed.

## Features

- User authentication with secure passwords
- Post creation, editing, and deletion
- Commenting on posts
- Like system for posts
- Follow other users
- Optional images on posts
- Optional avatars for users
- Personalized feed from followed users
- Trending posts ranked by likes
- Basic sessions for login/logout
- Modern UI styled with Tailwind CSS
- Views rendered with rblade templates

## Setup

1. Install Ruby 3.2.2 or newer and Bundler.
2. Install Rails 8 (e.g., `gem install rails -v 8.0.0`).
3. Run the setup script to install dependencies and prepare the database.
   The script skips production gems (using `bundle config set without 'production'`)
   so libraries like `pg` aren't required during development:

   ```bash
   scripts/setup.sh
   ```
4. Start the server:

   ```bash
   scripts/start_server.sh
   ```
5. Visit `http://localhost:3000` to see the app.
   Use the navigation links for **Feed** and **Trending** to explore posts.

## Compliance

This project strives to follow applicable regulations and moderation requirements. Content posted by users should comply with local laws and community standards.


## Automation

Pull requests targeting `main` are automatically approved and merged using GitHub Actions. The workflow in `.github/workflows/auto-approve.yml` approves the request and squashes the commits once auto-merge is enabled.
