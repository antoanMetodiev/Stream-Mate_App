FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

COPY gradle gradle
COPY build.gradle.kts settings.gradle.kts gradlew ./
COPY src src

RUN chmod +x ./gradlew \
    && ./gradlew build --no-daemon

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]