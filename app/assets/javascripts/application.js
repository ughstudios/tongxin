document.addEventListener('turbo:load', () => {
  document.querySelectorAll('.lightbox-target').forEach(el => {
    el.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.className = 'lightbox-overlay';
      const clone = el.cloneNode(true);
      clone.classList.remove('max-w-full');
      overlay.appendChild(clone);
      overlay.addEventListener('click', () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });

  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('like-animate');
      setTimeout(() => btn.classList.remove('like-animate'), 200);
    });
  });
});
