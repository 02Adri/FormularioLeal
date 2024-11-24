const form = document.getElementById('contactForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const file = formData.get('file');
      const reader = new FileReader();

      reader.onloadend = async () => {
        const data = {
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
          file: reader.result.split(',')[1], // Convertir a Base64
          fileName: file ? file.name : null,
        };

        const response = await fetch('/.netlify/functions/contact', {
          method: 'POST',
          body: JSON.stringify(data),
        });

        const result = await response.json();
        alert(result.message || result.error);
      };

      if (file) {
        reader.readAsDataURL(file);
      } else {
        reader.onloadend();
      }
    });