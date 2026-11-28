(() => {
  const key = "wariddon-appearance";
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  let preference;
  function read() {
    try { return localStorage.getItem(key); } catch { return null; }
  }
  function render() {
    const dark = preference === "dark" || (preference !== "light" && system.matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = dark ? "#0e0e0e" : "#173b38";
    const button = document.querySelector(".appearance-toggle");
    if (button) {
      button.hidden = false;
      button.setAttribute("aria-pressed", String(dark));
    }
  }
  preference = read();
  render();
  system.addEventListener("change", render);
  window.addEventListener("storage", event => {
    if (event.key === key || event.key === null) {
      preference = read();
      render();
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".appearance-toggle");
    if (!button) return;
    render();
    button.addEventListener("click", () => {
      preference = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem(key, preference); } catch {}
      render();
    });
  });
})();
