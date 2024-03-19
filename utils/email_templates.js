// EMAIL TEMPLATE SEND VERIFICATION LINK
function emailTemplateSendVerificationLink(link,userName) {
  
  return `
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0;">
  <meta name="format-detection" content="telephone=no"/>

  <style>
  /-* Reset styles */ 
  body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important;}
  body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important; border-spacing: 0; }
  .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }

  /* Rounded corners for advanced mail clients only */ 
  @media all and (min-width: 560px) {
  .container { border-radius: 8px; -webkit-border-radius: 8px; -moz-border-radius: 8px; -khtml-border-radius: 8px; }
  }

  /* Set color for auto links (addresses, dates, etc.) */ 
  a, a:hover {
  color: #FFFFFF;
  }

  </style>

  <!-- MESSAGE SUBJECT -->
  <title>Responsive HTML email templates</title>

  </head>

  <!-- BODY -->
  <body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;
  background-color: #2D3445;
  color: #FFFFFF;"
  bgcolor="#2D3445"
  text="#FFFFFF">

  <!-- SECTION / BACKGROUND -->
  <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background"><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;"
  bgcolor="#2D3445">

  <!-- WRAPPER -->
  <table border="0" cellpadding="0" cellspacing="0" align="center"
  width="500" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
  max-width: 500px;" class="wrapper">

  <br>
  <br>

  <!-- HEADER -->
  <tr>
  <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;  padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%;
  padding-top: 5px;
  color: #FFFFFF;
  font-family: sans-serif;" class="header">
  Verify your email address
  </td>
  </tr>

  <!-- PARAGRAPH -->
  <tr>
  <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
  padding-top: 15px; 
  color: #FFFFFF;
  font-family: sans-serif;" class="paragraph">
  Hello ${userName} 👋
  </td>
  </tr>

  <br>

  <tr>
  <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
  padding-top: 15px; 
  color: #FFFFFF;
  font-family: sans-serif;" class="paragraph">
  Please confirm that you wish to use this as the email address for your self account. Once you're done, you'll be able to use your account!
  </td>
  </tr>

  <br>

  <!-- BUTTON -->
  <tr>
  <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
  padding-top: 25px;
  padding-bottom: 5px;" class="button"><a
  href="${link}" target="_blank" style="text-decoration: underline;">
  <table border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;"><tr><td align="center" valign="middle" style="padding: 12px 24px; margin: 0; text-decoration: underline; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;"
  bgcolor="#DAF7A6"><a target="_blank" style="text-decoration: underline;
  color: #2D3445; font-family: sans-serif; font-size: 20px; font-weight: 400; line-height: 120%;"
  href="${link}">
  Verify my email
  </a>
  </td></tr></table></a>
  </td>
  </tr>

  <!-- LINE -->
  <tr>
  <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
  padding-top: 30px;" class="line"><hr
  color="#565F73" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
  </td>
  </tr>

  <!-- End of WRAPPER -->
  </table>

  <!-- End of SECTION / BACKGROUND -->
  </td></tr></table>

  </body>
  </html>`

}


// EMAIL TEMPLATE SEND OTP CODE
function emailTemplateSendOTPCode(OTP_CODE, userName, email) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Static Template</title>
  
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;700&family=Poppins:ital,wght@0,300;0,600;0,700;1,400&display=swap"
        rel="stylesheet"
      />
    </head>
    <body
      style="
        margin: 0;
        font-family: 'Be Vietnam Pro', sans-serif;
        background: #ffffff;
        font-size: 14px;
      "
    >
      <div
        style="
          max-width: 680px;
          margin: 0 auto;
          padding: 45px 30px 60px;
          background: #f4f7ff;
          font-size: 14px;
          color: #434343;
        "
      >
  
        <main>
          <div
            style="
              margin: 0;
              padding: 40px 10px;
              background: #ffffff;
              border-radius: 12px;
              text-align: center;
            "
          >
            <div style="width: 100%; max-width: 489px; margin: 0 auto">
              <h1
                style="
                  margin: 0;
                  font-size: 24px;
                  font-weight: 500;
                  color: #1f1f1f;
                "
              >
                OTP CODE
              </h1>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-size: 16px;
                  font-weight: 500;
                "
              >
                Hello ${userName} 👋
              </p>
              <p
                style="
                  margin: 0;
                  margin-top: 17px;
                  font-weight: 500;
                  letter-spacing: 0.56px;
                "
              >
                Thank you for choosing OTP Client. Use the following OTP to complete your password reset process. OTP is valid in
                <span style="font-weight: 600; color: #1f1f1f">10 min</span>.
                Do not share this code with others.
              </p>
              <p
                style="
                  margin-top: 60px;
                  font-size: 50px;
                  font-weight: 600;
                  color: #ba3d4f;">
                ${OTP_CODE}
              </p>
            </div>
          </div>
  
          <p
            style="
              max-width: 400px;
              margin: 0 auto;
              margin-top: 40px;
              text-align: center;
              font-weight: 500;
              color: #8c8c8c;
            "
          >
            Any question please contact
            <a
              href="mailto:tunghghg@gmail.com"
              style="color: #499fb6; text-decoration: none"
              >${email}</a
            >
            <!-- or visit our -->
            <!-- <a
              href=""
              target="_blank"
              style="color: #499fb6; text-decoration: none"
              >Help Center</a
            > -->
          </p>
        </main>
  
        <footer
          style="
            width: 100%;
            max-width: 490px;
            margin: 20px auto 0;
            text-align: center;
            border-top: 1px solid #e6ebf1;
          "
        >
          <p
            style="
              margin: 0;
              margin-top: 40px;
              font-size: 16px;
              font-weight: 600;
              color: #434343;
            "
          >
            OTP Client
          </p>
          <!-- <p style="margin: 0; margin-top: 8px; color: #434343">
            Address 540, City, State.
          </p> -->
          <div style="margin: 0; margin-top: 16px">
            <a href="" target="_blank" style="display: inline-block">
              <img
                width="36px"
                alt="Facebook"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
              />
            </a>
            <a
              href=""
              target="_blank"
              style="display: inline-block; margin-left: 8px"
            >
              <img
                width="36px"
                alt="Instagram"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
            /></a>
            <a
              href=""
              target="_blank"
              style="display: inline-block; margin-left: 8px"
            >
              <img
                width="36px"
                alt="Twitter"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
              />
            </a>
            <a
              href=""
              target="_blank"
              style="display: inline-block; margin-left: 8px"
            >
              <img
                width="36px"
                alt="Youtube"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
            /></a>
          </div>
          <p style="margin: 0; margin-top: 16px; color: #434343">
            Copyright © 2022 Company. All rights reserved.
          </p>
        </footer>
      </div>
    </body>
  </html>`
}


module.exports = {
  emailTemplateSendVerificationLink,
  emailTemplateSendOTPCode
}