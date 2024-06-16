import nodemailer from "nodemailer"

const baseURL = process.env.NEXT_PUBLIC_APP_URL
const emailUser = process.env.EMAIL_USER
const emailPass = process.env.EMAIL_PASSWORD

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: emailUser, pass: emailPass }
})

export const sendVerificationEmail = async (
  email: string, 
  token: string
) => {
  const confirmLink = `${baseURL}/new-verification?token=${token}`

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: "Confirm your email",
    // html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
    html: `
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0fdfa;">
        <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #0d9488; text-align: center;">Email Confirmation</h1>
          <p style="color: #0f766e; font-size: 18px; text-align: center;">Please click the link below to confirm your email address:</p>
          <table style="margin: 20px auto;">
            <tr>
              <td style="background-color: #14b8a6; padding: 10px 20px; border-radius: 5px; text-align: center;">
                <a href="${confirmLink}" style="font-size: 18px; color: white; text-decoration: none; display: inline-block;">Click here to confirm email</a>
              </td>
            </tr>
          </table>
          <p style="color: #0f766e; text-align: center; margin-top: 20px;">If you did not request this email, please ignore it.</p>
        </div>
      </body>
    `
  }
  
  await transporter.sendMail(mailOptions)
}

export const sendPasswordResetEmail = async (
  email: string, 
  token: string
) => {
  const resetLink = `${baseURL}/new-password?token=${token}`

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: "Reset your password",
    // html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
    html: `
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0fdfa;">
        <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #0d9488; text-align: center;">Password Reset</h1>
          <p style="color: #0f766e; font-size: 18px; text-align: center;">Please click the link below to reset your password:</p>
          <table style="margin: 20px auto;">
            <tr>
              <td style="background-color: #14b8a6; padding: 10px 20px; border-radius: 5px; text-align: center;">
                <a href="${resetLink}" style="font-size: 18px; color: white; text-decoration: none; display: inline-block;">Click here to confirm email</a>
              </td>
            </tr>
          </table>
          <p style="color: #0f766e; text-align: center; margin-top: 20px;">If you did not request this email, please ignore it.</p>
        </div>
      </body>
    `
  }

  await transporter.sendMail(mailOptions)
}

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  const mailOptions = {
    from: emailUser,
    to: email,
    subject: "2FA Code",
    // html: `<p>Your 2FA code: ${token}</p>`
    html: `
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0fdfa;">
        <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #0d9488; text-align: center;">Your Two-Factor Authentication (2FA) Code</h1>
          <p style="color: #0f766e; font-size: 18px; text-align: center;">Your 2FA code is:</p>
          <table style="margin: 20px auto;">
            <tr>
              <td style="background-color: #14b8a6; padding: 10px 20px; border-radius: 5px; text-align: center;">
                <span style="font-size: 24px; color: white; background-color: #14b8a6; padding: 10px 20px; border-radius: 5px; text-align: center;">
                  ${token}
                </span>
              </td>
            </tr>
          </table>
          <p style="color: #0f766e; text-align: center; margin-top: 20px;">Please use this code to complete your login.</p>
        </div>
      </body>
    `
  }

  await transporter.sendMail(mailOptions)
}

export const sendInvitationEmail = async (
  email: string,
  user: string,
  token: string
) => {
  const shareLink = `${baseURL}/accept-invitation?token=${token}`

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: "Trip Share Invitation",
    // html: `
    //   <p>${user} has invited you to join their trip. Click 
    //   <a href="${shareLink}">here</a> to accept the invitation.</p>
    // `
    html: `
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f0fdfa;">
        <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: white; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #0d9488; text-align: center;">Trip Invitation</h1>
          <p style="color: #0f766e; font-size: 18px; text-align: center;">${user} has invited you to join their trip.</p>
          <table style="margin: 20px auto;">
            <tr>
              <td style="background-color: #14b8a6; padding: 10px 20px; border-radius: 5px; text-align: center;">
                <a href="${shareLink}" style="font-size: 18px; color: white; text-decoration: none; display: inline-block;">Click here to confirm email</a>
              </td>
            </tr>
          </table>
          <p style="color: #0f766e; text-align: center; margin-top: 20px;">If you did not request this email, please ignore it.</p>
        </div>
      </body>
    `
  }

  await transporter.sendMail(mailOptions)
}