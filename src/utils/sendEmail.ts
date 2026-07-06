export const sendEmail = async (to: string, subject: string, html: string) => {
  // Temporary stub: log the email instead of sending.
  console.log("sendEmail stub called:", { to, subject });
  // In production, replace with nodemailer or Resend API call.
  return Promise.resolve(true);
};

export default sendEmail;
