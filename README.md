## Travel Planning Platform with Next.js and OpenAI GPT-4

Facilitated an easy-to-use drag and drop itinerary planner, allowing users to visually organize their travel schedule.

1.Trello-Inspired Interface: Familiar drag-and-drop functionality for intuitive travel scheduling.

2.AI-Driven Recommendations: Provides AI-generated travel suggestions for travel planning.

3.Share Trips with Other Users: Easily share your trips with friends or family via generated links.

## Project Screenshots
![Travel planning platform homepage](https://github.com/user-attachments/assets/6e253495-c980-4595-9b70-d01731d0dc89)
*The homepage of the travel planning platform, providing users with an overview and navigation options.*

![List of trips](https://github.com/user-attachments/assets/dedd89f4-e404-4bdb-a43d-7849bed26350)
*Displays all saved trips, allowing users to view, select their trips.*

![Create a new trip](https://github.com/user-attachments/assets/8b6ea193-ac20-4cfd-af88-f5a8c3bb8341)
*The interface for creating a new trip, allowing users to input basic details and start organizing.*

![Automatically generated day lists](https://github.com/user-attachments/assets/274c0a45-4cae-456e-bc54-f9887db21aa8)
*The system automatically generates day lists for the trip after the initial trip creation.*

![Update trip card](https://github.com/user-attachments/assets/13ea3605-d5ae-493e-a9eb-09382bf97e97)
*The user can update information on individual trip cards such as notes.*

![Select trip cover](https://github.com/user-attachments/assets/f0b3c146-334f-4b5f-af36-6c6aac3855bf)
*Users can upload or select a cover image for their trip to personalize it.*

![Mark trip as done or add tags](https://github.com/user-attachments/assets/6355e504-bed1-4597-8f18-0f7fd8ea3001)
*Allows users to mark a trip as completed or add color tags for better organization.*

![Update trip information](https://github.com/user-attachments/assets/32361ec8-a50e-440f-bc42-548dc648604c)
*Allows users to edit the general information for a trip, including trip title, dates, and details.*

![Ask AI for travel recommendations](https://github.com/user-attachments/assets/e22b6220-cb0c-475a-83a0-58cd548343d7)
*Users can ask AI for travel recommendations to assist in planning their trip.*

![Auto-generate trip cards](https://github.com/user-attachments/assets/e5308584-dbb8-4050-8b0e-4805cd1fa376)
*The platform generates trip cards based on AI-generated suggestions, simplifying the planning process.*

![Share trip link via email](https://github.com/user-attachments/assets/ecb5c65d-a9a5-4865-a9ea-8c4c42278e9f)
*Users can share a trip link with others through email for easy collaboration.*

![Drag entire day list](https://github.com/user-attachments/assets/c934c747-c243-474f-a568-aeafbca997db)
*The drag-and-drop interface allows users to rearrange entire day lists within their trip itinerary.*

![Drag single trip card](https://github.com/user-attachments/assets/afc26ff8-fadd-469c-8d24-40a52df119d7)
*Users can drag and rearrange individual trip cards to adjust their travel schedule.*

![Delete trip](https://github.com/user-attachments/assets/d17eedb7-6f4a-4b06-946f-1b7f49fc0a1e)
*Users can delete a trip, removing it from their saved list.*

![Restore deleted trip](https://github.com/user-attachments/assets/fad68248-5f72-46f7-b5f0-a8c973fb2ec2)
*Users can restore a previously deleted trip from the archive.*

![Create a user account](https://github.com/user-attachments/assets/65cb0127-dd17-47f2-ac6b-b5be6ed6bb19)
*The registration page for creating a new account on the platform.*

![2FA email verification](https://github.com/user-attachments/assets/c59907a6-b99d-4e4c-a9ad-1a2e219a3929)
*The platform supports two-factor authentication (2FA) via email for added security.*

![Change password via email](https://github.com/user-attachments/assets/f4c3cf93-4859-481f-8d65-362baa1215e6)
*Users can request a password change through email verification to update their credentials.*

![Reset password via email](https://github.com/user-attachments/assets/e9f56b81-1ab3-4769-b44c-5977dd408cbb)
*The interface for resetting a forgotten password through email verification.*

![Update user profile](https://github.com/user-attachments/assets/38771d4d-1253-4734-81b6-1a08d89ed0d5)
*Users can update their personal information, such as preferences.*

![Toggle dark mode](https://github.com/user-attachments/assets/8f315d98-91d1-43f9-9b53-c8b0d333c40a)
*The platform supports toggling between light and dark modes for user preference.*

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
