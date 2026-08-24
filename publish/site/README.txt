Карта налога и применимости — файлы для публикации

Это интерактивная страница (React, всё считается в браузере).
На сервере Node.js не нужен: достаточно любых статических файлов.


1. Самый короткий путь

Папка `site/` — готовый сайт. Её содержимое (index.html, папка _next, favicon.ico)
нужно положить в КОРЕНЬ публичного домена, не во вложенную папку.

Варианты:
  • Cloudflare Pages, Netlify, GitHub Pages — перетащить папку `site`
    или указать её как publish directory.
  • Любой nginx / Apache / S3 / Object Storage — залить содержимое `site/`
    в корень бакета или в html-директорию.

После заливки страница открывается по адресу вида https://ваш-домен/


2. Nginx, если домен уже есть

  server {
      listen 443 ssl;
      server_name map.example.com;
      root /var/www/intranet-map;
      index index.html;
      location / {
          try_files $uri $uri/ /index.html;
      }
      location /_next/static/ {
          add_header Cache-Control "public, max-age=31536000, immutable";
      }
  }

Скопируйте содержимое `site/` в /var/www/intranet-map.


3. Если нужен подкаталог, а не корень домена

Сейчас пути абсолютные: /_next/...  Страница НЕ заработает в
https://example.com/map/ без пересборки с basePath. Собирайте из `source/`
(см. ниже) и задайте basePath в next.config.ts.


4. Пересборка из исходников (Vercel, свой Node, смена данных)

Папка `source/` — Next.js-проект без node_modules.

  cd source
  npm install
  npm run build        # снова получите папку out/ — это и есть сайт
  npx serve out        # локальная проверка

На Vercel: New Project → загрузить `source/` (или привязать git).
Команды по умолчанию: npm install && npm run build.
Каталог публикации при output: "export" — `out`.

Сценарии, роли и механики правятся в:
  source/src/lib/scenarios.ts
  source/src/lib/mechanics.ts
  source/src/lib/axes.ts


5. Что не входит и не нужно

  node_modules, .next, git — на хостинг это не кладётся.
  Серверных API, базы и секретов нет.
