/* Каталог, фильтры, кредит/trade-in, форма тест-драйва */

const CARS = [
  { id: 1, brand: "Toyota", model: "Camry", year: 2022, price: 2890000, body: "sedan", km: 41000, img: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=70", alt: "Toyota Camry белого цвета, вид спереди" },
  { id: 2, brand: "Haval", model: "Jolion", year: 2024, price: 2299000, body: "suv", km: 12000, img: "https://images.unsplash.com/photo-1606664515524-ed2f786a0fe6?auto=format&fit=crop&w=800&q=70", alt: "Кроссовер Haval Jolion на дороге" },
  { id: 3, brand: "BMW", model: "320d", year: 2021, price: 3750000, body: "sedan", km: 54000, img: "https://images.unsplash.com/photo-1555215695-300b176ab4b5?auto=format&fit=crop&w=800&q=70", alt: "BMW 3 серии серого цвета" },
  { id: 4, brand: "Kia", model: "Sportage", year: 2023, price: 3180000, body: "suv", km: 21000, img: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=70", alt: "Kia Sportage кроссовер" },
  { id: 5, brand: "Tesla", model: "Model 3", year: 2022, price: 4290000, body: "sedan", km: 28000, img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=70", alt: "Tesla Model 3 красного цвета" },
  { id: 6, brand: "Volkswagen", model: "Golf", year: 2020, price: 1890000, body: "hatch", km: 67000, img: "https://images.unsplash.com/photo-1617814076367-b759c7d16f1f?auto=format&fit=crop&w=800&q=70", alt: "Volkswagen Golf хэтчбек" },
  { id: 7, brand: "Geely", model: "Monjaro", year: 2024, price: 3650000, body: "suv", km: 8000, img: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=70", alt: "Geely Monjaro кроссовер" },
  { id: 8, brand: "Mercedes-Benz", model: "C 200", year: 2019, price: 2590000, body: "sedan", km: 89000, img: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=70", alt: "Mercedes-Benz C-класса" }
];

const BODY_LABEL = { sedan: "Седан", suv: "SUV", hatch: "Хэтчбек" };

const grid = document.getElementById("carGrid");
const countEl = document.getElementById("catalogCount");
const emptyEl = document.getElementById("emptyState");
const tdCar = document.getElementById("tdCar");

function money(n) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(n)) + " ₽";
}

function yearBucket(year, filter) {
  if (filter === "all") return true;
  if (filter === "2024") return year >= 2024;
  if (filter === "2021") return year >= 2021 && year <= 2023;
  if (filter === "2018") return year >= 2018 && year <= 2020;
  return true;
}

function priceBucket(price, filter) {
  if (filter === "all") return true;
  const [min, max] = filter.split("-").map(Number);
  return price >= min && price <= max;
}

function getFilters() {
  return {
    brand: document.getElementById("filterBrand").value,
    price: document.getElementById("filterPrice").value,
    body: document.getElementById("filterBody").value,
    year: document.getElementById("filterYear").value
  };
}

function filteredCars() {
  const f = getFilters();
  return CARS.filter((car) => {
    const byBrand = f.brand === "all" || car.brand === f.brand;
    const byBody = f.body === "all" || car.body === f.body;
    return byBrand && byBody && priceBucket(car.price, f.price) && yearBucket(car.year, f.year);
  });
}

function renderCars() {
  const list = filteredCars();
  countEl.textContent = list.length ? `Найдено: ${list.length}` : "";
  emptyEl.hidden = list.length > 0;
  grid.innerHTML = list.map((car) => `
    <article class="car-card">
      <img src="${car.img}" alt="${car.alt}" width="400" height="190" loading="lazy">
      <div class="body">
        <div class="meta">
          <span class="badge">${BODY_LABEL[car.body]}</span>
          <span>${car.year} · ${car.km.toLocaleString("ru-RU")} км</span>
        </div>
        <h3>${car.brand} ${car.model}</h3>
        <p class="price">${money(car.price)}</p>
        <div class="row">
          <button class="btn btn-primary" type="button" data-open="${car.id}">Подробнее</button>
          <a class="btn btn-ghost" href="#testdrive" data-pick="${car.id}">Тест-драйв</a>
        </div>
      </div>
    </article>
  `).join("");
}

CARS.forEach((car) => {
  const opt = document.createElement("option");
  opt.value = `${car.brand} ${car.model}`;
  opt.textContent = `${car.brand} ${car.model} (${car.year})`;
  tdCar.appendChild(opt);
});

document.getElementById("filterForm").addEventListener("change", renderCars);
document.getElementById("filterForm").addEventListener("reset", () => {
  setTimeout(renderCars, 0);
});

grid.addEventListener("click", (e) => {
  const openBtn = e.target.closest("[data-open]");
  const pickBtn = e.target.closest("[data-pick]");
  if (openBtn) openCard(Number(openBtn.dataset.open));
  if (pickBtn) {
    const car = CARS.find((c) => c.id === Number(pickBtn.dataset.pick));
    tdCar.value = `${car.brand} ${car.model}`;
    document.getElementById("carPrice").value = car.price;
    syncDownMax();
    calcCredit();
  }
});

function openCard(id) {
  const car = CARS.find((c) => c.id === id);
  const dialog = document.getElementById("carDialog");
  document.getElementById("dialogBody").innerHTML = `
    <img src="${car.img}" alt="${car.alt}">
    <div class="dialog-copy">
      <h3 id="dialogTitle">${car.brand} ${car.model}, ${car.year}</h3>
      <p>${BODY_LABEL[car.body]} · ${car.km.toLocaleString("ru-RU")} км · диагностика 86 точек · гарантия 24 мес.</p>
      <p class="price">${money(car.price)}</p>
      <a class="btn btn-primary" href="#testdrive" data-pick="${car.id}">Записаться на тест-драйв</a>
    </div>
  `;
  dialog.showModal();
  dialog.querySelector("[data-pick]")?.addEventListener("click", () => dialog.close());
}

renderCars();

/* Меню */
const toggle = document.getElementById("navToggle");
const nav = document.getElementById("site-nav");
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
  nav.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
}));

