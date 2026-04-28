const TELEGRAM_USERNAME = "your_username";

const categories = [
  { id: "all", label: "Все" },
  { id: "iphone", label: "iPhone" },
  { id: "ipad", label: "iPad" },
  { id: "mac", label: "Mac" },
  { id: "watch", label: "Watch" },
  { id: "airpods", label: "AirPods" },
];

const products = [
  { id: "iphone-17-pro-max", slug: "iphone-17-pro-max", name: "iPhone 17 Pro Max", category: "iphone", price: 159990, image: "assets/iphone-17-pro.jpg", tagline: "Максимум в каждой детали.", description: "Цельнометаллический титановый корпус, чип A19 Pro и революционная камера ProMatrix с 8-кратным телеобъективом.", features: ["Дисплей Super Retina XDR 6.9\"", "Чип A19 Pro", "Камера 48 МП Pro · 8× зум", "ProMotion 120 Гц", "Титановая рамка"], colors: [{ name: "Чёрный титан", hex: "#2c2c2e" }, { name: "Натуральный титан", hex: "#c4b59c" }, { name: "Синий титан", hex: "#3a5577" }, { name: "Белый титан", hex: "#e8e4dc" }], aliases: "айфон 17 про макс iphone 17 pro max айфон про макс 17" },
  { id: "iphone-17", slug: "iphone-17", name: "iPhone 17", category: "iphone", price: 89990, image: "assets/iphone-17.jpg", tagline: "Чистая мощь. Чистый стиль.", description: "Новый алюминиевый корпус в свежих пастельных оттенках, чип A19 и улучшенная двойная камера.", features: ["Чип A19", "Камера 48 МП", "USB-C", "Дисплей 6.1\""], colors: [{ name: "Шалфей", hex: "#a8c4a2" }, { name: "Лавандовый", hex: "#c8b8d4" }, { name: "Песочный", hex: "#dcc9a8" }, { name: "Чёрный", hex: "#1c1c1e" }, { name: "Белый", hex: "#f1ede4" }], aliases: "айфон 17 iphone 17 айфон семнадцать" },
  { id: "iphone-16-pro-max", slug: "iphone-16-pro-max", name: "iPhone 16 Pro Max", category: "iphone", price: 139990, oldPrice: 149990, image: "assets/iphone-16-pro.jpg", tagline: "Сделан для Apple Intelligence.", description: "Корпус из титана 5-го поколения, чип A18 Pro и кнопка управления камерой.", features: ["Дисплей 6.9\" ProMotion", "Чип A18 Pro", "Камера Fusion 48 МП · 5× зум", "Кнопка камеры", "USB-C 3"], colors: [{ name: "Пустынный титан", hex: "#b89a6f" }, { name: "Натуральный титан", hex: "#c4b59c" }, { name: "Белый титан", hex: "#e8e4dc" }, { name: "Чёрный титан", hex: "#2c2c2e" }], aliases: "айфон 16 про макс iphone 16 pro max айфон 16 про" },
  { id: "iphone-16", slug: "iphone-16", name: "iPhone 16", category: "iphone", price: 74990, image: "assets/iphone-16.jpg", tagline: "Hello, Apple Intelligence.", description: "Чип A18, новая кнопка управления камерой и улучшенная двойная камера в стильном алюминиевом корпусе.", features: ["Чип A18", "Камера Fusion 48 МП", "Кнопка камеры", "USB-C"], colors: [{ name: "Розовый", hex: "#f3c8c8" }, { name: "Бирюзовый", hex: "#a8d4d0" }, { name: "Ультрамарин", hex: "#7a8cc8" }, { name: "Белый", hex: "#f1ede4" }, { name: "Чёрный", hex: "#1c1c1e" }], aliases: "айфон 16 iphone 16 айфон шестнадцать" },
  { id: "iphone-15-pro-max", slug: "iphone-15-pro-max", name: "iPhone 15 Pro Max", category: "iphone", price: 119990, oldPrice: 139990, image: "assets/iphone-15-pro.jpg", tagline: "Титан. Прочный. Лёгкий. Pro.", description: "Корпус из титана аэрокосмического класса, чип A17 Pro и 5-кратный телеобъектив.", features: ["Дисплей 6.7\"", "Чип A17 Pro", "Камера 48 МП Pro", "Кнопка «Действие»", "USB-C"], colors: [{ name: "Натуральный титан", hex: "#c4b59c" }, { name: "Синий титан", hex: "#3a5577" }, { name: "Белый титан", hex: "#e8e4dc" }, { name: "Чёрный титан", hex: "#2c2c2e" }], aliases: "айфон 15 про макс iphone 15 pro max" },
  { id: "iphone-15", slug: "iphone-15", name: "iPhone 15", category: "iphone", price: 64990, image: "assets/iphone-15.jpg", tagline: "Новая эра iPhone.", description: "Динамический остров, основная камера 48 Мп с 2× оптическим зумом и USB-C.", features: ["Динамический остров", "Камера 48 МП", "USB-C", "Чип A16 Bionic"], colors: [{ name: "Розовый", hex: "#f3c8c8" }, { name: "Жёлтый", hex: "#f0e0a0" }, { name: "Зелёный", hex: "#bcd0b4" }, { name: "Голубой", hex: "#bcd4dc" }, { name: "Чёрный", hex: "#1c1c1e" }], aliases: "айфон 15 iphone 15" },
  { id: "ipad-pro-m4", slug: "ipad-pro-m4", name: "iPad Pro M4", category: "ipad", price: 119990, image: "assets/ipad-pro.jpg", tagline: "Невероятно тонкий. Невероятно мощный.", description: "Дисплей Ultra Retina XDR с Tandem OLED и революционный чип M4. Самый тонкий iPad в истории.", features: ["Чип M4", "Tandem OLED", "Apple Pencil Pro", "Magic Keyboard"], colors: [{ name: "Серебристый", hex: "#d4d4d4" }, { name: "Чёрный космос", hex: "#3a3a3c" }], aliases: "айпад про ipad pro айпад про м4" },
  { id: "ipad-air-m2", slug: "ipad-air-m2", name: "iPad Air M2", category: "ipad", price: 69990, image: "assets/ipad-air.jpg", tagline: "Лёгкий. Серьёзный.", description: "Производительность чипа M2 в стильном корпусе iPad Air. Доступен в двух размерах.", features: ["Чип M2", "Дисплей Liquid Retina", "Touch ID", "Поддержка Apple Pencil Pro"], colors: [{ name: "Серый космос", hex: "#5a5a5c" }, { name: "Синий", hex: "#7a8cc8" }, { name: "Фиолетовый", hex: "#b8a8d0" }, { name: "Сияющая звезда", hex: "#e8dcc8" }], aliases: "айпад эйр ipad air айпад" },
  { id: "macbook-pro-16-m3-max", slug: "macbook-pro-16-m3-max", name: "MacBook Pro 16\" M3 Max", category: "mac", price: 329990, image: "assets/macbook-pro.jpg", tagline: "Для тех, кто перевернёт всё.", description: "Чип M3 Max обеспечивает невероятную производительность для самых требовательных задач.", features: ["M3 Max до 16-ядер CPU", "До 128 ГБ ОЗУ", "Liquid Retina XDR 16\"", "До 22 ч работы"], colors: [{ name: "Чёрный космос", hex: "#3a3a3c" }, { name: "Серебристый", hex: "#d4d4d4" }], aliases: "макбук про macbook pro макбук" },
  { id: "macbook-air-15-m3", slug: "macbook-air-15-m3", name: "MacBook Air 15\" M3", category: "mac", price: 159990, image: "assets/macbook-air.jpg", tagline: "Воздушно лёгкий. Серьёзно мощный.", description: "Невероятно тонкий и лёгкий ноутбук с чипом M3 и большим 15-дюймовым дисплеем Liquid Retina.", features: ["Чип M3", "15.3\" Liquid Retina", "До 18 ч работы", "MagSafe"], colors: [{ name: "Полуночный", hex: "#2a2e3a" }, { name: "Сияющая звезда", hex: "#e8dcc8" }, { name: "Серебристый", hex: "#d4d4d4" }, { name: "Серый космос", hex: "#5a5a5c" }], aliases: "макбук эйр macbook air мак эйр" },
  { id: "watch-ultra-2", slug: "watch-ultra-2", name: "Apple Watch Ultra 2", category: "watch", price: 89990, image: "assets/watch-ultra.jpg", tagline: "Следующий уровень приключений.", description: "Самые прочные Apple Watch. Корпус из титана, дисплей яркостью 3000 нит.", features: ["Титан 49 мм", "До 36 ч работы", "GPS L1+L5", "Двойной щелчок"], colors: [{ name: "Натуральный титан", hex: "#c4b59c" }], aliases: "часы ультра apple watch ultra эпл вотч ультра" },
  { id: "watch-series-9", slug: "watch-series-9", name: "Apple Watch Series 9", category: "watch", price: 39990, image: "assets/watch-s9.jpg", tagline: "Умнее. Ярче. Мощнее.", description: "Чип S9 SiP, новый жест Двойной щелчок и дисплей яркостью 2000 нит.", features: ["Чип S9 SiP", "Двойной щелчок", "До 2000 нит", "Always-On Retina"], colors: [{ name: "Полуночный", hex: "#2a2e3a" }, { name: "Сияющая звезда", hex: "#e8dcc8" }, { name: "Серебристый", hex: "#d4d4d4" }, { name: "Розовый", hex: "#f3c8c8" }, { name: "Красный", hex: "#c8504a" }], aliases: "часы 9 apple watch эпл вотч часы эпл" },
  { id: "airpods-pro-2", slug: "airpods-pro-2", name: "AirPods Pro 2", category: "airpods", price: 24990, image: "assets/airpods-pro.jpg", tagline: "Адаптивный звук.", description: "Активное шумоподавление нового уровня, режим адаптивного звука и USB-C футляр.", features: ["Адаптивный звук", "Шумоподавление 2.0", "USB-C", "Прозрачный режим"], colors: [{ name: "Белый", hex: "#f1ede4" }], aliases: "эирподс про airpods pro наушники про аирподс" },
  { id: "airpods-max", slug: "airpods-max", name: "AirPods Max", category: "airpods", price: 59990, image: "assets/airpods-max.jpg", tagline: "Высокоточный звук.", description: "Полноразмерные наушники с пространственным аудио и шумоподавлением.", features: ["Пространственное аудио", "Шумоподавление", "20 ч работы", "Premium-материалы"], colors: [{ name: "Серебристый", hex: "#d4d4d4" }, { name: "Серый космос", hex: "#5a5a5c" }, { name: "Синий", hex: "#7a8cc8" }, { name: "Розовый", hex: "#f3c8c8" }, { name: "Зелёный", hex: "#bcd0b4" }], aliases: "эирподс макс airpods max наушники макс большие наушники" },
];

