const bank = document.querySelector(".bank");
const grid = document.querySelector(".grid");
const modeSelect = document.getElementById("modeSelect");
const modeBtn = document.getElementById("modeBtn");
const checkBtn = document.getElementById("checkBtn");
const resetBtn = document.getElementById("resetBtn");
const newBtn = document.getElementById("newBtn");
const result = document.getElementById("result");

let dragAnswerId = null;

const TOUCH_MOVE_PX = 12;
const HOLD_MS = 520;

let activeTouch = null;

const ITEMS = [
  // Convencional (sin aumento)
  { signal: "Via libre condicional", context: "Convencional", answer: "Tipo >160 -> 160 / Tipo ≤160 -> Tipo", family: "conv", plus: false },
  { signal: "Anuncio de parada", context: "Convencional", answer: "Tipo >100 -> 80 / Tipo ≤100 -> 60", family: "conv", plus: false },
  { signal: "Anuncio de parada inmediata", context: "Convencional", answer: "Tipo >100 -> 80 / Tipo ≤100 -> 60", family: "conv", plus: false },
  { signal: "Parada (baliza previa)", context: "Convencional", answer: "Tipo >100 -> 60 / Tipo ≤100 -> 50", family: "conv", plus: false },
  { signal: "Parada (acercándose a baliza de señal)", context: "Convencional", answer: "Tipo >100 -> 30 / Tipo ≤100 -> 25", family: "conv", plus: false },
  { signal: "Anuncio de parada y Anuncio de parada", context: "Convencional", answer: "60 km/h", family: "conv", plus: false },
  { signal: "Anuncio de parada y Anuncio de parada inmediata", context: "Convencional", answer: "60 km/h", family: "conv", plus: false },
  { signal: "Anuncio de parada inmediata y Anuncio de parada inmediata", context: "Convencional", answer: "60 km/h", family: "conv", plus: false },
  { signal: "Anuncio de precaucion", context: "Convencional", answer: "Tipo >100 -> 80 / Tipo ≤100 -> 60", family: "conv", plus: false },
  { signal: "Preanuncio de parada", context: "Convencional", answer: "Tipo >100 -> 80 / Tipo ≤100 -> 60", family: "conv", plus: false },
  { signal: "Baliza previa (2a senal)", context: "Preanuncio de parada - Anuncio de parada", answer: "60 km/h", family: "conv", plus: false },
  { signal: "Baliza senal (2a senal)", context: "Preanuncio de parada - Anuncio de parada inmediata", answer: "60 km/h", family: "conv", plus: false },
  { signal: "CSV y LTV/CSV", context: "Convencional", answer: "60 km/h", family: "conv", plus: false },
  { signal: "Paso a nivel sin proteger", context: "Convencional", answer: "VCF inicial -> 30 / VCF cuando llegue a 30 -> 80", family: "conv", plus: false },
  { signal: "Paso por desvio", context: "Convencional", answer: "60 km/h", family: "conv", plus: false },

  // Convencional (con aumento)
  { signal: "Anuncio de parada y Anuncio de parada", context: "Convencional con aumento", answer: "100 km/h", family: "conv", plus: true },
  { signal: "Anuncio de parada y Anuncio de parada inmediata", context: "Convencional con aumento", answer: "100 km/h", family: "conv", plus: true },
  { signal: "Anuncio de parada inmediata y Anuncio de parada inmediata", context: "Convencional con aumento", answer: "100 km/h", family: "conv", plus: true },
  { signal: "Baliza previa (2a senal)", context: "Preanuncio de parada - Anuncio de parada", answer: "Tipo >100 -> 90 / Tipo ≤100 -> 60", family: "conv", plus: true },
  { signal: "Baliza senal (2a senal)", context: "Preanuncio de parada - Anuncio de parada inmediata", answer: "Tipo >100 -> 80 / Tipo ≤100 -> 60", family: "conv", plus: true },
  { signal: "CSV y LTV/CSV", context: "Convencional con aumento", answer: "Tipo >100 -> 100 / Tipo ≤100 -> Tipo", family: "conv", plus: true },
  { signal: "Rebase autorizado en parada (baliza previa)", context: "Convencional con aumento", answer: "100 km/h (sin aumento: 40)", family: "conv", plus: true },

  // Alta velocidad (sin aumento)
  { signal: "Parada (baliza previa)", context: "Alta velocidad", answer: "Tipo >100 -> 60 / Tipo ≤100 -> 50", family: "av", plus: false },
  { signal: "Parada (acercándose a baliza de señal)", context: "Alta velocidad", answer: "Tipo >100 -> 30 / Tipo ≤100 -> 25", family: "av", plus: false },
  { signal: "Anuncio de parada inmediata", context: "Alta velocidad", answer: "Tipo >100 -> 100 / Tipo ≤100 -> Tipo", family: "av", plus: false },
  { signal: "Anuncio de parada", context: "Alta velocidad", answer: "Tipo >100 -> 100 / Tipo ≤100 -> Tipo", family: "av", plus: false },
  { signal: "Anuncio de precaucion", context: "Alta velocidad", answer: "Tipo >100 -> 100 / Tipo ≤100 -> Tipo", family: "av", plus: false },
  { signal: "Preanuncio de parada", context: "Alta velocidad", answer: "Tipo >100 -> 100 / Tipo ≤100 -> 80", family: "av", plus: false },
  { signal: "CSV y LTV/CSV", context: "Alta velocidad", answer: "Tipo >100 -> 100 / Tipo ≤100 -> Tipo", family: "av", plus: false },
  { signal: "Paso a nivel sin proteger", context: "Alta velocidad", answer: "VCF inicial -> 30 / VCF cuando llegue a 30 -> 80", family: "av", plus: false },
  { signal: "Baliza previa (2a senal)", context: "Preanuncio de parada - Anuncio de parada (AV)", answer: "Tipo ≥100 -> 100 / Tipo <100 -> 80", family: "av", plus: false },
  { signal: "Baliza senal (2a senal)", context: "Preanuncio de parada - Anuncio de parada inmediata (AV)", answer: "Tipo ≥100 -> 90 / Tipo <100 -> 60", family: "av", plus: false },

  // Alta velocidad (con aumento)
  { signal: "Via libre condicional", context: "Alta velocidad con aumento", answer: "Tipo >160 -> 160 / Tipo ≤160 -> Tipo", family: "av", plus: true },
  { signal: "Preanuncio de parada", context: "Alta velocidad con aumento", answer: "Tipo >140 -> 140 / Tipo ≤140 -> Tipo", family: "av", plus: true },
  { signal: "Preanuncio + anuncio/parada inmediata", context: "Alta velocidad con aumento", answer: "Tipo ≥140 -> 120 / Tipo <140 -> Tipo", family: "av", plus: true },
  { signal: "Baliza senal (2a senal)", context: "Preanuncio de parada - Anuncio de parada inmediata (AV)", answer: "Tipo ≥120 -> 100 / Tipo <120 -> Tipo", family: "av", plus: true },
  { signal: "CSV y LTV/CSV", context: "Alta velocidad con aumento", answer: "Tipo >160 -> 160 / Tipo ≤160 -> Tipo", family: "av", plus: true },
  { signal: "Paso por desvio", context: "Alta velocidad con aumento", answer: "Tipo >160 -> 160 / Tipo ≤160 -> Tipo", family: "av", plus: true }
];

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalizeAnswer(text) {
  return (text || "")
    .replace(/\//g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function getSymbolType(item) {
  if (item.signal.includes("Paso a nivel sin proteger")) return "paso-nivel-sin-proteger";
  if (item.signal.includes("Rebase autorizado en parada")) return "rebase-parada";
  if (item.signal.includes("Parada (baliza previa)")) return "rebase-autorizado";
  if (item.signal.includes("Parada (acercándose a baliza de señal)")) return "rebase-autorizado";
  if (item.context.includes("Preanuncio de parada - Anuncio de parada inmediata")) return "preanuncio-mas-inmediata";
  if (item.context.includes("Preanuncio de parada - Anuncio de parada")) return "preanuncio-mas-anuncio";
  if (item.signal.includes("Preanuncio de parada - Anuncio de parada inmediata")) return "preanuncio-mas-inmediata";
  if (item.signal.includes("Preanuncio de parada - Anuncio de parada")) return "preanuncio-mas-anuncio";
  if (item.signal.includes("Anuncio de precaucion")) return "anuncio-precaucion";
  if (item.signal.includes("CSV y LTV/CSV")) return "csv-ltv";
  if (item.signal.includes("Rebase autorizado")) return "rebase-autorizado";
  if (item.signal.includes("Anuncio de parada inmediata y Anuncio de parada inmediata")) return "inmediata-mas-inmediata";
  if (item.signal.includes("Anuncio de parada y Anuncio de parada inmediata")) return "anuncio-parada-mas-inmediata";
  if (item.signal.includes("Preanuncio + anuncio/parada inmediata")) return "anuncio-anuncio";
  if (item.signal.includes("Preanuncio de parada")) return "preanuncio-parada";
  if (item.signal.includes("Anuncio de parada y Anuncio de parada")) return "anuncio-anuncio";
  if (item.signal === "Anuncio de parada inmediata") return "anuncio-parada-inmediata";
  if (item.signal.includes("Via libre")) return "via-libre";
  if (item.signal.includes("Anuncio de parada inmediata")) return "double-yellow";
  if (item.signal.includes("Anuncio de parada")) return "yellow";
  if (item.signal.includes("Baliza previa")) return "pair-yellow";
  if (item.signal.includes("Baliza senal")) return "pair-yellow-green";
  if (item.signal.includes("Paso por desvio")) return "switch";
  if (item.signal.includes("Paso a nivel")) return "cross";
  return "yellow";
}

function symbolHtml(type) {
  return `<div class="sig-symbol sprite-${type}" aria-hidden="true"></div>`;
}

function findDropZoneAt(x, y) {
  const stack = document.elementsFromPoint(x, y);
  for (let i = 0; i < stack.length; i += 1) {
    const zone = stack[i].closest(".drop-zone");
    if (zone) return zone;
  }
  const zones = [...document.querySelectorAll(".drop-zone")];
  for (let i = 0; i < zones.length; i += 1) {
    const r = zones[i].getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return zones[i];
  }
  return null;
}

function liftTokenTouchDrag(token, clientX, clientY) {
  const r = token.getBoundingClientRect();
  token._touchDrag = {
    offsetX: clientX - r.left,
    offsetY: clientY - r.top,
    originParent: token.parentNode,
    originNext: token.nextSibling,
    baseLeft: r.left,
    baseTop: r.top,
    liftClientX: clientX,
    liftClientY: clientY
  };
  document.body.appendChild(token);
  token.classList.add("token--touch-dragging");
  token.style.position = "fixed";
  token.style.left = `${r.left}px`;
  token.style.top = `${r.top}px`;
  token.style.transform = "translate(0px, 0px)";
  token.style.width = `${r.width}px`;
  token.style.maxWidth = `${r.width}px`;
  token.style.zIndex = "10000";
  token.style.pointerEvents = "none";
  token.style.boxSizing = "border-box";
  token.style.webkitBackfaceVisibility = "hidden";
  token.style.backfaceVisibility = "hidden";
}

function moveTokenTouchDrag(token, clientX, clientY) {
  const d = token._touchDrag;
  if (!d) return;
  const dx = clientX - d.liftClientX;
  const dy = clientY - d.liftClientY;
  token.style.transform = `translate(${dx}px, ${dy}px)`;
}

function endTokenTouchDrag(token) {
  const d = token._touchDrag;
  token.classList.remove("token--touch-dragging");
  token.style.position = "";
  token.style.left = "";
  token.style.top = "";
  token.style.transform = "";
  token.style.width = "";
  token.style.maxWidth = "";
  token.style.zIndex = "";
  token.style.pointerEvents = "";
  token.style.boxSizing = "";
  token.style.webkitBackfaceVisibility = "";
  token.style.backfaceVisibility = "";
  delete token._touchDrag;
  return d || null;
}

function restoreTokenToOrigin(token, d) {
  if (!d || !d.originParent) return;
  if (d.originNext && d.originNext.parentNode === d.originParent) {
    d.originParent.insertBefore(token, d.originNext);
  } else {
    d.originParent.appendChild(token);
  }
}

function addTokenEvents(token) {
  let holdTimer = null;

  function clearHold() {
    if (holdTimer) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
  }

  function startHoldIfInCell() {
    clearHold();
    if (!token.closest(".drop-zone")) return;
    holdTimer = setTimeout(() => {
      holdTimer = null;
      if (token.closest(".drop-zone")) {
        bank.appendChild(token);
        clearFeedback();
      }
      if (activeTouch && activeTouch.token === token) activeTouch = null;
      document.querySelectorAll(".drop-zone").forEach((z) => z.classList.remove("over"));
    }, HOLD_MS);
  }

  token.addEventListener("dragstart", (e) => {
    clearHold();
    dragAnswerId = token.dataset.answerId;
    e.dataTransfer.setData("text/plain", dragAnswerId);
  });

  token.addEventListener("mousedown", startHoldIfInCell);
  token.addEventListener("mouseup", clearHold);
  token.addEventListener("mouseleave", clearHold);

  token.addEventListener(
    "touchstart",
    (e) => {
      const t = e.changedTouches[0];
      if (!t) return;
      clearHold();
      activeTouch = {
        token,
        touchId: t.identifier,
        startX: t.clientX,
        startY: t.clientY,
        moved: false,
        dragging: false,
        holdTimer: null
      };
      if (token.closest(".drop-zone")) {
        activeTouch.holdTimer = setTimeout(() => {
          if (!activeTouch || activeTouch.token !== token || activeTouch.moved) return;
          if (token.closest(".drop-zone")) {
            bank.appendChild(token);
            clearFeedback();
          }
          activeTouch = null;
          document.querySelectorAll(".drop-zone").forEach((z) => z.classList.remove("over"));
        }, HOLD_MS);
      }
    },
    { passive: true }
  );
}

function clearFeedback() {
  [...document.querySelectorAll(".drop-zone")].forEach((zone) => zone.classList.remove("correct", "wrong"));
  [...document.querySelectorAll(".feedback")].forEach((f) => {
    f.textContent = "";
    f.classList.remove("ok", "bad");
  });
  result.textContent = "";
}

function bindDropZones() {
  [...document.querySelectorAll(".drop-zone")].forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("over");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("over"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("over");
      const answerId = e.dataTransfer.getData("text/plain") || dragAnswerId;
      if (!answerId) return;

      const old = zone.querySelector(".token");
      if (old) bank.appendChild(old);

      const inBank = bank.querySelector(`.token[data-answer-id="${answerId}"]`);
      if (inBank) {
        zone.appendChild(inBank);
      } else {
        const fromZone = document.querySelector(`.drop-zone .token[data-answer-id="${answerId}"]`);
        if (fromZone) zone.appendChild(fromZone);
      }
      clearFeedback();
    });
  });
}

