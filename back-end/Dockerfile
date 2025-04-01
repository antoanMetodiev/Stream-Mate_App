# Етап 1: Създаване на JAR файла
FROM ubuntu:latest AS build

RUN apt-get update
RUN apt-get install openjdk-17-jdk -y

WORKDIR /app

# Копиране на всички файлове от проекта в контейнера
COPY . .

# Дава права за изпълнение на gradlew (ако е нужно)
RUN chmod +x ./gradlew

# Изграждане на JAR файла
RUN ./gradlew bootJar --no-daemon

# Етап 2: Създаване на финален образ
FROM openjdk:17-jdk-slim

WORKDIR /app

# Излагане на порта, на който ще работи приложението
EXPOSE 8080

# Копиране на JAR файла от предишния етап в правилната директория
COPY --from=build /app/build/libs/*.jar app.jar

# Стартиране на приложението
ENTRYPOINT ["java", "-jar", "app.jar"]