const state = {
  category: "all",
  query: "",
  cart: JSON.parse(localStorage.getItem("ath-store-cart") || "[]"),
  modalProduct: null,
};

const money = (value) => new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(value);
const byId = (id) => products.find((product) => product.id === id);
const cartItems = () => state.cart.map((item) => ({ ...item, product: byId(item.id) })).filter((item) => item.product);
const cartTotal = () => cartItems().reduce((sum, item) => sum + item.product.price * item.qty, 0);
const cartCount = () => state.cart.reduce((sum, item) => sum + item.qty, 0);
const saveCart = () => localStorage.setItem("ath-store-cart", JSON.stringify(state.cart));

function renderCategories() {
  document.querySelectorAll("[data-categories]").forEach((node) => {
    node.innerHTML = categories.map((category) => `<button class="filter ${state.category === category.id ? "active" : ""}" data-filter="${category.id}">${category.label}</button>`).join("");
  });
}

function filteredProducts() {
  const q = state.query.trim().toLowerCase();
  return products.filter((product) => {
    const categoryMatch = state.category === "all" || product.category === state.category;
    const searchMatch = !q || `${product.name} ${product.tagline} ${product.description} ${product.aliases}`.toLowerCase().includes(q);
    return categoryMatch && searchMatch;
  });
}

