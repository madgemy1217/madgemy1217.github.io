# Деплой на GitHub Pages

## Шаги

1. Собери проект:
   ```bash
   npm install
   npm run build
   ```
   Готовый сайт будет в папке `dist/`.

2. Залей содержимое `dist/` в GitHub-репозиторий.

   **Вариант A — отдельная ветка `gh-pages` (рекомендую):**
   - Создай в репозитории ветку `gh-pages`.
   - Положи туда **содержимое** папки `dist/` (не саму папку, а её файлы: `index.html`, `assets/`, `products.json`, `.nojekyll`).
   - В Settings → Pages выбери Source: `Deploy from a branch`, Branch: `gh-pages`, Folder: `/ (root)`.

   **Вариант B — папка `docs/` в `main`:**
   - Переименуй `dist/` в `docs/` и закоммить в `main`.
   - В Settings → Pages выбери Branch: `main`, Folder: `/docs`.

3. Сайт откроется по адресу:
   - `https://USERNAME.github.io/REPO/` — для обычного репо
   - `https://USERNAME.github.io/` — если репо называется `USERNAME.github.io`

## Как обновлять товары

1. Открой свой сайт, перейди по адресу `https://твой-сайт/#/login`
2. Логин: `root`, пароль: `1234`
3. Редактируй товары/категории — изменения сохранятся в твоём браузере
4. Нажми **«Скачать products.json»**
5. Замени файл `products.json` в репозитории (в той же папке, где `index.html`)
6. Коммить — GitHub Pages обновит сайт через ~1 минуту

## Важно

- Файл `.nojekyll` обязательно должен быть в корне сайта (он уже создан в `public/`).
- Картинки лежат в папке `assets/` рядом с `index.html`.
- Если меняешь картинки — клади их в `public/assets/` перед сборкой, потом ссылайся в админке как `./assets/имя.jpg`.
