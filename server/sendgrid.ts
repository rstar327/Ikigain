import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable not set - email functionality disabled");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("SendGrid API key not configured - email not sent");
    return false;
  }

  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    console.error('Error details:', error.response?.body);
    return false;
  }
}

export async function sendIkigaiResultsEmail(
  email: string,
  primaryType: string,
  overallScore: number,
  sessionId: number
): Promise<boolean> {
  const subject = "Your Ikigai Test Results Are Ready! 🌟";
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin-bottom: 10px;">Your Ikigai Results</h1>
        <p style="color: #666; font-size: 16px;">Discover your life's purpose and career path</p>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #1e40af; margin-bottom: 15px;">Your Primary Type: ${primaryType}</h2>
        <p style="color: #374151; font-size: 16px; margin-bottom: 10px;">
          Your overall Ikigai score: <strong>${overallScore}/100</strong>
        </p>
        <p style="color: #6b7280; font-size: 14px;">
          This represents how aligned you are with your life's purpose across the four key areas: 
          passion, mission, vocation, and profession.
        </p>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h3 style="color: #1f2937; margin-bottom: 15px;">What's Next?</h3>
        <ul style="color: #374151; line-height: 1.6;">
          <li>Review your detailed results and career recommendations</li>
          <li>Explore your personalized development roadmap</li>
          <li>Consider upgrading for premium insights and AI mentorship</li>
          <li>Join our community of purpose-driven individuals</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="https://www.ikigain.org/results/${sessionId}" 
           style="display: inline-block; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          View Your Complete Results
        </a>
      </div>
      
      <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
          Thank you for discovering your Ikigai with us!
        </p>
        <p style="color: #9ca3af; font-size: 12px;">
          If you no longer wish to receive these emails, you can 
          <a href="#" style="color: #6b7280;">unsubscribe here</a>.
        </p>
      </div>
    </div>
  `;

  const text = `
Your Ikigai Results Are Ready!

Your Primary Type: ${primaryType}
Your Overall Score: ${overallScore}/100

This represents how aligned you are with your life's purpose across passion, mission, vocation, and profession.

View your complete results: https://www.ikigain.org/results/${sessionId}

Thank you for discovering your Ikigai with us!
  `;

  // Use a verified sender email - this should be configured in your SendGrid account
  // You can change this to any verified sender address in your SendGrid settings
  const verifiedSender = process.env.SENDGRID_VERIFIED_SENDER || "karlisvilmanis@gmail.com";
  
  return await sendEmail({
    to: email,
    from: verifiedSender,
    subject,
    html,
    text
  });
}