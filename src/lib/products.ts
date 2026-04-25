import iphone17Pro from "@/assets/iphone-17-pro.jpg";
import iphone17 from "@/assets/iphone-17.jpg";
import iphone16Pro from "@/assets/iphone-16-pro.jpg";
import iphone16 from "@/assets/iphone-16.jpg";
import iphone15Pro from "@/assets/iphone-15-pro.jpg";
import iphone15 from "@/assets/iphone-15.jpg";
import ipadPro from "@/assets/ipad-pro.jpg";
import ipadAir from "@/assets/ipad-air.jpg";
import macbookPro from "@/assets/macbook-pro.jpg";
import macbookAir from "@/assets/macbook-air.jpg";
import watchUltra from "@/assets/watch-ultra.jpg";
import watchS9 from "@/assets/watch-s9.jpg";
import airpodsPro from "@/assets/airpods-pro.jpg";
import airpodsMax from "@/assets/airpods-max.jpg";

export type Category = "iphone" | "ipad" | "mac" | "watch" | "airpods";

export interface ProductColor {
  name: string;
  /** CSS color (hex / oklch / rgb) used as a swatch and for site tinting */
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  image: string;
  tagline: string;
  description: string;
  features: string[];
  colors: ProductColor[];
  /** Russian search aliases / common typos */
  aliases: string[];
}

export const CATEGORIES: { id: Category; label: string; ru: string }[] = [
  { id: "iphone", label: "iPhone", ru: "Айфон" },
  { id: "ipad", label: "iPad", ru: "Айпад" },
  { id: "mac", label: "Mac", ru: "Мак" },
  { id: "watch", label: "Watch", ru: "Часы" },
  { id: "airpods", label: "AirPods", ru: "Наушники" },
];

