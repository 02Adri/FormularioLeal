const nodemailer = require('nodemailer');
//const Busboy = require('busboy');
const { Readable } = require('stream');
import Busboy from 'busboy';
// Configurar el transporte de correo con Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'palmabenavidesa650@gmail.com',
    pass: 'Adrian1821',
  },
});

// Función Netlify
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Método no permitido',
    };
  }

  return new Promise((resolve, reject) => {
    // Manejar el cuerpo base64 si es necesario
    const body = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('binary')
      : event.body;

    const busboy = new Busboy({ headers: event.headers });
    const formData = {};
    let fileBuffer;
    let fileName, fileType;

    // Procesar campos del formulario
    busboy.on('field', (fieldname, val) => {
      formData[fieldname] = val;
    });

    // Procesar archivos adjuntos
    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const chunks = [];
      file.on('data', (data) => chunks.push(data));
      file.on('end', () => {
        fileBuffer = Buffer.concat(chunks);
        fileName = filename;
        fileType = mimetype;
      });
    });

    busboy.on('finish', () => {
      const { name, email, subject, message } = formData;

      const mailOptions = {
        from: email, // El correo de quien envía
        to: 'palmabenavidesa650@gmail.com', // Correo destino
        subject: `Nuevo mensaje de contacto: ${subject}`,
        html: `
          <h2>Nuevo mensaje del formulario de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <p><strong>Mensaje:</strong> ${message}</p>
          ${fileName ? `<p><strong>Archivo adjunto:</strong> ${fileName}</p>` : ''}
        `,
        attachments: fileName
          ? [
              {
                filename: fileName,
                content: fileBuffer,
                contentType: fileType,
              },
            ]
          : [],
      };

      // Enviar correo
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

    // Convertir el cuerpo en un flujo legible
    const readableStream = Readable.from(body);
    readableStream.pipe(busboy);
  });
};
