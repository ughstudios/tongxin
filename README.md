# TongXin \u540c\u5fc3

TongXin ("One Heart") now runs on [Next.js](https://nextjs.org/) with API routes replacing the old Rails backend. Data is stored in JSON files under `data/`.

## Features

- User registration and login with hashed passwords
- Create, edit and delete posts with optional images and videos
- Comment on posts
- Like posts and view a trending page
- Follow other users and view profiles
- Search posts and see simple AI recommendations
- Modern UI styled with Tailwind CSS
- Homepage mixes your feed and recommendations

## Setup

1. Install Node.js 18 or newer.
2. From the project root install dependencies and start the dev server:

```bash
npm install
npm run dev
```
3. Alternatively run the helper script from the project root:

```bash
./run.sh
```

Visit `http://localhost:3000` to use the app. The homepage shows your feed and recommendations. Additional pages:

- `/feed` - your personalized feed
- `/trending` - trending posts
- `/search` - search posts
- `/posts/[id]` - view a single post with comments
- `/users/[id]` - view a user profile

## Compliance

This project strives to follow applicable regulations and moderation requirements. Content posted by users should comply with local laws and community standards.
