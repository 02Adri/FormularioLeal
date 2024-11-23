const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey('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'); // Reemplaza con tu clave API de SendGrid

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' }),
    };
  }

  try {
    // Parsear los datos enviados desde el formulario
    const data = JSON.parse(event.body);

    const { name, email, subject, message, file, fileName, fileType } = data;

    // Configurar el correo
    const mailOptions = {
      to: 'palmabenavidesa650@gmail.com', // Receptor
      from: email, // Remitente (dinámico)
      subject: `Nuevo mensaje de contacto: ${subject}`,
      html: `
        <h2>Nuevo mensaje del formulario de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Correo:</strong> ${email}</p>
        <p><strong>Asunto:</strong> ${subject}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
        ${fileName ? `<p><strong>Archivo adjunto:</strong> ${fileName}</p>` : ''}
      `,
      attachments: file
        ? [
            {
              content: file, // Contenido en base64
              filename: fileName, // Nombre del archivo
              type: fileType, // Tipo MIME
              disposition: 'attachment', // Define que es un archivo adjunto
            },
          ]
        : [],
    };

    // Enviar correo
    await sendgrid.send(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Formulario enviado con éxito.' }),
    };
  } catch (error) {
    console.error('Error al enviar correo:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al enviar el formulario.' }),
    };
  }
};
