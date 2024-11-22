const nodemailer = require ('nodemailer');
const querystring = require('querystring'); // Para decodificar datos si es necesario

export   const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Método no permitido',
    };
  }

  // Decodificar el cuerpo si es necesario
  const body = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;

  let formData;
  try {
    formData = querystring.parse(body); // Decodificar datos
  } catch (err) {
    console.error('Error al procesar el formulario:', err);
    return {
      statusCode: 400,
      body: 'Error al procesar el formulario.',
    };
  }

  const { name, email, subject, message } = formData;

  // Configuración del correo
  const mailOptions = {
    from: email,
    to: 'palmabenavidesa650@gmail.com',
    subject: `Nuevo mensaje de contacto: ${subject}`,
    html: `
      <h2>Nuevo mensaje del formulario de contacto</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Correo:</strong> ${email}</p>
      <p><strong>Asunto:</strong> ${subject}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
    `,
  };

  // Configuración de Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'palmabenavidesa650@gmail.com',
      pass: 'Adrian1821', // Reemplaza esto con variables de entorno para mayor seguridad
    },
  });

  // Enviar el correo
   try {
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: 'Formulario enviado con éxito.',
    };
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return {
      statusCode: 500,
      body: 'Error al enviar el correo, intentelo de nuevo.',
    };
  }
};
