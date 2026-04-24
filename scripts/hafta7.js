function setThemeToggleLabel(btn, isDark) {
  if (!btn) return;
  btn.textContent = isDark ? "Aydınlık Tema" : "Karanlık Tema";
}

function showAlert(alertEl, message) {
  if (!alertEl) return;
  alertEl.textContent = message;
  alertEl.classList.remove("d-none");
}

function hideAlert(alertEl) {
  if (!alertEl) return;
  alertEl.textContent = "";
  alertEl.classList.add("d-none");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = String(text ?? "");
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const focusNameBtn = document.getElementById("focusNameBtn");
  const scrollResultBtn = document.getElementById("scrollResultBtn");

  const form = document.getElementById("applicationForm");
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const ticketTypeSelect = document.getElementById("ticketType");
  const noteTextarea = document.getElementById("note");
  const consentCheckbox = document.getElementById("consent");
  const resetBtn = document.getElementById("resetBtn");

  const alertEl = document.getElementById("formAlert");
  const resultContent = document.getElementById("resultContent");
  const resultArea = document.getElementById("resultArea");

  const storedTheme = localStorage.getItem("hafta7-theme");
  const initialDark = storedTheme === "dark";
  document.body.classList.toggle("theme-dark", initialDark);
  setThemeToggleLabel(themeToggleBtn, initialDark);

  themeToggleBtn?.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("theme-dark");
    localStorage.setItem("hafta7-theme", isDark ? "dark" : "light");
    setThemeToggleLabel(themeToggleBtn, isDark);
  });

  focusNameBtn?.addEventListener("click", () => {
    fullNameInput?.focus();
  });

  scrollResultBtn?.addEventListener("click", () => {
    resultArea?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  function renderSummary() {
    const fullName = (fullNameInput?.value ?? "").trim();
    const email = (emailInput?.value ?? "").trim();
    const ticketType = (ticketTypeSelect?.value ?? "").trim();
    const note = (noteTextarea?.value ?? "").trim();
    const consent = Boolean(consentCheckbox?.checked);

    const missing = [];
    if (!fullName) missing.push("Ad Soyad");
    if (!email) missing.push("E-posta");
    if (!ticketType) missing.push("Katılım Türü");
    if (!consent) missing.push("Onay");

    if (missing.length > 0) {
      showAlert(alertEl, `Lütfen eksik alanları doldurun: ${missing.join(", ")}.`);
      return;
    }

    hideAlert(alertEl);

    const safeNote = note ? escapeHtml(note) : "<span class=\"text-body-secondary\">(Not girilmedi)</span>";
    const now = new Date();
    const dateTR = now.toLocaleString("tr-TR");

    resultContent.innerHTML = `
      <div class="mb-2"><span class="badge text-bg-success">Başarılı</span> <span class="text-body-secondary">(${escapeHtml(dateTR)})</span></div>
      <div class="mb-1"><strong>Ad Soyad:</strong> ${escapeHtml(fullName)}</div>
      <div class="mb-1"><strong>E-posta:</strong> ${escapeHtml(email)}</div>
      <div class="mb-1"><strong>Katılım:</strong> ${escapeHtml(ticketType)}</div>
      <div class="mt-2"><strong>Not:</strong><div class="mt-1">${safeNote}</div></div>
    `;

    resultArea?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    renderSummary();
  });

  resetBtn?.addEventListener("click", () => {
    hideAlert(alertEl);
    if (resultContent) resultContent.textContent = "Henüz başvuru yapılmadı.";
  });
});

