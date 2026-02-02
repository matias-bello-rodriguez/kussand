const serviceId = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY;

const loadEmailJs = (() => {
  let cached;
  return () => {
    if (!cached) {
      cached = import('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/+esm')
        .then((mod) => mod.default ?? mod);
    }
    return cached;
  };
})();

const setupContactModal = () => {
  const dialog = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('close-modal');
  const openBtns = document.querySelectorAll('.trigger-contact-modal');
  const form = dialog?.querySelector('form');
  const submitBtn = dialog?.querySelector('.submit-btn');
  const statusEl = dialog?.querySelector('.form-status');

  if (!dialog) return;

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    });
  });

  const closeDialog = () => {
    dialog.close();
    document.body.style.overflow = '';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDialog);
  }

  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      closeDialog();
    }
  });

  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
  });

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!serviceId || !templateId || !publicKey) {
      if (statusEl) {
        statusEl.textContent = 'Falta configurar EmailJS. Revisa las variables de entorno.';
      }
      return;
    }

    const formData = new FormData(form);
    const params = {
      from_name: String(formData.get('name') ?? ''),
      from_email: String(formData.get('email') ?? ''),
      company: String(formData.get('company') ?? ''),
      message: String(formData.get('message') ?? ''),
    };

    if (submitBtn) submitBtn.disabled = true;
    if (statusEl) statusEl.textContent = 'Enviando…';

    try {
      const emailjs = await loadEmailJs();
      await emailjs.send(serviceId, templateId, params, { publicKey });
      if (statusEl) statusEl.textContent = 'Propuesta enviada. Te responderemos pronto.';
      form.reset();
    } catch (error) {
      if (statusEl) statusEl.textContent = 'No se pudo enviar. Intenta nuevamente.';
      console.error(error);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupContactModal);
} else {
  setupContactModal();
}
