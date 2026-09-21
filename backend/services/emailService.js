import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

export const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  if (!to) {
    throw new Error("Recipient email is required.");
  }

  if (!subject) {
    throw new Error("Email subject is required.");
  }

  if (!html) {
    throw new Error("Email content is required.");
  }

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject,
    html,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error(error.message || "Failed to send email.");
  }

  console.log("Email sent successfully:", data?.id);

  return data;
};

export const sendVerificationEmail = async ({
  to,
  fullName,
  verificationUrl,
}) => {
  return sendEmail({
    to,
    subject: "Verify your PromptSentinel account",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f6f9fc;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;padding:32px;">
            <h1 style="color:#0b1f3a;margin-bottom:16px;">
              Welcome to PromptSentinel
            </h1>

            <p style="font-size:16px;color:#333;">
              Hello ${fullName || "there"},
            </p>

            <p style="font-size:16px;color:#333;line-height:1.6;">
              Thank you for registering with PromptSentinel.
              Please verify your email address to activate your account.
            </p>

            <div style="margin:30px 0;">
              <a
                href="${verificationUrl}"
                style="
                  display:inline-block;
                  padding:12px 24px;
                  background:#0b1f3a;
                  color:#ffffff;
                  text-decoration:none;
                  border-radius:8px;
                  font-weight:bold;
                "
              >
                Verify Email
              </a>
            </div>

            <p style="font-size:14px;color:#666;line-height:1.5;">
              This verification link is temporary. If you did not create
              this account, you can safely ignore this email.
            </p>

            <p style="font-size:14px;color:#999;margin-top:30px;">
              PromptSentinel Security Platform
            </p>
          </div>
        </body>
      </html>
    `,
  });
};

export const sendPasswordResetEmail = async ({
  to,
  fullName,
  resetUrl,
}) => {
  return sendEmail({
    to,
    subject: "Reset your PromptSentinel password",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f6f9fc;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:12px;padding:32px;">
            <h1 style="color:#0b1f3a;margin-bottom:16px;">
              Password Reset Request
            </h1>

            <p style="font-size:16px;color:#333;">
              Hello ${fullName || "there"},
            </p>

            <p style="font-size:16px;color:#333;line-height:1.6;">
              We received a request to reset your PromptSentinel password.
              Click the button below to create a new password.
            </p>

            <div style="margin:30px 0;">
              <a
                href="${resetUrl}"
                style="
                  display:inline-block;
                  padding:12px 24px;
                  background:#0b1f3a;
                  color:#ffffff;
                  text-decoration:none;
                  border-radius:8px;
                  font-weight:bold;
                "
              >
                Reset Password
              </a>
            </div>

            <p style="font-size:14px;color:#666;line-height:1.5;">
              If you did not request a password reset, you can safely ignore
              this email. Your password will remain unchanged.
            </p>

            <p style="font-size:14px;color:#999;margin-top:30px;">
              PromptSentinel Security Platform
            </p>
          </div>
        </body>
      </html>
    `,
  });
};