function renderProducts() {
  const list = filteredProducts();
  const node = document.querySelector("#product-grid");
  node.innerHTML = list.length ? list.map((product) => `
    <article class="card">
      <button class="card-media" data-open-product="${product.id}" aria-label="Открыть ${product.name}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </button>
      <div class="card-body">
        <h3>${product.name}</h3>
        <p class="tagline">${product.tagline}</p>
        <div class="price">${money(product.price)} ${product.oldPrice ? `<span class="old-price">${money(product.oldPrice)}</span>` : ""}</div>
        <div class="card-actions">
          <button class="small-btn" data-add="${product.id}">В корзину</button>
          <button class="ghost-btn" data-open-product="${product.id}" aria-label="Подробнее">⌕</button>
        </div>
      </div>
    </article>
  `).join("") : `<p class="empty">Товары не найдены. Попробуйте другой запрос.</p>`;
}

function addToCart(id) {
  const existing = state.cart.find((item) => item.id === id);
  if (existing) existing.qty += 1;
  else state.cart.push({ id, qty: 1 });
  saveCart();
  renderCart();
  openCart();
}

function changeQty(id, diff) {
  const item = state.cart.find((entry) => entry.id === id);
  if (!item) return;
  item.qty += diff;
  if (item.qty <= 0) state.cart = state.cart.filter((entry) => entry.id !== id);
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  state.cart = state.cart.filter((entry) => entry.id !== id);
  saveCart();
  renderCart();
}

