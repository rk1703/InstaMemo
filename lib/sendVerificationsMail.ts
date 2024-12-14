interface VerificationRequestParams {
  identifier: string;
  url: string;
  expires: Date;
  token: string;
  request: Request;
}

export async function sendVerificationRequest(
  params: VerificationRequestParams
) {
  let { identifier: to, url } = params;
  const { host } = new URL(url);
  let newUrl = new URL(url);
  newUrl.searchParams.set("callbackUrl", `http://${host}/dashboard`);

  url = newUrl.href;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AUTH_RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Instamemo <no-reply@rkworld.me>",
        to,
        subject: `Sign in to InstaMemo`,
        html: html({ url, host }),
      }),
    });

    if (!res.ok) {
      const errorDetails = await res.json();
      throw new Error(`Resend error: ${JSON.stringify(errorDetails)}`);
    }
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error(
      "Unable to send verification email. Please try again later."
    );
  }
}

function html({ url, host }: { url: string; host: string }) {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>InstaMemo - Confirm Email</title>
  </head>
  <body
    style="
      margin: 0 auto;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      background-color: #f7f7f7;
      color: #333;
    "
  >
    <!-- Centered Table Container -->
    <table
      align="center"
      width="100%"
      cellspacing="0"
      cellpadding="0"
      style="max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);"
    >
      <!-- Header Section -->
      <tr>
        <td style="text-align: center; padding: 20px 0;">
          <h1 style="font-size: 36px; margin: 0;">
            <span style="color: #f70606; font-weight: bold;">Insta</span
            ><span style="color: #333; font-weight: bold;">Memo</span>
          </h1>
        </td>
      </tr>

      <!-- Main Content -->
      <tr>
        <td style="padding: 30px; text-align: center;">
          <h2 style="font-size: 24px; color: #1d1c1d; margin: 0;">
            Confirm your email address
          </h2>
          <p style="font-size: 16px; line-height: 1.5; margin: 20px 0;">
            Click below to sign in to
            <strong>InstaMemo</strong>. This link will expire in
            <strong>2 hours</strong> and can only be used once.
          </p>
          <!-- Sign-In Button -->
          <a
            href="${url}"
            style="
              display: inline-block;
              padding: 12px 24px;
              font-size: 16px;
              font-weight: 600;
              color: #fff;
              background-color: #f70606;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Sign in
          </a>
        </td>
      </tr>

      <!-- Footer Section -->
      <tr>
        <td style="padding: 20px; text-align: center; background-color: #f7f7f7;">
          <p style="font-size: 14px; color: #777; margin: 10px 0;">
            If you didn't request this email, you can safely ignore it.
          </p>
          <!-- Social Links -->
          <div>
            <a
              href="https://github.com/rk1703"
              target="_blank"
              style="margin: 0 10px; text-decoration: none;"
            >
              <img
                src="https://react-email-demo-hich02t6q-resend.vercel.app/static/github.png"
                alt="GitHub"
                width="32"
                height="32"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/ravikant-baghel-957b48244/"
              target="_blank"
              style="margin: 0 10px; text-decoration: none;"
            >
              <img
                src="https://react-email-demo-hich02t6q-resend.vercel.app/static/slack-linkedin.png"
                alt="LinkedIn"
                width="32"
                height="32"
              />
            </a>
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 10px;">
            &copy; 2024 RK WORLD. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>

    `;
}
