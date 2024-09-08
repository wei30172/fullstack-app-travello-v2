<img width="1470" alt="13_drag-card" src="https://github.com/user-attachments/assets/39dccc41-035d-4087-a85c-85705e57330c">## Travel Planning Platform with Next.js and OpenAI GPT-4

Facilitated an easy-to-use drag and drop itinerary planner, allowing users to visually organize their travel schedule.

1.Trello-Inspired Interface: Familiar drag-and-drop functionality for intuitive travel scheduling.

2.AI-Driven Recommendations: Provides AI-generated travel suggestions for travel planning.

3.Share Trips with Other Users: Easily share your trips with friends or family via generated links.

## Project Screenshots
<img width="1468" alt="1_homepage" src="https://github.com/user-attachments/assets/9fac8778-7b18-445d-a17a-3b0e0b9989a9">
<img width="1470" alt="2_trip-list" src="https://github.com/user-attachments/assets/dedd89f4-e404-4bdb-a43d-7849bed26350">
<img width="1470" alt="3_create-trip" src="https://github.com/user-attachments/assets/8b6ea193-ac20-4cfd-af88-f5a8c3bb8341">
<img width="1470" alt="4_auto-day-list" src="https://github.com/user-attachments/assets/274c0a45-4cae-456e-bc54-f9887db21aa8">
<img width="1470" alt="5_select-trip-cover" src="https://github.com/user-attachments/assets/f0b3c146-334f-4b5f-af36-6c6aac3855bf">
<img width="1470" alt="6_update-trip-card" src="https://github.com/user-attachments/assets/13ea3605-d5ae-493e-a9eb-09382bf97e97">
<img width="1470" alt="7_mark-trip" src="https://github.com/user-attachments/assets/6355e504-bed1-4597-8f18-0f7fd8ea3001">
<img width="1470" alt="8_update-trip-info" src="https://github.com/user-attachments/assets/32361ec8-a50e-440f-bc42-548dc648604c">
<img width="736" alt="9_ai-suggestions" src="https://github.com/user-attachments/assets/e22b6220-cb0c-475a-83a0-58cd548343d7">
<img width="1469" alt="10_auto-trip-cards" src="https://github.com/user-attachments/assets/e5308584-dbb8-4050-8b0e-4805cd1fa376">
<img width="1470" alt="11_share-trip" src="https://github.com/user-attachments/assets/ecb5c65d-a9a5-4865-a9ea-8c4c42278e9f">
<img width="1470" alt="12_drag-list" src="https://github.com/user-attachments/assets/844af358-1819-4e5e-9694-03942f5039ac">
<img width="1470" alt="13_drag-card" src="https://github.com/user-attachments/assets/81435a7c-507c-4393-a2d2-bbfbe0decc40">
<img width="1470" alt="14_delete-trip" src="https://github.com/user-attachments/assets/d17eedb7-6f4a-4b06-946f-1b7f49fc0a1e">
<img width="1470" alt="15_restore-trip" src="https://github.com/user-attachments/assets/fad68248-5f72-46f7-b5f0-a8c973fb2ec2">
<img width="1470" alt="16_create-account" src="https://github.com/user-attachments/assets/65cb0127-dd17-47f2-ac6b-b5be6ed6bb19">
<img width="1470" alt="17_2fa-verification" src="https://github.com/user-attachments/assets/c59907a6-b99d-4e4c-a9ad-1a2e219a3929">
<img width="1469" alt="18_change-password" src="https://github.com/user-attachments/assets/f4c3cf93-4859-481f-8d65-362baa1215e6">
<img width="1470" alt="19_reset-password" src="https://github.com/user-attachments/assets/e9f56b81-1ab3-4769-b44c-5977dd408cbb">
<img width="1470" alt="20_update-profile" src="https://github.com/user-attachments/assets/38771d4d-1253-4734-81b6-1a08d89ed0d5">
<img width="1470" alt="21_toggle-dark-mode" src="https://github.com/user-attachments/assets/8f315d98-91d1-43f9-9b53-c8b0d333c40a">

## Environment Setup
Create a .env file in the root directory and add the following variables:

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000" or "YOUR_NEXT_PUBLIC_APP_URL"

AUTH_SECRET="YOUR_AUTH_SECRET"

MONGODB_URI="YOUR_MONGODB_URI"

GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

OPENAI_API_KEY=="YOUR_OPENAI_API_KEY"

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