function placeTokenInZone(token, zone) {
  const old = zone.querySelector(".token");
  if (old && old !== token) bank.appendChild(old);
  zone.appendChild(token);
  clearFeedback();
}

function getModeItems() {
  const mode = modeSelect.value;
  if (mode === "conv") return ITEMS.filter((i) => i.family === "conv" && !i.plus);
  if (mode === "conv-plus") return ITEMS.filter((i) => i.family === "conv" && i.plus);
  if (mode === "av") return ITEMS.filter((i) => i.family === "av" && !i.plus);
  if (mode === "av-plus") return ITEMS.filter((i) => i.family === "av" && i.plus);
  if (mode === "conv-all") return ITEMS.filter((i) => i.family === "conv");
  if (mode === "av-all") return ITEMS.filter((i) => i.family === "av");
  return ITEMS;
}

function roundSizeFor(mode) {
  if (window.matchMedia("(max-width: 768px)").matches) return 4;
  return 6;
}

function renderRound() {
  const mode = modeSelect.value;
  const source = getModeItems();
  const size = Math.min(roundSizeFor(mode), source.length);
  const round = shuffle(source).slice(0, size).map((item, idx) => ({
    ...item,
    answerId: `${item.family}-${item.plus ? "plus" : "base"}-${idx}-${item.answer}`
  }));
  const answers = shuffle(round.map((i) => ({ id: i.answerId, label: i.answer })));

  bank.innerHTML = "";
  answers.forEach((ans) => {
    const token = document.createElement("div");
    token.className = "token";
    token.draggable = true;
    token.dataset.answerId = ans.id;
    token.textContent = ans.label.replace(" / ", "\n");
    addTokenEvents(token);
    bank.appendChild(token);
  });

  grid.innerHTML = "";
  round.forEach((item, idx) => {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.answerId = item.answerId;
    card.dataset.answerLabel = item.answer;
    const isBalizaCase = item.signal.includes("Baliza") && item.context.includes("Preanuncio de parada");
    if (isBalizaCase) {
      card.innerHTML = `
        ${symbolHtml(getSymbolType(item))}
        <div class="signal">${idx + 1}. ${item.context}</div>
        <div class="context signal-sub">${item.signal}</div>
        <div class="drop-zone"></div>
        <div class="feedback"></div>
      `;
    } else {
      card.innerHTML = `
        ${symbolHtml(getSymbolType(item))}
        <div class="signal">${idx + 1}. ${item.signal}</div>
        <div class="context">${item.context}</div>
        <div class="drop-zone"></div>
        <div class="feedback"></div>
      `;
    }
    grid.appendChild(card);
  });

  bindDropZones();
  clearFeedback();
}

