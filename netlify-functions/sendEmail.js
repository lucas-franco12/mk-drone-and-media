const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const body = JSON.parse(event.body);

  const { firstName, lastName, email, number, message } = body;

  const transporterToDev = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.DEV_GMAIL_USER,
      pass: process.env.DEV_GMAIL_PASSWORD,
    },
  });

  const mailOptionsDev = {
    from: email,
    to: 'lukefranc3@gmail.com',
    subject: `MK Drone and Media: New Message from ${email}`,
    text: `
    First name: ${firstName}
    Last name: ${lastName}
    Email: ${email}
    Phone number: ${number}
    Message: 
    ${message}
    `,
  };

  try {
    await transporterToDev.sendMail(mailOptionsDev);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Email sending failed', error }),
    };
  }
};
