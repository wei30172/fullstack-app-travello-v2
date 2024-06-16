import { NextResponse } from "next/server"

// api/email-preview
export async function GET(
  req: Request
) {
  // sendVerificationEmail
  // const confirmLink = "#"
  // const emailHtml = `
  //   <html>
  //     <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0fdfa;">
  //       <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
  //         <h1 style="color: #0d9488; text-align: center;">Email Confirmation</h1>
  //         <p style="color: #0f766e; font-size: 18px; text-align: center;">Please click the link below to confirm your email address:</p>
  //         <div style="display: flex; justify-content: center; align-items: center; margin: 20px 0;">
  //           <a href="${confirmLink}" style="font-size: 18px; color: white; background-color: #14b8a6; padding: 10px 20px; border-radius: 5px; text-align: center; text-decoration: none;">Click here to confirm email</a>
  //         </div>
  //         <p style="color: #0f766e; text-align: center; margin-top: 20px;">If you did not request this email, please ignore it.</p>
  //       </div>
  //     </body>
  //   </html>
  // `

  // sendPasswordResetEmail
  // const resetLink = "#"
  // const emailHtml = `
  //   <html>
  //     <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0fdfa;">
  //       <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
  //         <h1 style="color: #0d9488; text-align: center;">Password Reset</h1>
  //         <p style="color: #0f766e; font-size: 18px; text-align: center;">Please click the link below to reset your password:</p>
  //         <div style="display: flex; justify-content: center; align-items: center; margin: 20px 0;">
  //           <a href="${resetLink}" style="font-size: 18px; color: white; background-color: #14b8a6; padding: 10px 20px; border-radius: 5px; text-align: center; text-decoration: none;">Click here to reset password</a>
  //         </div>
  //         <p style="color: #0f766e; text-align: center; margin-top: 20px;">If you did not request this email, please ignore it.</p>
  //       </div>
  //     </body>
  //   </html>
  // `

  // sendTwoFactorTokenEmail
  // const token = "123456"
  // const emailHtml = `
  //   <html>
      // <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0fdfa;">
      //   <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      //     <h1 style="color: #0d9488; text-align: center;">Your Two-Factor Authentication (2FA) Code</h1>
      //     <p style="color: #0f766e; font-size: 18px; text-align: center;">Your 2FA code is:</p>
      //     <div style="display: flex; justify-content: center; align-items: center; margin: 20px 0;">
      //       <span style="font-size: 24px; color: white; background-color: #14b8a6; padding: 10px 20px; border-radius: 5px; text-align: center;">
      //         ${token}
      //       </span>
      //     </div>
      //     <p style="color: #0f766e; text-align: center; margin-top: 20px;">Please use this code to complete your login.</p>
      //   </div>
      // </body>
  //   </html>
  // `
  
  // sendInvitationEmail
  // const user = "mail@example.com"
  // const shareLink = "#"
  // const emailHtml = `
  //   <html>
  //     <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0fdfa;">
  //       <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
  //         <h1 style="color: #0d9488; text-align: center;">Trip Invitation</h1>
  //         <p style="color: #0f766e; font-size: 18px; text-align: center;">${user} has invited you to join their trip.</p>
  //         <div style="display: flex; justify-content: center; align-items: center; margin: 20px 0;">
  //           <a href="${shareLink}" style="font-size: 18px; color: white; background-color: #14b8a6; padding: 10px 20px; border-radius: 5px; text-align: center; text-decoration: none;">Click here to accept the invitation</a>
  //         </div>
  //         <p style="color: #0f766e; text-align: center; margin-top: 20px;">If you did not request this email, please ignore it.</p>
  //       </div>
  //     </body>
  //   </html>
  // `
  
  const { searchParams } = new URL(req.url)
  const name = searchParams.get("name") || "World"
  
  const emailHtml = `
    <html>
      <body>
        <h1>Hello, ${name}!</h1>
        <p>This is a test email.</p>
      </body>
    </html>
  `

  return new NextResponse(emailHtml, {
    headers: {
      "Content-Type": "text/html"
    }
  })
}