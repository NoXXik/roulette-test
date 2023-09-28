#!/bin/bash

# Загрузите переменные окружения из файла .env (путь к файлу может быть другим)
source .version

# Увеличиваем версию приложения при каждом запуске
APP_VERSION=$((APP_VERSION + 1))

# Пересоберите Docker образ с новой версией приложения
docker build -t client-app:$APP_VERSION .
echo "Сборка Docker образ успешно завершен"

# Тегируйте образ для локального реестра Docker image
docker tag client-app:$APP_VERSION localhost:5000/client-app:$APP_VERSION

docker push localhost:5000/client-app:$APP_VERSION

# Изменение версии в файле манифесте
sed "s/localhost:5000\/client-app:$((APP_VERSION - 1))/localhost:5000\/client-app:$APP_VERSION/" ../k8s/client-deployment.yaml > ../k8s/client-deployment-temp.yaml
# Переименовываем временный файл обратно на исходный
mv ../k8s/client-deployment-temp.yaml ../k8s/client-deployment.yaml

kubectl apply -f ../k8s/client-deployment.yaml

# Обновите переменную окружения в файле .env
echo "APP_VERSION=$APP_VERSION" > .version

# Вывод информации о новой версии
echo "Создан Docker образ с версией client-app:$APP_VERSION и тегом localhost:5000/client-app:$APP_VERSION"
