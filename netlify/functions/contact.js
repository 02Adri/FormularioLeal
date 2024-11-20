const nodemailer = require('nodemailer');  // Usamos nodemailer para enviar el correo

// Configurar el transportador de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "palmabenavidesa650@gmail.com",  // Aquí deberías configurar el correo de Google
    pass: "Adrian1821"   // Aquí deberías configurar la contraseña de Google
  }
});

exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    try {
      // Obtener los datos del formulario
      const { name, email, subject, message, file } = JSON.parse(event.body);

      // Crear el cuerpo del mensaje
      const mailOptions = {
        from: email, // El remitente será el correo del usuario
        to: 'palmabenavidesa650@gmail.com', // El correo al que se enviará
        subject: subject,
        html: `
          <h2>Nuevo mensaje de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <p><strong>Mensaje:</strong> ${message}</p>
        `,
        attachments: [
          {
            filename: file.name,
            content: file.content,
            encoding: 'base64',
          },
        ],
      };

      // Enviar el correo
      await transporter.sendMail(mailOptions);

      // Responder al cliente con un mensaje de éxito
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Correo enviado correctamente' }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Hubo un error al enviar el correo' }),
      };
    }
  } else {
    // Si no es un POST, se devuelve un 405 Method Not Allowed
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método no permitido' }),
    };
  }
};
