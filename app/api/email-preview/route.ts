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
  //       <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
  //         <h1 style="color: #0d9488; text-align: center;">Email Confirmation</h1>
  //         <p style="color: #0f766e; font-size: 18px; text-align: center;">Please click the link below to confirm your email address:</p>
  //         <table style="margin: 20px auto;">
  //           <tr>
  //             <td style="background-color: #14b8a6; padding: 10px 20px; border-radius: 5px; text-align: center;">
  //               <a href="${confirmLink}" style="font-size: 18px; color: white; text-decoration: none; display: inline-block;">Click here to confirm email</a>
  //             </td>
  //           </tr>
  //         </table>
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