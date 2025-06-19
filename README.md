# TongXin \u540c\u5fc3

TongXin ("One Heart") now runs on [Next.js](https://nextjs.org/) with API routes replacing the old Rails backend. Data is stored in an SQLite database under `data/test.db`.

## Features

- User registration and login with hashed passwords
- Create, edit and delete posts with optional images and videos
- Embed YouTube or Bilibili videos directly in posts
- Comment on posts
- Reply to comments in threaded conversations
- Like posts and view a trending page
- Follow other users and view profiles
- Search posts and see simple recommendations
- Upload a profile avatar and view avatars on posts
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
This script runs Sequelize migrations and seeds to create the local `data/test.db` SQLite database.

The seed data includes a demo administrator account:

- **Username:** `admin`
- **Password:** `admin123`

This user comes with a couple of example posts so you have some content in the feed right away.

Visit `http://localhost:3000` to use the app. The homepage shows your feed and recommendations. Additional pages:

- `/home` - your personalized feed
- `/trending` - trending posts
- `/search` - search posts
- `/posts/[id]` - view a single post with comments
- `/users/[id]` - view a user profile
- `/compose` - create a new post

## Compliance

This project strives to follow applicable regulations and moderation requirements. Content posted by users should comply with local laws and community standards.

## iOS and macOS apps

This project can be packaged as a native application using [Capacitor](https://capacitorjs.com/). A ready-made `capacitor.config.ts` is included, so after installing the dependencies (which now include TypeScript) run:

```bash
npm run build
npx cap add ios
```

Open the generated `ios` directory in Xcode to run the app on iPhone or build for macOS via Mac Catalyst. The web content is served from the local Next.js server so keep it running during development:

```bash
npm run dev
```

See the Capacitor documentation for details on code signing and App Store submission.
