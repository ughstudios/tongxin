# TongXin \u540c\u5fc3

TongXin (\u201cOne Heart\u201d) is a minimal social media application built with Ruby on Rails 8.0. The goal is to provide a platform where users can share posts and comments in a simple interface. The project is kept intentionally lightweight so it can be expanded as needed.

## Features

- User authentication with secure passwords
- Post creation, editing, and deletion
- Commenting on posts
- Basic sessions for login/logout
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
4. Start the server:

   ```bash
   scripts/start_server.sh
   ```
5. Visit `http://localhost:3000` to see the app.
6. To use recommendations, install a local LLM such as `llama_cpp` and set
   `LLM_MODEL_PATH` to the location of your model file. If the LLM is
   unavailable, a simple keyword matcher will be used instead.

User interest data is stored as JSON in the `preferences` field. You can edit
this data on the sign-up or account edit pages, for example:

```json
{"keywords": ["rails", "ruby"]}
```

## Compliance

This project strives to follow applicable regulations and moderation requirements. Content posted by users should comply with local laws and community standards.


