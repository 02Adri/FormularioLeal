const form = document.getElementById('contactForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const file = formData.get('file');
      //const reader = new FileReader();

     // reader.onloadend = async () => {
        const data = {
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
          file: file ? await tobBse64(file):null, // Convertir a Base64
          fileName: file?.name || null,
          fileType:file?.type || null,
        };
       //Detectar entorno
       const isNetlify=window.location.hostname.includes('netlify.app')
       const Api_URL=isNetlify?'/.netlify/functions/contact':'https://formularioleal.onrender.com/api/contact'
        try{
          
        const response = await fetch('https://formularioleal.onrender.com/api/contact', {
          method: 'POST',
          body: formData,
        });
          //incluimos response.ok
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Server responded with an error:', errorText);
            alert('Error al enviar el mensaje: ' + response.status);
            return;
          }
        const result = await response.json();
        alert(result.message || result.error);
         form.reset()
      //};
      }catch(error){
        console.error(error)
        alert('Hubo fallos al enviar el asunto')
      }
    /*  if (file) {
        reader.readAsDataURL(file);
      } else {
        reader.onloadend();
      }*/
    });

    //Funcion para convertir archivo a base64
    function tobBse64(file){
      return new Promise((resolve,reject)=>{
        const reader=new FileReader()
        reader.readAsDataURL(file);
        reader.onload=()=>resolve(reader.result.split(',')[1])
        reader.onerror=(error)=>reject(error)
      })
    }