## Travel Planning Platform with Next.js and OpenAI GPT-4

Facilitated an easy-to-use drag and drop itinerary planner, allowing users to visually organize their travel schedule.

1.Trello-Inspired Interface: Familiar drag-and-drop functionality for intuitive travel scheduling.

2.Simple Duplication and Editing: Quickly copy and edit itineraries.

3.AI-Driven Recommendations: Provides AI-generated travel suggestions for travel planning.


## Project Screenshots
![fullstack-app-travello](https://github.com/wei30172/fullstack-app-travello/assets/60259324/26893b29-5d67-49ad-aee3-faeb25d782b2)
![fullstack-app-travello](https://github.com/wei30172/fullstack-app-travello/assets/60259324/46c919a6-de4f-4934-9f3a-4e5fac010b1f)
![fullstack-app-travello](https://github.com/wei30172/fullstack-app-travello/assets/60259324/d62b8e1b-f622-406e-9269-eecbd040b5df)
![fullstack-app-travello](https://github.com/wei30172/fullstack-app-travello/assets/60259324/9e6a3afb-1ca2-427f-baab-3b5627dc3d31)
![fullstack-app-travello](https://github.com/wei30172/fullstack-app-travello/assets/60259324/bf3da0fb-e1c2-4765-9147-da1701aa6525)
![fullstack-app-travello](https://github.com/wei30172/fullstack-app-travello/assets/60259324/4f45956d-6e3e-41d5-9fd1-3488be36a8d1)
![fullstack-app-travello](https://github.com/wei30172/fullstack-app-travello/assets/60259324/31309e42-9816-477f-8e6b-31430f10cbd1)
![fullstack-app-travello](https://github.com/wei30172/fullstack-app-travello/assets/60259324/7cfbc42f-7033-44ba-aff4-82a28e36cac1)
![fullstack-app-travello](https://github.com/wei30172/fullstack-app-travello/assets/60259324/3932f0b0-a969-4dc0-8394-67fa0db3ffe3)
![fullstack-app-travello](https://github.com/wei30172/fullstack-app-travello/assets/60259324/9d1cf3c5-d9d5-4ba6-a925-13a1dd8acf01)
![fullstack-app-travello](https://github.com/wei30172/fullstack-app-travello/assets/60259324/7a10ca3c-588b-49a6-9d0b-c7304cb91c48)

## Environment Setup
Create a .env file in the root directory and add the following variables:

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"

AUTH_SECRET="YOUR_AUTH_SECRET"

MONGODB_URI="YOUR_MONGODB_URI"

GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

OPENAI_API_KEY=="OPENAI_API_KEY"

TOKEN_SECRET="YOUR_TOKEN_SECRET"

EMAIL_USER="YOUR_EMAIL_USER"
EMAIL_PASSWORD="YOUR_EMAIL_PASSWORD"

AWS_APP_ACCESS_KEY="YOUR_AWS_APP_ACCESS_KEY"
AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_ACCESS_KEY"
AWS_BUCKET_NAME="YOUR_AWS_BUCKET_NAME"
AWS_BUCKET_REGION="YOUR_AWS_BUCKET_REGION"
```

GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET

- Navigate to [https://console.cloud.google.com](https://console.cloud.google.com/) .

- Create a new project.

- Head over to APIs & Services => Credentials.
  
- Click on CREATE CREDENTIALS => OAuth client ID.
  
- Choose the Web application.

- Add to Authorized JavaScript origins: http://localhost:3000 .

- Add to Authorized redirect URIs: http://localhost:3000/api/auth/callback/google.
  
- Finish by going to APIs & Services => OAuth consent screen and publishing the app.

## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
