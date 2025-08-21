This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Backend has been split to `backend/` (Express + Prisma). FE proxies selected routes to BE via rewrites.

### Dev (run FE + BE)

1. Create env files:
   - `.env` (root): set `BACKEND_URL=http://localhost:4000`
   - `backend/.env`: copy from `backend/.env.example` and set `MONGODB_URI`, `JWT_SECRET`.

2. Install deps:
```
npm install
cd backend && npm install && cd ..
```

3. Run both:
```
npm run dev:all
```

FE: http://localhost:3000  |  BE: http://localhost:4000

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

### Run with Docker

1) Build and start all services (MongoDB, Backend, Frontend):
```
docker compose up --build
```

2) URLs:
- Frontend: http://localhost:3000
- Backend:  http://localhost:4000
- MongoDB:  mongodb://localhost:27017 (data persisted to `mongo-data` volume)

3) Useful commands:
```
# Recreate containers after code changes
docker compose up --build -d

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Stop all
docker compose down
```

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.