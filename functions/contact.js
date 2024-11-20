const formidable =require('formidable');  // Importar formidable
const nodemailer = require('nodemailer');

export const handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    if (event.httpMethod !== 'POST') {
      return resolve({
        statusCode: 405,
        body: 'Método no permitido',
      });
    }

    // Decodificar el cuerpo si es necesario
    const body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('binary')
      : event.body;

    // Configuración de formidable
    const form = new formidable.IncomingForm();
    form.parse(event, (err, fields, files) => {
      if (err) {
        console.error('Error al procesar el formulario:', err);
        return reject({
          statusCode: 500,
          body: 'Error al procesar el formulario.',
        });
      }

      // Extraer los datos del formulario
      const { name, email, subject, message } = fields;
      const file = files.file; // El archivo que se sube

      // Configuración de Nodemailer
      const mailOptions = {
        from: email,
        to: 'palmabenavidesa650@gmail.com',
        subject: `Nuevo mensaje de contacto: ${subject}`,
        html: `
          <h2>Nuevo mensaje del formulario de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <p><strong>Mensaje:</strong> ${message}</p>
        `,
        attachments: file
          ? [
              {
                filename: file.originalFilename,
                content: file.filepath, // Utilizando la ruta temporal del archivo
                contentType: file.mimetype,
              },
            ]
          : [],
      };

      // Configuración de Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'palmabenavidesa650@gmail.com',
          pass: 'Adrian1821', // Usa variables de entorno para contraseñas en producción
        },
      });

      // Enviar el correo
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error al enviar correo:', error);
          return reject({
            statusCode: 500,
            body: 'Error al enviar el correo.',
          });
        }

        resolve({
          statusCode: 200,
          body: 'Formulario enviado con éxito.',
        });
      });
    });
  });
};
