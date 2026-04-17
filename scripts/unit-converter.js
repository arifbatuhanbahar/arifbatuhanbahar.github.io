function parseNumberTR(value) {
  const normalized = String(value ?? "").trim().replace(",", ".");
  if (normalized.length === 0) return { ok: false, num: NaN };
  const num = Number(normalized);
  return { ok: Number.isFinite(num), num };
}

function show(el) {
  el.classList.remove("hidden");
}

function hide(el) {
  el.classList.add("hidden");
}

function formatNumber(num, mode) {
  if (!Number.isFinite(num)) return "-";
  if (mode === "fixed3") return num.toFixed(3);
  if (mode === "compact") return String(Math.round(num * 1000) / 1000);
  return String(num);
}

const converters = {
  C_TO_F: (v) => v * 1.8 + 32,
  F_TO_C: (v) => (v - 32) / 1.8,
  C_TO_K: (v) => v + 273.15,
  K_TO_C: (v) => v - 273.15,

  M_TO_KM: (v) => v / 1000,
  KM_TO_M: (v) => v * 1000,
  KM_TO_MI: (v) => v / 1.609344,
  MI_TO_KM: (v) => v * 1.609344,

  KG_TO_G: (v) => v * 1000,
  G_TO_KG: (v) => v / 1000,
};

document.addEventListener("DOMContentLoaded", () => {
  const forms = Array.from(document.querySelectorAll("form.js-converter"));

  for (const form of forms) {
    const valueInput = form.querySelector('input[name="value"]');
    const typeSelect = form.querySelector('select[name="type"]');
    const clearBtn = form.querySelector("button.js-clear");

    const container = form.closest(".app-card") ?? form;
    const errorBox = container.querySelector(".js-error");
    const resultBox = container.querySelector(".js-result");
    const output = container.querySelector(".js-output");

    const mode = form.getAttribute("data-result-format") || "compact";

    function resetUI() {
      errorBox.textContent = "";
      hide(errorBox);
      hide(resultBox);
      output.textContent = "-";
    }

    function computeAndRender() {
      resetUI();
      const parsed = parseNumberTR(valueInput.value);
      if (!parsed.ok) {
        errorBox.textContent = "Lütfen sayısal bir değer girin (örn: 12,5 veya 12.5).";
        show(errorBox);
        return;
      }

      const type = typeSelect.value;
      const fn = converters[type];
      if (!fn) {
        errorBox.textContent = "Geçersiz dönüşüm tipi seçildi.";
        show(errorBox);
        return;
      }

      const result = fn(parsed.num);
      output.textContent = formatNumber(result, mode);
      show(resultBox);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      computeAndRender();
    });

    valueInput.addEventListener("input", () => {
      if (!valueInput.value.trim()) resetUI();
    });

    clearBtn?.addEventListener("click", () => {
      valueInput.value = "";
      typeSelect.selectedIndex = 0;
      resetUI();
      valueInput.focus();
    });

    resetUI();
  }
});

