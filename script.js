//FUNCIONES ESPECIFICAS PARA EL CONTROL DE ENVIAR INFORMACION

/*document.addEventListener("submit", function(event){
   const fileInput=document.getElementById('file')
   if(fileInput.files.length>0){
    const file=fileInput.files[0];
    const allowedExtensions=['pdf','doc','docx','png','jpg','jpeg']
    const fileExtension=file.name.split('.').pop().toLowerCase()

    if(!allowedExtensions.includes(fileExtension)){
        alert('Solo se permiten Archivos PDF,DOC,DOCX,PNG,JPG,JPEG')
        event.preventDefault();
    }else if(file.size>5 *1024*1024){
        alert("El archivo no debe superar los 5 MB")
        event.preventDefault();
    }
   }
});*/
/*document.getElementById("contactForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
        const response = await fetch("http://localhost:8080/FormularioEmail/email.php", {
            method: "POST",
            body: formData,
        });

        const result = await response.text();
        document.getElementById("responseMessage").innerText = result;
    } catch (error) {
        document.getElementById("responseMessage").innerText = "Error al enviar el formulario.";
    }
});
*/
document.getElementById('contactForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const form = new FormData(event.target);
    const fileInput = document.getElementById('file').files[0];
  
    const fileData = fileInput
      ? {
          name: fileInput.name,
          type: fileInput.type,
          content: await toBase64(fileInput),
        }
      : null;
  
    const formData = {
      name: form.get('name'),
      email: form.get('email'),
      subject: form.get('subject'),
      message: form.get('message'),
      file: fileData,
    };
  
    try {
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const result = await response.text();
      document.getElementById('status').textContent = result;
    } catch (error) {
      document.getElementById('status').textContent = 'Error al enviar el formulario.';
    }
  });
  
  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  