export const PRODUCTS: Product[] = [
  {
    id: "iphone-17-pro-max",
    slug: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    category: "iphone",
    price: 159990,
    image: iphone17Pro,
    tagline: "Максимум в каждой детали.",
    description:
      "Цельнометаллический титановый корпус, чип A19 Pro и революционная камера ProMatrix с 8-кратным телеобъективом.",
    features: [
      "Дисплей Super Retina XDR 6.9\"",
      "Чип A19 Pro",
      "Камера 48 МП Pro · 8× зум",
      "ProMotion 120 Гц",
      "Титановая рамка",
    ],
    colors: [
      { name: "Чёрный титан", hex: "#2c2c2e" },
      { name: "Натуральный титан", hex: "#c4b59c" },
      { name: "Синий титан", hex: "#3a5577" },
      { name: "Белый титан", hex: "#e8e4dc" },
    ],
    aliases: ["айфон 17 про макс", "iphone 17 pro max", "айфон 17 про", "айфон про макс 17"],
  },
  {
    id: "iphone-17",
    slug: "iphone-17",
    name: "iPhone 17",
    category: "iphone",
    price: 89990,
    image: iphone17,
    tagline: "Чистая мощь. Чистый стиль.",
    description:
      "Новый алюминиевый корпус в свежих пастельных оттенках, чип A19 и улучшенная двойная камера.",
    features: ["Чип A19", "Камера 48 МП", "USB-C", "Дисплей 6.1\""],
    colors: [
      { name: "Шалфей", hex: "#a8c4a2" },
      { name: "Лавандовый", hex: "#c8b8d4" },
      { name: "Песочный", hex: "#dcc9a8" },
      { name: "Чёрный", hex: "#1c1c1e" },
      { name: "Белый", hex: "#f1ede4" },
    ],
    aliases: ["айфон 17", "iphone 17", "айфон семнадцать"],
  },
  {
    id: "iphone-16-pro-max",
    slug: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    category: "iphone",
    price: 139990,
    oldPrice: 149990,
    image: iphone16Pro,
    tagline: "Сделан для Apple Intelligence.",
    description:
      "Корпус из титана 5-го поколения, чип A18 Pro и кнопка управления камерой.",
    features: [
      "Дисплей 6.9\" ProMotion",
      "Чип A18 Pro",
      "Камера Fusion 48 МП · 5× зум",
      "Кнопка камеры",
      "USB-C 3",
    ],
    colors: [
      { name: "Пустынный титан", hex: "#b89a6f" },
      { name: "Натуральный титан", hex: "#c4b59c" },
      { name: "Белый титан", hex: "#e8e4dc" },
      { name: "Чёрный титан", hex: "#2c2c2e" },
    ],
    aliases: ["айфон 16 про макс", "iphone 16 pro max", "айфон 16 про"],
  },
  {
    id: "iphone-16",
    slug: "iphone-16",
    name: "iPhone 16",
    category: "iphone",
    price: 74990,
    image: iphone16,
    tagline: "Hello, Apple Intelligence.",
    description:
      "Чип A18, новая кнопка управления камерой и улучшенная двойная камера в стильном алюминиевом корпусе.",
    features: ["Чип A18", "Камера Fusion 48 МП", "Кнопка камеры", "USB-C"],
    colors: [
      { name: "Розовый", hex: "#f3c8c8" },
      { name: "Бирюзовый", hex: "#a8d4d0" },
      { name: "Ультрамарин", hex: "#7a8cc8" },
      { name: "Белый", hex: "#f1ede4" },
      { name: "Чёрный", hex: "#1c1c1e" },
    ],
    aliases: ["айфон 16", "iphone 16", "айфон шестнадцать"],
  },
  {
    id: "iphone-15-pro-max",
    slug: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    category: "iphone",
    price: 119990,
    oldPrice: 139990,
    image: iphone15Pro,
    tagline: "Титан. Прочный. Лёгкий. Pro.",
    description:
      "Корпус из титана аэрокосмического класса, чип A17 Pro и 5-кратный телеобъектив.",
    features: ["Дисплей 6.7\"", "Чип A17 Pro", "Камера 48 МП Pro", "Кнопка «Действие»", "USB-C"],
    colors: [
      { name: "Натуральный титан", hex: "#c4b59c" },
      { name: "Синий титан", hex: "#3a5577" },
      { name: "Белый титан", hex: "#e8e4dc" },
      { name: "Чёрный титан", hex: "#2c2c2e" },
    ],
    aliases: ["айфон 15 про макс", "iphone 15 pro max", "айфон про макс 15"],
  },
  {
    id: "iphone-15",
    slug: "iphone-15",
    name: "iPhone 15",
    category: "iphone",
    price: 64990,
    image: iphone15,
    tagline: "Новая эра iPhone.",
    description:
      "Динамический остров, основная камера 48 Мп с 2× оптическим зумом и USB-C.",
    features: ["Динамический остров", "Камера 48 МП", "USB-C", "Чип A16 Bionic"],
    colors: [
      { name: "Розовый", hex: "#f3c8c8" },
      { name: "Жёлтый", hex: "#f0e0a0" },
      { name: "Зелёный", hex: "#bcd0b4" },
      { name: "Голубой", hex: "#bcd4dc" },
      { name: "Чёрный", hex: "#1c1c1e" },
    ],
    aliases: ["айфон 15", "iphone 15", "айфон пятнадцать"],
  },
  {
    id: "ipad-pro-m4",
    slug: "ipad-pro-m4",
    name: "iPad Pro M4",
    category: "ipad",
    price: 119990,
    image: ipadPro,
    tagline: "Невероятно тонкий. Невероятно мощный.",
    description:
      "Дисплей Ultra Retina XDR с Tandem OLED и революционный чип M4. Самый тонкий iPad в истории.",
    features: ["Чип M4", "Tandem OLED", "Apple Pencil Pro", "Magic Keyboard"],
    colors: [
      { name: "Серебристый", hex: "#d4d4d4" },
      { name: "Чёрный космос", hex: "#3a3a3c" },
    ],
    aliases: ["айпад про", "ipad pro", "айпад про м4"],
  },
  {
    id: "ipad-air-m2",
    slug: "ipad-air-m2",
    name: "iPad Air M2",
    category: "ipad",
    price: 69990,
    image: ipadAir,
    tagline: "Лёгкий. Серьёзный.",
    description:
      "Производительность чипа M2 в стильном корпусе iPad Air. Доступен в двух размерах.",
    features: ["Чип M2", "Дисплей Liquid Retina", "Touch ID", "Поддержка Apple Pencil Pro"],
    colors: [
      { name: "Серый космос", hex: "#5a5a5c" },
      { name: "Синий", hex: "#7a8cc8" },
      { name: "Фиолетовый", hex: "#b8a8d0" },
      { name: "Сияющая звезда", hex: "#e8dcc8" },
    ],
    aliases: ["айпад эйр", "ipad air", "айпад"],
  },
  {
    id: "macbook-pro-16-m3-max",
    slug: "macbook-pro-16-m3-max",
    name: "MacBook Pro 16\" M3 Max",
    category: "mac",
    price: 329990,
    image: macbookPro,
    tagline: "Для тех, кто перевернёт всё.",
    description:
      "Чип M3 Max обеспечивает невероятную производительность для самых требовательных задач.",
    features: ["M3 Max до 16-ядер CPU", "До 128 ГБ ОЗУ", "Liquid Retina XDR 16\"", "До 22 ч работы"],
    colors: [
      { name: "Чёрный космос", hex: "#3a3a3c" },
      { name: "Серебристый", hex: "#d4d4d4" },
    ],
    aliases: ["макбук про", "macbook pro", "мак про", "макбук"],
  },
  {
    id: "macbook-air-15-m3",
    slug: "macbook-air-15-m3",
    name: "MacBook Air 15\" M3",
    category: "mac",
    price: 159990,
    image: macbookAir,
    tagline: "Воздушно лёгкий. Серьёзно мощный.",
    description:
      "Невероятно тонкий и лёгкий ноутбук с чипом M3 и большим 15-дюймовым дисплеем Liquid Retina.",
    features: ["Чип M3", "15.3\" Liquid Retina", "До 18 ч работы", "MagSafe"],
    colors: [
      { name: "Полуночный", hex: "#2a2e3a" },
      { name: "Сияющая звезда", hex: "#e8dcc8" },
      { name: "Серебристый", hex: "#d4d4d4" },
      { name: "Серый космос", hex: "#5a5a5c" },
    ],
    aliases: ["макбук эйр", "macbook air", "мак эйр"],
  },
  {
    id: "watch-ultra-2",
    slug: "watch-ultra-2",
    name: "Apple Watch Ultra 2",
    category: "watch",
    price: 89990,
    image: watchUltra,
    tagline: "Следующий уровень приключений.",
    description:
      "Самые прочные Apple Watch. Корпус из титана, дисплей яркостью 3000 нит.",
    features: ["Титан 49 мм", "До 36 ч работы", "GPS L1+L5", "Двойной щелчок"],
    colors: [{ name: "Натуральный титан", hex: "#c4b59c" }],
    aliases: ["часы ультра", "apple watch ultra", "эпл вотч ультра"],
  },
  {
    id: "watch-series-9",
    slug: "watch-series-9",
    name: "Apple Watch Series 9",
    category: "watch",
    price: 39990,
    image: watchS9,
    tagline: "Умнее. Ярче. Мощнее.",
    description: "Чип S9 SiP, новый жест Двойной щелчок и дисплей яркостью 2000 нит.",
    features: ["Чип S9 SiP", "Двойной щелчок", "До 2000 нит", "Always-On Retina"],
    colors: [
      { name: "Полуночный", hex: "#2a2e3a" },
      { name: "Сияющая звезда", hex: "#e8dcc8" },
      { name: "Серебристый", hex: "#d4d4d4" },
      { name: "Розовый", hex: "#f3c8c8" },
      { name: "Красный", hex: "#c8504a" },
    ],
    aliases: ["часы 9", "apple watch", "эпл вотч", "часы эпл"],
  },
  {
    id: "airpods-pro-2",
    slug: "airpods-pro-2",
    name: "AirPods Pro 2",
    category: "airpods",
    price: 24990,
    image: airpodsPro,
    tagline: "Адаптивный звук.",
    description:
      "Активное шумоподавление нового уровня, режим адаптивного звука и USB-C футляр.",
    features: ["Адаптивный звук", "Шумоподавление 2.0", "USB-C", "Прозрачный режим"],
    colors: [{ name: "Белый", hex: "#f1ede4" }],
    aliases: ["эирподс про", "airpods pro", "наушники про", "аирподс"],
  },
  {
    id: "airpods-max",
    slug: "airpods-max",
    name: "AirPods Max",
    category: "airpods",
    price: 59990,
    image: airpodsMax,
    tagline: "Высокоточный звук.",
    description: "Полноразмерные наушники с пространственным аудио и шумоподавлением.",
    features: ["Пространственное аудио", "Шумоподавление", "20 ч работы", "Premium-материалы"],
    colors: [
      { name: "Серебристый", hex: "#d4d4d4" },
      { name: "Серый космос", hex: "#5a5a5c" },
      { name: "Синий", hex: "#7a8cc8" },
      { name: "Розовый", hex: "#f3c8c8" },
      { name: "Зелёный", hex: "#bcd0b4" },
    ],
    aliases: ["эирподс макс", "airpods max", "наушники макс", "большие наушники"],
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const getProductsByCategory = (category: Category) => PRODUCTS.filter((p) => p.category === category);