checkBtn.addEventListener("click", () => {
  const cards = [...document.querySelectorAll(".card")];
  let ok = 0;

  cards.forEach((card) => {
    const zone = card.querySelector(".drop-zone");
    const token = zone.querySelector(".token");
    const feedback = card.querySelector(".feedback");
    const expectedLabel = card.dataset.answerLabel;

    zone.classList.remove("correct", "wrong");
    feedback.classList.remove("ok", "bad");

    const tokenLabel = token ? token.textContent : "";
    if (token && normalizeAnswer(tokenLabel) === normalizeAnswer(expectedLabel)) {
      zone.classList.add("correct");
      feedback.textContent = "Correcto";
      feedback.classList.add("ok");
      ok += 1;
    } else {
      zone.classList.add("wrong");
      feedback.textContent = `Incorrecto: era ${expectedLabel}`;
      feedback.classList.add("bad");
    }
  });

  result.textContent = `Resultado: ${ok}/${cards.length} correctas`;
  result.style.color = ok === cards.length ? "#1f9747" : "#c73f3f";
});

resetBtn.addEventListener("click", () => {
  [...document.querySelectorAll(".drop-zone")].forEach((zone) => {
    const token = zone.querySelector(".token");
    if (token) bank.appendChild(token);
  });
  clearFeedback();
});