function renderCart() {
  document.querySelectorAll("[data-cart-count]").forEach((node) => node.textContent = cartCount());
  document.querySelector("#cart-total").textContent = money(cartTotal());
  const body = document.querySelector("#cart-items");
  const items = cartItems();
  body.innerHTML = items.length ? items.map(({ product, qty }) => `
    <div class="cart-item">
      <img src="${product.image}" alt="${product.name}">
      <div>
        <h3>${product.name}</h3>
        <p>${money(product.price)} × ${qty}</p>
        <div>
          <span class="qty">
            <button data-qty="${product.id}" data-diff="-1" aria-label="Уменьшить">−</button>
            <span>${qty}</span>
            <button data-qty="${product.id}" data-diff="1" aria-label="Увеличить">+</button>
          </span>
          <button class="remove" data-remove="${product.id}">Убрать</button>
        </div>
      </div>
    </div>
  `).join("") : `<p class="empty">Корзина пустая. Добавьте товар из каталога.</p>`;
}

function openCart() {
  document.body.classList.add("locked");
  document.querySelector("#drawer-backdrop").classList.add("show");
  document.querySelector("#cart-drawer").classList.add("show");
}

function closeOverlays() {
  document.body.classList.remove("locked");
  document.querySelector("#drawer-backdrop").classList.remove("show");
  document.querySelector("#cart-drawer").classList.remove("show");
  document.querySelector("#product-modal").classList.remove("show");
}

function openProduct(id) {
  const product = byId(id);
  if (!product) return;
  document.body.classList.add("locked");
  document.querySelector("#drawer-backdrop").classList.add("show");
  const modal = document.querySelector("#product-modal");
  modal.innerHTML = `
    <button class="icon-btn close-floating" data-close aria-label="Закрыть">×</button>
    <div class="modal-grid">
      <div class="modal-media"><img src="${product.image}" alt="${product.name}"></div>
      <div class="modal-info">
        <span class="kicker">ATH STORE</span>
        <h2>${product.name}</h2>
        <div class="price">${money(product.price)} ${product.oldPrice ? `<span class="old-price">${money(product.oldPrice)}</span>` : ""}</div>
        <p>${product.description}</p>
        <ul class="features">${product.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>
        <div class="swatches">${product.colors.map((color) => `<span class="swatch"><span class="dot" style="background:${color.hex}"></span>${color.name}</span>`).join("")}</div>
        <button class="btn primary" data-add="${product.id}">Добавить в корзину</button>
      </div>
    </div>
  `;
  modal.classList.add("show");
}

function telegramLink(formData) {
  const items = cartItems();
  const lines = [
    "🛒 Новый заказ ATH STORE",
    "",
    ...items.map(({ product, qty }) => `• ${product.name} — ${qty} шт. × ${money(product.price)}`),
    "",
    `Итого: ${money(cartTotal())}`,
    "",
    `Имя: ${formData.get("name") || "не указано"}`,
    `Телефон: ${formData.get("phone") || "не указан"}`,
    `Доставка: ${formData.get("delivery") || "не указано"}`,
    `Адрес: ${formData.get("address") || "не указан"}`,
    `Комментарий: ${formData.get("notes") || "нет"}`,
  ];
  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(lines.join("\n"))}`;
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const target = event.target.closest("button, a");
    if (!target) return;
    if (target.matches("[data-filter]")) {
      state.category = target.dataset.filter;
      renderCategories();
      renderProducts();
    }
    if (target.matches("[data-add]")) addToCart(target.dataset.add);
    if (target.matches("[data-open-product]")) openProduct(target.dataset.openProduct);
    if (target.matches("[data-cart-open]")) openCart();
    if (target.matches("[data-close]")) closeOverlays();
    if (target.matches("[data-qty]")) changeQty(target.dataset.qty, Number(target.dataset.diff));
    if (target.matches("[data-remove]")) removeFromCart(target.dataset.remove);
    if (target.matches("[data-menu]")) document.querySelector("#mobile-panel").classList.toggle("show");
  });

  document.querySelector("#drawer-backdrop").addEventListener("click", closeOverlays);
  document.querySelector("#search").addEventListener("input", (event) => {
    state.query = event.target.value;
    renderProducts();
  });
  document.querySelector("#checkout-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!state.cart.length) {
      alert("Корзина пустая");
      return;
    }
    window.open(telegramLink(new FormData(event.currentTarget)), "_blank", "noopener,noreferrer");
  });
}

renderCategories();
renderProducts();
renderCart();
bindEvents();
