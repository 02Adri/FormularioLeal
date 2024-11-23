document.getElementById('contactForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const file = formData.get('file');
  let base64File = null;

  if (file) {
    base64File = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });
  }

  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
    file: base64File,
    fileName: file ? file.name : null,
    fileType: file ? file.type : null,
  };

  const response = await fetch('/.netlify/functions/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();
  if (response.ok) {
    alert('Formulario enviado con éxito.');
  } else {
    alert(`Error: ${result.error}`);
  }
});