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