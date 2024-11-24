//sendgrid.setApiKey('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'); // Reemplaza con tu clave API de SendGrid
//process.env.SENDGRID_API_KEY
//sendgrid


/*const sendgrid = process.env.SENDGRID_API_KEY
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
};*/

/*const sgMail = require('@sendgrid/mail');

// Verificar que la clave API esté definida
if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY no está definida en las variables de entorno.");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

    // Validar que el correo del remitente esté bien definido y sea válido
    if (!email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Faltan campos obligatorios.' }),
      };
    }

    // Configurar el correo
    const mailOptions = {
      to: 'palmabenavidesa650@gmail.com', // Receptor
      from: email, // Remitente (dinámico, debe estar verificado)
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
    await sgMail.send(mailOptions);

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
*/
const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  // Solo aceptamos solicitudes POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método no permitido' }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    const { name, email, subject, message, file, fileName, fileType } = data;

    // Configura el transportador SMTP para Gmail o cualquier otro servicio
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Usar Gmail o tu servicio de preferencia
      auth: {
        user: process.env.GMAIL_USER, // Tu correo de Gmail
        pass: process.env.GMAIL_PASS, // Tu contraseña o app password
      },
    });

    const mailOptions = {
      to: 'palmabenavidesa650@gmail.com', // Correo al que enviarás los formularios
      from: email, // Correo de quien envía
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
              content: file, // Contenido en base64 del archivo
              filename: fileName, // Nombre del archivo
              type: fileType, // Tipo MIME
              disposition: 'attachment',
            },
          ]
        : [],
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

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
