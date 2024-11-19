document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
  
    try {
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      document.getElementById('status').innerText = result.message;
  
      if (response.ok) {
        event.target.reset();
      }
    } catch (error) {
      document.getElementById('status').innerText = 'Error al enviar el mensaje.';
    }
  });
  