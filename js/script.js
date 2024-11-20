document.getElementById('contactForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch('/.netlify/functions/contact', {
      method: 'POST',
      body: formData,
    });

    const result = await response.text();
    document.getElementById('status').textContent = result;
    form.reset();
  } catch (error) {
    document.getElementById('status').textContent = 'Error al enviar el formulario.';
  }
});
