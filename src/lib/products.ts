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
  colors: string[];
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
    id: "iphone-15-pro-max",
    slug: "iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    category: "iphone",
    price: 139990,
    oldPrice: 159990,
    image: iphone15Pro,
    tagline: "Титан. Прочный. Лёгкий. Pro.",
    description:
      "Корпус из титана аэрокосмического класса, чип A17 Pro и совершенно новая система камер с 5-кратным телеобъективом.",
    features: [
      "Дисплей Super Retina XDR 6.7\"",
      "Чип A17 Pro",
      "Камера 48 МП Pro",
      "Кнопка «Действие»",
      "USB-C",
    ],
    colors: ["Натуральный титан", "Синий титан", "Белый титан", "Чёрный титан"],
    aliases: ["айфон 15 про макс", "iphone 15 pro max", "айфон про макс"],
  },
  {
    id: "iphone-15",
    slug: "iphone-15",
    name: "iPhone 15",
    category: "iphone",
    price: 79990,
    image: iphone15,
    tagline: "Новая эра iPhone.",
    description:
      "Динамический остров, основная камера 48 Мп с 2× оптическим зумом и USB-C — всё в потрясающем дизайне.",
    features: ["Динамический остров", "Камера 48 МП", "USB-C", "Чип A16 Bionic"],
    colors: ["Розовый", "Жёлтый", "Зелёный", "Голубой", "Чёрный"],
    aliases: ["айфон 15", "iphone 15"],
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
      "Дисплей Ultra Retina XDR с технологией Tandem OLED и революционный чип M4. Самый тонкий iPad в истории.",
    features: ["Чип M4", "Tandem OLED", "Apple Pencil Pro", "Magic Keyboard"],
    colors: ["Серебристый", "Чёрный космос"],
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
    colors: ["Серый космос", "Синий", "Фиолетовый", "Сияющая звезда"],
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
      "Новый чип M3 Max обеспечивает невероятную производительность для самых требовательных рабочих процессов.",
    features: ["M3 Max до 16-ядер CPU", "До 128 ГБ ОЗУ", "Liquid Retina XDR 16\"", "До 22 ч работы"],
    colors: ["Чёрный космос", "Серебристый"],
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
    colors: ["Полуночный", "Сияющая звезда", "Серебристый", "Серый космос"],
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
      "Самые прочные и совершенные Apple Watch. Корпус из титана, дисплей яркостью 3000 нит.",
    features: ["Титановый корпус 49 мм", "До 36 ч работы", "GPS L1+L5", "Функция Двойной щелчок"],
    colors: ["Натуральный титан"],
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
    description:
      "Чип S9 SiP, новый жест Двойной щелчок и дисплей яркостью 2000 нит.",
    features: ["Чип S9 SiP", "Двойной щелчок", "Дисплей до 2000 нит", "Always-On Retina"],
    colors: ["Полуночный", "Сияющая звезда", "Серебристый", "Розовый", "Красный"],
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
      "Активное шумоподавление нового уровня, режим адаптивного звука и USB-C зарядный футляр.",
    features: ["Адаптивный звук", "Шумоподавление 2.0", "USB-C", "Прозрачный режим"],
    colors: ["Белый"],
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
    description:
      "Полноразмерные наушники с пространственным аудио и активным шумоподавлением.",
    features: ["Пространственное аудио", "Шумоподавление", "20 ч работы", "Premium-материалы"],
    colors: ["Серебристый", "Серый космос", "Синий", "Розовый", "Зелёный"],
    aliases: ["эирподс макс", "airpods max", "наушники макс", "большие наушники"],
  },
];

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price);

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const getProductsByCategory = (category: Category) => PRODUCTS.filter((p) => p.category === category);