/* Калькулятор аннуитета + trade-in */
const priceInput = document.getElementById("carPrice");
const down = document.getElementById("downPayment");
const term = document.getElementById("termMonths");
const rate = document.getElementById("rate");
const tradeCheck = document.getElementById("useTradein");
const tradeWrap = document.getElementById("tradeinWrap");
const tradeVal = document.getElementById("tradeinValue");

function syncDownMax() {
  const max = Number(priceInput.value) || 0;
  down.max = String(max);
  if (Number(down.value) > max) down.value = String(Math.round(max * 0.2));
}

function annuity(loan, months, annualPct) {
  if (loan <= 0) return 0;
  const i = annualPct / 100 / 12;
  if (i === 0) return loan / months;
  return loan * (i * Math.pow(1 + i, months)) / (Math.pow(1 + i, months) - 1);
}

function calcCredit() {
  const price = Number(priceInput.value) || 0;
  const trade = tradeCheck.checked ? Number(tradeVal.value) || 0 : 0;
  let downPay = Number(down.value) + trade;
  if (downPay > price) downPay = price;
  const loan = Math.max(0, price - downPay);
  const months = Number(term.value);
  const pct = Number(rate.value);
  const monthly = annuity(loan, months, pct);
  const total = monthly * months;
  document.getElementById("downOut").textContent = money(Number(down.value));
  document.getElementById("termOut").textContent = `${months} мес.`;
  document.getElementById("rateOut").textContent = `${String(pct).replace(".", ",")}%`;
  document.getElementById("monthlyPay").textContent = money(monthly);
  document.getElementById("loanAmount").textContent = money(loan);
  document.getElementById("overpay").textContent = money(Math.max(0, total - loan));
  document.getElementById("totalPay").textContent = money(total);
}

tradeCheck.addEventListener("change", () => {
  tradeWrap.hidden = !tradeCheck.checked;
  calcCredit();
});
["input", "change"].forEach((ev) => {
  [priceInput, down, term, rate, tradeVal].forEach((el) => el.addEventListener(ev, () => {
    if (el === priceInput) syncDownMax();
    calcCredit();
  }));
});
syncDownMax();
calcCredit();

/* Форма: простая валидация телефона РФ */
const phoneRe = /^\+7\s?\d{3}\s?\d{3}-?\d{2}-?\d{2}$|^8\d{10}$|^\+7\d{10}$/;

document.getElementById("tdForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("tdName");
  const phone = document.getElementById("tdPhone");
  const agree = document.getElementById("tdAgree");
  let ok = true;

  function err(id, msg) {
    const field = document.getElementById(id);
    const box = document.querySelector(`[data-for="${id}"]`);
    field?.classList.toggle("is-invalid", Boolean(msg));
    if (box) box.textContent = msg;
    if (msg) ok = false;
  }

  err("tdName", name.value.trim().length < 2 ? "Укажите имя, минимум 2 символа." : "");
  err("tdPhone", phoneRe.test(phone.value.replaceAll(" ", "")) ? "" : "Формат: +7 900 000-00-00");
  const agreeErr = document.querySelector('[data-for="tdAgree"]');
  if (!agree.checked) {
    agreeErr.textContent = "Нужно согласие на обработку данных.";
    ok = false;
  } else agreeErr.textContent = "";

  if (!ok) return;
  document.getElementById("tdSuccess").hidden = false;
  e.target.reset();
});

/* Счётчики цифр доверия */
const counters = document.querySelectorAll("[data-count]");
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const end = Number(el.dataset.count);
    const start = performance.now();
    const dur = 900;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      el.textContent = String(Math.round(end * t));
      if (t < 1) requestAnimationFrame(tick);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = String(end);
    } else requestAnimationFrame(tick);
    io.unobserve(el);
  });
}, { threshold: 0.4 });
counters.forEach((el) => io.observe(el));
