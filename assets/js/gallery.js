// Full-size photo viewer for the travel page. Arrow keys move between photos, Esc closes.
(() => {
  const dialog = document.querySelector('[data-lightbox]');
  const items = [...document.querySelectorAll('[data-full]')];
  if (!dialog || !items.length || typeof dialog.showModal !== 'function') return;

  const img = dialog.querySelector('img');
  const title = dialog.querySelector('[data-lb-title]');
  const desc = dialog.querySelector('[data-lb-desc]');
  let index = 0;
  let opener = null;

  const show = (i) => {
    index = (i + items.length) % items.length;
    const item = items[index];
    img.src = item.dataset.full;
    img.alt = item.querySelector('img').alt;
    title.textContent = item.dataset.title;
    desc.textContent = item.dataset.desc;
  };

  items.forEach((item, i) => item.addEventListener('click', () => {
    opener = item;
    show(i);
    dialog.showModal();
  }));

  dialog.querySelector('[data-lb-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-lb-prev]').addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-lb-next]').addEventListener('click', () => show(index + 1));

  // A click on the dark backdrop (not the photo or a button) closes the viewer.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.classList.contains('lightbox__inner')) dialog.close();
  });

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });

  dialog.addEventListener('close', () => {
    img.removeAttribute('src');
    opener?.focus();
  });
})();
