try {
  var t = localStorage.getItem('theme') || 'dark';
  document.documentElement.classList.add(t);
} catch {}
