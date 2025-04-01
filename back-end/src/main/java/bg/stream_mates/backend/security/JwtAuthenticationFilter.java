package bg.stream_mates.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final RedisTemplate<String, String> redisTemplate;

    public JwtAuthenticationFilter(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        Cookie[] cookies = request.getCookies();
        String uri = request.getRequestURI();
        String customHeader = request.getHeader("X-Custom-Logout");
        if (checkIfIsLogin(customHeader, cookies, response)) return;

        // Ако заявката е за login или register, няма нужда от токен, понеже няма да има още!
        if (uri.equals("/login") || uri.equals("/register") || uri.equals("/actuator/health")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("JWT_TOKEN".equals(cookie.getName())) {
                    token = cookie.getValue();
                }
            }
        }

        String userId = JwtTokenUtil.extractId(token);

        if (token != null && JwtTokenUtil.validateToken(token, userId)) {

            RedisConnection connection = redisTemplate.getConnectionFactory().getConnection();
            byte[] rawValue = connection.get(userId.getBytes());
            String storedToken = rawValue != null ? new String(rawValue) : null;

            if (storedToken != null && storedToken.equals(token)) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userId, null, null);

                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean checkIfIsLogin(String customHeader, Cookie[] cookies, HttpServletResponse response) {
        // Ако заявката е към /logout и има специален header
        if (customHeader != null && customHeader.equals("true")) {
            // Изтриване на токена от Redis
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("JWT_TOKEN".equals(cookie.getName())) {
                        String token = cookie.getValue();
                        String userId = JwtTokenUtil.extractId(token);
                        redisTemplate.delete(userId);

                        // Инвалидиране на бисквитката
                        Cookie invalidCookie = new Cookie("JWT_TOKEN", "");
                        invalidCookie.setMaxAge(0);
                        invalidCookie.setPath("/");
                        response.addCookie(invalidCookie);
                        response.setStatus(HttpServletResponse.SC_OK);
                        return true; // Спирам веригата от филтри
                    }
                }
            }
        }
        return false;
    }
}
