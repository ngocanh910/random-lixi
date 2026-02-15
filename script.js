const options = [
  { label: "5.000 VND", value: "5.000 VND", note: "Mở đầu may mắn.", type: "money", color: "#1f7a5c" },
  { label: "50.000 VND", value: "50.000 VND", note: "Lộc nhỏ nhưng vui.", type: "money", color: "#2b6bbf" },
  { label: "100.000 VND", value: "100.000 VND", note: "Một ngày thuận lợi.", type: "money", color: "#b8283b" },
  { label: "200.000 VND", value: "200.000 VND", note: "Tài lộc gõ cửa.", type: "money", color: "#6e3fb5" },
  { label: "500.000 VND", value: "500.000 VND", note: "Đỉnh của may mắn.", type: "money", color: "#c97c2a" },
  { label: "Chúc bạn may mắn lần sau", value: "Chúc bạn may mắn lần sau", note: "Bao lì xì đỏ để giữ lộc.", type: "luck", color: "#d81b2c" }
];

const optionList = document.getElementById("optionList");
const resultCard = document.getElementById("resultCard");
const resultMedia = document.getElementById("resultMedia");
const resultLabel = document.getElementById("resultLabel");
const resultValue = document.getElementById("resultValue");
const resultNote = document.getElementById("resultNote");
const spinBtn = document.getElementById("spinBtn");

const makeBanknoteSvg = (label, color) => {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#f7e9c8" />
    </linearGradient>
  </defs>
  <rect x="10" y="18" width="300" height="164" rx="18" fill="url(#g)" stroke="rgba(0,0,0,0.15)" stroke-width="2" />
  <rect x="26" y="34" width="268" height="132" rx="14" fill="rgba(255,255,255,0.35)" />
  <circle cx="70" cy="100" r="34" fill="rgba(255,255,255,0.5)" />
  <text x="160" y="108" text-anchor="middle" font-family="'Be Vietnam Pro', sans-serif" font-size="28" font-weight="700" fill="#1c1a17">${label}</text>
  <text x="260" y="140" text-anchor="middle" font-family="'Be Vietnam Pro', sans-serif" font-size="14" font-weight="600" fill="#2f2a25">VNĐ</text>
  <path d="M20 60 Q80 40 140 60" stroke="rgba(0,0,0,0.15)" stroke-width="2" fill="none" />
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg.trim())}`;
};

const makeEnvelopeSvg = () => {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200">
  <defs>
    <linearGradient id="r" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ff4d5d" />
      <stop offset="100%" stop-color="#b10a1a" />
    </linearGradient>
  </defs>
  <rect x="30" y="32" width="260" height="136" rx="18" fill="url(#r)" />
  <path d="M30 44 L160 120 L290 44" fill="rgba(255,255,255,0.15)" />
  <path d="M30 156 L160 92 L290 156" fill="rgba(0,0,0,0.12)" />
  <circle cx="160" cy="116" r="22" fill="#f6c34a" />
  <text x="160" y="124" text-anchor="middle" font-family="'Fraunces', serif" font-size="18" font-weight="700" fill="#7a1b1b">LỘC</text>
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg.trim())}`;
};

const enrichOptions = options.map((item) => {
  const image = item.type === "money"
    ? makeBanknoteSvg(item.label, item.color)
    : makeEnvelopeSvg();
  return { ...item, image };
});

const renderOptions = () => {
  optionList.innerHTML = "";
  enrichOptions.forEach((item) => {
    const card = document.createElement("div");
    card.className = "option";
    card.innerHTML = `
      <div class="thumb"><img src="${item.image}" alt="${item.label}" /></div>
      <div class="label">${item.label}</div>
      <div class="note">${item.note}</div>
    `;
    optionList.appendChild(card);
  });
};

const setSpinningState = (isSpinning) => {
  spinBtn.disabled = isSpinning;
  spinBtn.textContent = isSpinning ? "Đang quay..." : "Quay Ngay";
  resultCard.classList.toggle("spinning", isSpinning);
};

const spin = () => {
  if (spinBtn.disabled) return;
  setSpinningState(true);

  const spins = 10 + Math.floor(Math.random() * 6);
  let index = 0;

  const tick = () => {
    const current = enrichOptions[index % enrichOptions.length];
    resultMedia.innerHTML = `<img src="${current.image}" alt="${current.label}" />`;
    resultLabel.textContent = "Đang quay";
    resultValue.textContent = current.label;
    resultNote.textContent = "Hồi hộp chút nhé...";

    index += 1;
    if (index < spins) {
      const delay = 80 + index * 30;
      setTimeout(tick, delay);
    } else {
      const pick = enrichOptions[Math.floor(Math.random() * enrichOptions.length)];
      resultMedia.innerHTML = `<img src="${pick.image}" alt="${pick.label}" />`;
      resultLabel.textContent = pick.type === "money" ? "Bạn nhận được" : "Kết quả";
      resultValue.textContent = pick.value;
      resultNote.textContent = pick.note;
      resultCard.classList.remove("fade-in");
      void resultCard.offsetWidth;
      resultCard.classList.add("fade-in");
      setTimeout(() => setSpinningState(false), 200);
    }
  };

  tick();
};

spinBtn.addEventListener("click", spin);
renderOptions();
