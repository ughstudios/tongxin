# TongXin \u540c\u5fc3

TongXin (\u201cOne Heart\u201d) is a minimal social media application built with Ruby on Rails 8.0. The goal is to provide a platform where users can share posts and comments in a simple interface. The project is kept intentionally lightweight so it can be expanded as needed.

## Features

- User authentication with secure passwords
- Post creation, editing, and deletion
- Commenting on posts
- Basic sessions for login/logout
- Liking posts
- Following other users with a personalized feed
- Optional images for posts and avatars for users
- Optional videos with a swipe-up interface
- Trending page showing most liked posts
- Search form for posts
- Personalized recommendations powered by a local LLM
- Homepage shows your feed and AI recommendations together
- Modern UI styled with Tailwind CSS
- Backend now operates API-only, views are handled client-side
- React single page app handles all UI via React Router, while Rails only serves JSON
- Views rendered with rblade templates
- Integrated e-commerce with product links, shopping cart, and direct purchasing
- Advanced content creation tools with image/video editing and AR filters
- Live streaming interface with optional shopping links
- In-app direct messaging and group features
- Brand and advertising tools with verified influencer accounts and partnerships

## Setup

1. Install Ruby 3.2.2 or newer and Bundler.
2. Install Rails 8 (e.g., `gem install rails -v 8.0.0`).
3. Run the setup script to install dependencies and prepare the database.
   The script performs a quick Rails server check and skips production gems
   (via `bundle config set without 'production'`) so libraries like `pg` aren't
   required during development:

   ```bash
   scripts/setup.sh
   ```
4. Run migrations:

   ```bash
   bin/rails db:migrate
   ```

5. Start the server:

   ```bash
   scripts/start_server.sh
   ```
6. Visit `http://localhost:3000` to see the app.
7. Enter your interests as JSON in the *Interests* field when creating or
   editing your account (e.g. `{ "keywords": ["rails", "ruby"] }`).
8. To enable AI recommendations, install [Ollama](https://ollama.com/) and pull
   the `gemma3:4b` model:

   ```bash
   ollama pull gemma3:4b
   ```

  The app connects to `http://localhost:11434` by default. Set `OLLAMA_URL` if
  your server runs elsewhere. If the model can't load, the app falls back to
  simple keyword matching.

## Desktop and Mobile Apps

The core Rails app can be packaged as a desktop app using [Electron](https://electronjs.org).
An iOS version can be achieved with a WebView wrapper. Start by serving the
Rails app and loading it in the Electron or Swift wrapper. Authentication works
the same as the web version. Use the provided script to build the desktop app:

```bash
scripts/package_desktop.sh
```

Launch the compiled version with:

```bash
scripts/start_desktop.sh
```

## Compliance

This project strives to follow applicable regulations and moderation requirements. Content posted by users should comply with local laws and community standards.


