const MIN_SCALE = 1;
const MAX_SCALE = 4;

export function setupImageLightbox() {
  const overlay = document.querySelector('.js-image-lightbox');
  const img = document.querySelector('.js-lightbox-image');
  const closeBtn = document.querySelector('.js-lightbox-close');
  const images = document.querySelectorAll('.js-zoomable-image');
  if (!overlay || !img || !closeBtn || images.length === 0) return;

  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  const pointers = new Map();
  let pinchStartDistance = 0;
  let pinchStartScale = 1;
  let dragStart = null;
  let tapStart = null;
  const TAP_THRESHOLD = 6;

  const applyTransform = () => {
    img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    img.classList.toggle('zoomed', scale > 1);
    overlay.classList.toggle('zoomed', scale > 1);
  };

  const clampPan = () => {
    const maxX = Math.max(0, (img.offsetWidth * scale - img.offsetWidth) / 2);
    const maxY = Math.max(0, (img.offsetHeight * scale - img.offsetHeight) / 2);
    translateX = Math.min(Math.max(translateX, -maxX), maxX);
    translateY = Math.min(Math.max(translateY, -maxY), maxY);
  };

  const resetZoom = () => {
    scale = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
  };

  const toggleZoom = () => {
    if (scale > 1) {
      resetZoom();
    } else {
      scale = 2;
      translateX = 0;
      translateY = 0;
      applyTransform();
    }
  };

  const open = (src) => {
    img.src = src;
    resetZoom();
    overlay.classList.remove('hidden');
  };

  const close = () => {
    overlay.classList.add('hidden');
  };

  images.forEach((image) => {
    image.addEventListener('click', () => open(image.src));
  });

  closeBtn.addEventListener('click', close);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) close();
  });

  img.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    scale = Math.min(Math.max(scale + delta, MIN_SCALE), MAX_SCALE);
    clampPan();
    applyTransform();
  }, { passive: false });

  img.addEventListener('pointerdown', (e) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2) {
      const pts = Array.from(pointers.values());
      pinchStartDistance = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      pinchStartScale = scale;
      dragStart = null;
      tapStart = null;
    } else if (pointers.size === 1) {
      tapStart = { x: e.clientX, y: e.clientY };
      if (scale > 1) {
        dragStart = { x: e.clientX, y: e.clientY, tx: translateX, ty: translateY };
        img.classList.add('dragging');
      }
    }
  });

  img.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.size === 2) {
      tapStart = null;
      const pts = Array.from(pointers.values());
      const distance = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      scale = Math.min(Math.max(pinchStartScale * (distance / pinchStartDistance), MIN_SCALE), MAX_SCALE);
      clampPan();
      applyTransform();
    } else if (dragStart && pointers.size === 1) {
      translateX = dragStart.tx + (e.clientX - dragStart.x);
      translateY = dragStart.ty + (e.clientY - dragStart.y);
      clampPan();
      applyTransform();
    }
  });

  const endPointer = (e) => {
    if (tapStart && pointers.size === 1) {
      const dx = e.clientX - tapStart.x;
      const dy = e.clientY - tapStart.y;
      if (Math.hypot(dx, dy) < TAP_THRESHOLD) toggleZoom();
    }
    tapStart = null;

    pointers.delete(e.pointerId);
    if (pointers.size === 0) {
      dragStart = null;
      img.classList.remove('dragging');
    }
  };

  img.addEventListener('pointerup', endPointer);
  img.addEventListener('pointercancel', endPointer);
}
