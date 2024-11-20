document.getElementById('contactForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch('/contact', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    const status = document.getElementById('status');
    status.textContent = result.message;
    status.style.color = result.success ? 'green' : 'red';

    if (result.success) {
      form.reset();
    }
  } catch (error) {
    document.getElementById('status').textContent = 'Error al enviar el formulario.';
  }
});
