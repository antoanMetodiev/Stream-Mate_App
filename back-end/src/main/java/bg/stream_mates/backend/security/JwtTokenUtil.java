package bg.stream_mates.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenUtil {

    private static final String SECRET = System.getenv("JWT_MY_SECRET_KEY");

    // Проверка дали SECRET е зададен и дали е с достатъчна дължина
    private static final Key SECRET_KEY = initializeSecretKey();

    private static Key initializeSecretKey() {
        if (SECRET == null || SECRET.isEmpty()) {
            throw new RuntimeException("JWT secret key is not set in the environment variables");
        }

        // Уверяваме се, че SECRET е достатъчно дълъг (256 бита минимум)
        if (SECRET.length() < 32) {  // 32 * 8 = 256 бита
            throw new RuntimeException("JWT secret key must be at least 256 bits long");
        }

        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    public static String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 48))  // валидност 48 часа
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)  // използваме секретния ключ за подписване
                .compact();
    }

    public static String extractUsername(String token) {
        System.out.println("Decoding token: " + token);
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getSubject();
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            System.out.println("JWT token is expired: " + e.getMessage());
            throw new RuntimeException("JWT token is expired", e);
        } catch (io.jsonwebtoken.SignatureException e) {
            System.out.println("JWT signature does not match: " + e.getMessage());
            throw new RuntimeException("JWT signature mismatch", e);
        } catch (io.jsonwebtoken.MalformedJwtException e) {
            System.out.println("JWT token is malformed: " + e.getMessage());
            throw new RuntimeException("Malformed JWT token", e);
        } catch (Exception e) {
            System.out.println("Error decoding JWT: " + e.getMessage());
            throw new RuntimeException("Error decoding JWT", e);
        }
    }

    public static boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private static Date extractExpiration(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }

    public static boolean validateToken(String token, String username) {
        return (username.equals(extractUsername(token)) && !isTokenExpired(token));
    }
}