function touchById(e, id) {
  for (let i = 0; i < e.touches.length; i += 1) {
    if (e.touches[i].identifier === id) return e.touches[i];
  }
  return null;
}

document.addEventListener(
  "touchmove",
  (e) => {
    if (!activeTouch) return;
    const t = touchById(e, activeTouch.touchId);
    if (!t) return;
    const dx = t.clientX - activeTouch.startX;
    const dy = t.clientY - activeTouch.startY;
    if (activeTouch.dragging) {
      e.preventDefault();
      moveTokenTouchDrag(activeTouch.token, t.clientX, t.clientY);
    } else if (Math.hypot(dx, dy) >= TOUCH_MOVE_PX) {
      e.preventDefault();
      activeTouch.moved = true;
      if (activeTouch.holdTimer) {
        clearTimeout(activeTouch.holdTimer);
        activeTouch.holdTimer = null;
      }
      activeTouch.dragging = true;
      liftTokenTouchDrag(activeTouch.token, t.clientX, t.clientY);
    }
    document.querySelectorAll(".drop-zone").forEach((z) => z.classList.remove("over"));
    const zone = findDropZoneAt(t.clientX, t.clientY);
    if (zone) zone.classList.add("over");
  },
  { passive: false }
);

document.addEventListener(
  "touchend",
  (e) => {
    if (!activeTouch) return;
    let touch = null;
    for (let i = 0; i < e.changedTouches.length; i += 1) {
      if (e.changedTouches[i].identifier === activeTouch.touchId) {
        touch = e.changedTouches[i];
        break;
      }
    }
    if (!touch) return;
    if (activeTouch.holdTimer) {
      clearTimeout(activeTouch.holdTimer);
      activeTouch.holdTimer = null;
    }
    const token = activeTouch.token;
    const moved = activeTouch.moved;
    const dragging = activeTouch.dragging;
    activeTouch = null;
    document.querySelectorAll(".drop-zone").forEach((z) => z.classList.remove("over"));

    let origin = null;
    if (dragging) {
      origin = endTokenTouchDrag(token);
    }
    const zone = findDropZoneAt(touch.clientX, touch.clientY);

    if (zone && moved) {
      placeTokenInZone(token, zone);
    } else if (dragging && origin) {
      restoreTokenToOrigin(token, origin);
    }
  },
  { passive: true }
);

document.addEventListener("touchcancel", (e) => {
  if (!activeTouch) return;
  const id = activeTouch.touchId;
  const cancelled = [...e.changedTouches].some((t) => t.identifier === id);
  if (!cancelled) return;
  if (activeTouch.holdTimer) {
    clearTimeout(activeTouch.holdTimer);
  }
  const token = activeTouch.token;
  const dragging = activeTouch.dragging;
  activeTouch = null;
  document.querySelectorAll(".drop-zone").forEach((z) => z.classList.remove("over"));
  if (dragging) {
    const origin = endTokenTouchDrag(token);
    if (origin) restoreTokenToOrigin(token, origin);
  }
});

newBtn.addEventListener("click", renderRound);
modeBtn.addEventListener("click", renderRound);
modeSelect.addEventListener("change", renderRound);

renderRound();
