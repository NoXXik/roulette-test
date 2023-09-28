# Устанавливаем зависимости в отдельный слой контейнера
FROM node:alpine as builder

WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package.json package-lock.json ./

# Установка зависимостей
RUN npm install

# Копируем исходный код приложения
COPY . .

# Сборка React приложения с помощью Vite
RUN npm run build

# Второй этап остается без изменений
FROM nginx:alpine

VOLUME /etc/letsencrypt

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/.nginx/nginx.conf /etc/nginx/sites-enabled/default

COPY /etc/letsencrypt/live/csrun-x.ru/fullchain.pem /etc/letsencrypt/live/csrun-x.ru/fullchain.pem
COPY /etc/letsencrypt/live/csrun-x.ru/privkey.pem /etc/letsencrypt/live/csrun-x.ru/privkey.pem

# Открываем порт 80 для доступа к приложению
EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
