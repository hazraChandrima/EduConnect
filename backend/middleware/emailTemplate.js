module.exports.Verification_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              color: #333;
              line-height: 1.8;
          }
          .verification-code {
              display: block;
              margin: 20px 0;
              font-size: 22px;
              color: #4CAF50;
              background: #e8f5e9;
              border: 1px dashed #4CAF50;
              padding: 10px;
              text-align: center;
              border-radius: 5px;
              font-weight: bold;
              letter-spacing: 2px;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Verify Your Email</div>
          <div class="content">
              <p>Hello,</p>
              <p>Thank you for signing up! Please confirm your email address by entering the code below:</p>
              <span class="verification-code">{verificationCode}</span>
              <p>If you did not create an account, no further action is required. If you have any questions, feel free to contact our support team.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} EduConnect. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;






module.exports.Welcome_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Our Community</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #007BFF;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.8;
          }
          .welcome-message {
              font-size: 18px;
              margin: 20px 0;
          }
          .button {
              display: inline-block;
              padding: 12px 25px;
              margin: 20px 0;
              background-color: #007BFF;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              transition: background-color 0.3s;
          }
          .button:hover {
              background-color: #0056b3;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Welcome to Our Community!</div>
          <div class="content">
              <p class="welcome-message">Hello {name},</p>
              <p>We're thrilled to have you join us! Your registration was successful, and we're committed to providing you with the best experience possible.</p>
              <p>Here's how you can get started:</p>
              <ul>
                  <li>Explore our features and customize your experience.</li>
                  <li>Stay informed by checking out our blog for the latest updates and tips.</li>
                  <li>Reach out to our support team if you have any questions or need assistance.</li>
              </ul>
              <p>If you need any help, don't hesitate to contact us. We're here to support you every step of the way.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} EduConnect. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;






module.exports.Alert_Email_On_Login_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Login Alert</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #FF7700;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.8;
          }
          .alert-message {
              font-size: 18px;
              margin: 20px 0;
          }
          .details-box {
              background-color: #f8f8f8;
              border: 1px solid #ddd;
              border-radius: 5px;
              padding: 15px;
              margin: 20px 0;
          }
          .details-item {
              margin-bottom: 10px;
          }
          .details-label {
              font-weight: bold;
              color: #555;
          }
          .button {
              display: inline-block;
              padding: 12px 25px;
              margin: 20px 0;
              background-color: #FF7700;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              transition: background-color 0.3s;
          }
          .button:hover {
              background-color: #e66a00;
          }
          .warning {
              color: #D9534F;
              font-weight: bold;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Account Login Alert</div>
          <div class="content">
              <p class="alert-message">Hello {name},</p>
              <p>We detected a recent login to your account. If this was you, no action is needed.</p>
              
              <div class="details-box">
                  <div class="details-item">
                   <span class="details-label">Date & Time:</span>  
                   <strong>${new Date().toLocaleString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                timeZoneName: 'short'
                            })}
                        </strong>
                  </div>
              </div>
              
              <p class="warning">If you did not login at this time, please secure your account immediately!</p>
                            
              <p>For your security, we recommend:</p>
              <ul>
                  <li>Change your password immediately</li>
                  <li>Enable two-factor authentication if not already active</li>
                  <li>Review recent account activity</li>
              </ul>
              
              <p>If you need any assistance, please contact our support team immediately at educonnect@university.edu.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} EduConnect. All rights reserved.</p>
              <p>This is an automated message, please do not reply directly to this email.</p>
          </div>
      </div>
  </body>
  </html>
`;



module.exports.Reset_Password_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #d9534f;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.8;
          }
          .button {
              display: inline-block;
              padding: 12px 25px;
              margin: 20px 0;
              background-color: #d9534f;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              transition: background-color 0.3s;
          }
          .button:hover {
              background-color: #c9302c;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Reset Your Password</div>
          <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password. Click the button below to reset it:</p>

                <div class="details-box">
                  <div class="details-item">
                   <span class="details-label">Date & Time:</span>
                   <strong>${new Date().toLocaleString('en-US', {
                       weekday: 'long',
                       year: 'numeric',
                       month: 'long',
                       day: 'numeric',
                       hour: '2-digit',
                       minute: '2-digit',
                       second: '2-digit',
                       timeZoneName: 'short'
                   })}
                        </strong>
                  </div>
              </div>
              

              <a href="{resetLink}" class="button">Reset Password</a>
              <p>If you did not request a password reset, you can safely ignore this email.</p>
              <p>This link will expire in 10 minutes for your security.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} EduConnect. All rights reserved.</p>
              <p>This is an automated message, please do not reply directly to this email.</p>
          </div>
      </div>
  </body>
  </html>
`;




module.exports.Alert_Suspension_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Account Security Alert</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #f0ad4e;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.8;
          }
          .details-box {
              background-color: #f8f8f8;
              border: 1px solid #ddd;
              border-radius: 5px;
              padding: 15px;
              margin: 20px 0;
          }
          .details-item {
              margin: 10px 0;
          }
          .details-label {
              font-weight: bold;
              display: inline-block;
              min-width: 100px;
              margin-right: 10px;
          }
          .button {
              display: inline-block;
              padding: 12px 25px;
              margin: 20px 0;
              background-color: #5cb85c;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              transition: background-color 0.3s;
          }
          .button:hover {
              background-color: #4cae4c;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">Account Security Alert</div>
          <div class="content">
              <p>Hello {userName},</p>
              <p><strong>Your account has been temporarily suspended for security reasons.</strong></p>
              <p>We detected a login attempt from an unrecognized location or device. To protect your account, we've temporarily suspended access until we can verify your identity.</p>
              
              <div class="details-box">
                  <div class="details-item">
                      <span class="details-label">Date & Time:</span>
                      <strong>${new Date().toLocaleString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                            timeZoneName: 'short'
                        })}
                        </strong>
                  </div>
                  <div class="details-item">
                      <span class="details-label">Device:</span>
                      <strong>{deviceType}</strong>
                  </div>
                  <div class="details-item">
                      <span class="details-label">Location:</span>
                      <strong>{location}</strong>
                  </div>
                  <div class="details-item">
                      <span class="details-label">IP Address:</span>
                      <strong>{ipAddress}</strong>
                  </div>
              </div>
              
              <p>If this was you, please verify your identity and restore access to your account by clicking the button below:</p>
              <a href="{verificationLink}" class="button">Verify Identity</a>
              
              <p>If this wasn't you, please contact our support team immediately at <a href="mailto:support@educonnect.com">support@educonnect.com</a> or call our security hotline at <strong>1-800-XXX-XXXX</strong>.</p>
              
              <p>For your security, the verification link will expire in 24 hours.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} EduConnect. All rights reserved.</p>
              <p>This is an automated security message. Please do not reply directly to this email.</p>
          </div>
      </div>
  </body>
  </html>
`;