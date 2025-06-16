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
- Trending page showing most liked posts
- Search form for posts
- Personalized recommendations powered by a local LLM
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
4. Run migrations:

   ```bash
   bin/rails db:migrate
   ```

5. Start the server:

   ```bash
   scripts/start_server.sh
   ```
6. Visit `http://localhost:3000` to see the app.
7. To use recommendations, install a local LLM such as `llama_cpp` and set
   `LLM_MODEL_PATH` to the location of your model file.

## Compliance

This project strives to follow applicable regulations and moderation requirements. Content posted by users should comply with local laws and community standards.


