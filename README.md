# TongXin \u540c\u5fc3

TongXin (\u201cOne Heart\u201d) is a minimal social media application built with Ruby on Rails 8.0. The goal is to provide a platform where users can share posts and comments in a simple interface. The project is kept intentionally lightweight so it can be expanded as needed.

## Features

- User authentication with secure passwords
- Post creation, editing, and deletion
- Commenting on posts
- Basic sessions for login/logout

## Setup

1. Install Ruby 3.2.2 or newer and Bundler.
2. Install Rails 8 (e.g., `gem install rails -v 8.0.0`).
3. Run `bundle install` to install dependencies.
4. Create and migrate the database:

   ```bash
   bin/rails db:create db:migrate db:seed
   ```
5. Start the server:

   ```bash
   bin/rails server
   ```
6. Visit `http://localhost:3000` to see the app.

## Compliance

This project strives to follow applicable regulations and moderation requirements. Content posted by users should comply with local laws and community standards.

