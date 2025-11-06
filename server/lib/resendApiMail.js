import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log(`Mail send successfullt to: ${to}`);
  } catch (error) {
    console.log("Error in sending email: ", error);
  }
};

