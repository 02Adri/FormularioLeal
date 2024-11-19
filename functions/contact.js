const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Método no permitido.',
    };
  }

  const formData = JSON.parse(event.body);

  const { name, email, subject, message, file } = formData;

  // Crear transporte de correo
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Cambia al servicio de correo que uses
    auth: {
      user: 'palmabenavidesa650@gmail.com', // Tu correo
      pass: 'Adrian1821', // Tu contraseña
    },
  });

  const mailOptions = {
    from: email,
    to: 'palmabenavidesa650@gmail.com', // Correo del bufete
    subject: `Contacto: ${subject}`,
    html: `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Correo:</strong> ${email}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
    `,
    attachments: file
      ? [
          {
            filename: file.name,
            content: Buffer.from(file.content, 'base64'),
            contentType: file.type,
          },
        ]
      : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: 'Formulario enviado exitosamente.',
    };
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return {
      statusCode: 500,
      body: 'Error al enviar el formulario.',
    };
  }
};
