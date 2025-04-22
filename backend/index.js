
//inicializamos nuestr servidor de express
const express = require('express');
const cors = require('cors');
const fs=require('fs');
const path=require('path');
const nodemailer = require('nodemailer');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());

//configuracion de almacenamiento para multer
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        const uploadPath=path.join(__dirname,'uploads')
        if(!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath)
        }
         cb(null,uploadPath)
    },
    filename:(req,file,cb)=>{
        cb(null,`$Date.now()}-${file.originalname}`)
    }
});
const upload=multer({storage})

app.post('/api/contact',upload.single('file'),async(req,res)=>{
    const { name, email, subject, message } = req.body;
    const file = req.file
    try {
       /* //guardar el archivo si existe
        let filePath=null
        if(file && fileName){
            const buffer=Buffer.from(file,'base64')
            filePath=path.join(__dirname,'uploads',fileName)
            fs.writeFileSync(filePath,buffer)
        }*/
        //configuramos el correo
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });
        const mailOptions = {
            to:'palmabenavidesa650@gmail.com',
            from: email,
            subject: `Nuevo mensaje de contacto: ${subject}`,
            html:`
                 <h2>Nuevo mensaje del formulario de contacto</h2>
                    <p><strong>Nombre:</strong> ${name}</p>
                    <p><strong>Correo:</strong> ${email}</p>
                     <p><strong>Asunto:</strong> ${subject}</p>
                    <p><strong>Mensaje:</strong> ${message}</p>
                      ${file ? `<p><strong>Archivo:</strong> ${file.originalname}</p>` : ''}
                 `,
            attachments: file ? [{
                filename: file.originalname,
                path: file.path,
                contentType: file.mimetype,
            }] : [],
        }
        await transporter.sendMail(mailOptions)

        return res.status(200).json({message:'El mensaje fue enviado correctamente'})

    } catch (error) {
        console.error(error)
        return res.status(500).json({error:'Hubo un error al enviar el mensaje'})
    }
})

app.listen(PORT,()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})