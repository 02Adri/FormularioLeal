const nodemailer = require('nodemailer');
// Asegúrate de usar esta importación correcta
const fs = require('fs');
const path = require('path');
const util = require('util');

const Busboy = require('busboy');


// Configurar el transporte de correo con Nodemailer (Asegúrate de poner tu SMTP real)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'palmabenavidesa650@gmail.com',
    pass: 'Adrian1821'
  }
});

// Función Netlify
exports.handler = async (event, context) => {
  return new Promise((resolve, reject) => {
    if (event.httpMethod !== 'POST') {
      return reject({
        statusCode: 405,
        body: 'Método no permitido',
      });
    }

    const busboy =Busboy({ headers: event.headers });
    let formData = {};
    let fileBuffer;
    
    busboy.on('field', (fieldname, val) => {
      formData[fieldname] = val;
    });

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      fileBuffer = [];
      file.on('data', (data) => {
        fileBuffer.push(data);
      });
      file.on('end', () => {
        formData[fieldname] = Buffer.concat(fileBuffer);
        formData.fileName = filename;
        formData.fileType = mimetype;
      });
    });

    busboy.on('finish', () => {
      const { name, email, subject, message, fileName, fileType } = formData;

      const mailOptions = {
        from: email, // El correo de quien lo envía
        to: 'palmabenavidesa650@gmail.com', // Correo del bufete
        subject: `Nuevo mensaje de contacto: ${subject}`,
        html: `
          <h2>Nuevo mensaje del formulario de contacto</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Correo:</strong> ${email}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <p><strong>Mensaje:</strong> ${message}</p>
          ${fileName ? `<p><strong>Archivo adjunto:</strong> ${fileName}</p>` : ''}
        `,
        attachments: fileName ? [{
          filename: fileName,
          content: formData[fileName],
          encoding: 'base64',
          contentType: fileType
        }] : []
      };

      // Enviar el correo
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
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

    busboy.end(event.body);
  });
};
