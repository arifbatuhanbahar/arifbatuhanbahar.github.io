function parseNumberTR(value) {
  const normalized = String(value ?? "").trim().replace(",", ".");
  if (normalized.length === 0) return { ok: false, num: NaN };
  const num = Number(normalized);
  return { ok: Number.isFinite(num), num };
}

function clampGrade(num) {
  return Math.max(0, Math.min(100, num));
}

function letterGrade(avg) {
  if (avg >= 90) return "AA";
  if (avg >= 85) return "BA";
  if (avg >= 80) return "BB";
  if (avg >= 75) return "CB";
  if (avg >= 70) return "CC";
  if (avg >= 65) return "DC";
  if (avg >= 60) return "DD";
  if (avg >= 50) return "FD";
  return "FF";
}

function show(el) {
  el.classList.remove("hidden");
}

function hide(el) {
  el.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("gradeForm");
  const clearBtn = document.getElementById("clearGrade");

  const nameInput = document.getElementById("fullName");
  const midtermInput = document.getElementById("midterm");
  const finalInput = document.getElementById("final");

  const errorBox = document.getElementById("gradeError");
  const resultBox = document.getElementById("gradeResult");

  const resName = document.getElementById("resName");
  const resAvg = document.getElementById("resAvg");
  const resLetter = document.getElementById("resLetter");
  const resBadge = document.getElementById("resBadge");

  function resetUI() {
    errorBox.textContent = "";
    hide(errorBox);
    hide(resultBox);
  }

  function validateGrade(raw, fieldName) {
    const parsed = parseNumberTR(raw);
    if (!parsed.ok) {
      return { ok: false, message: `${fieldName} sayısal olmalıdır (0 - 100).` };
    }
    if (parsed.num < 0 || parsed.num > 100) {
      return { ok: false, message: `${fieldName} 0 ile 100 arasında olmalıdır.` };
    }
    return { ok: true, value: parsed.num };
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    resetUI();

    const fullName = String(nameInput.value ?? "").trim();
    if (fullName.length < 2) {
      errorBox.textContent = "Ad Soyad en az 2 karakter olmalıdır.";
      show(errorBox);
      return;
    }

    const v1 = validateGrade(midtermInput.value, "Vize notu");
    if (!v1.ok) {
      errorBox.textContent = v1.message;
      show(errorBox);
      return;
    }

    const v2 = validateGrade(finalInput.value, "Final notu");
    if (!v2.ok) {
      errorBox.textContent = v2.message;
      show(errorBox);
      return;
    }

    const avgRaw = v1.value * 0.4 + v2.value * 0.6;
    const avg = clampGrade(avgRaw);
    const avgFixed = avg.toFixed(2);
    const letter = letterGrade(avg);
    const passed = avg >= 50;

    resName.textContent = fullName;
    resAvg.textContent = avgFixed;
    resLetter.textContent = letter;

    resBadge.textContent = `Durum: ${passed ? "Geçti" : "Kaldı"}`;
    resBadge.classList.remove("app-badge-success", "app-badge-danger");
    resBadge.classList.add(passed ? "app-badge-success" : "app-badge-danger");

    show(resultBox);
  });

  clearBtn.addEventListener("click", () => {
    nameInput.value = "";
    midtermInput.value = "";
    finalInput.value = "";
    resetUI();
    nameInput.focus();
  });
});

