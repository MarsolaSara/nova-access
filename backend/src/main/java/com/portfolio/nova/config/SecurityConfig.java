package com.portfolio.nova.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Configuration
public class SecurityConfig {

    // Conta fictícia criada somente para a demonstração do portfólio.
    private static final String DEMO_EMAIL = "sara@demo.com";
    private static final String DEMO_PASSWORD = "Demo@123";

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder) {
        return new InMemoryUserDetailsManager(
                User.withUsername(DEMO_EMAIL)
                        .password(encoder.encode(DEMO_PASSWORD))
                        .roles("USER")
                        .build()
        );
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CSRF permanece habilitado para login e logout. O frontend recebe o
            // token via GET /api/auth/csrf e o envia em X-CSRF-TOKEN.
            .csrf(csrf -> csrf.csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers(HttpMethod.GET, "/api/auth/csrf").permitAll()
                    .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                    .anyRequest().authenticated()
            )
            .exceptionHandling(exceptions -> exceptions.authenticationEntryPoint(
                    (request, response, error) -> writeJson(
                            response, 401,
                            "{\"error\":\"Faça login para continuar.\"}"
                    )
            ))
            // Filtro de autenticação do próprio Spring Security: cria e mantém
            // a sessão HTTP, sem token fictício ou credencial no localStorage.
            .formLogin(form -> form
                    .loginProcessingUrl("/api/auth/login")
                    .successHandler((request, response, authentication) -> writeJson(
                            response, 200,
                            "{\"name\":\"Sara\",\"email\":\"sara@demo.com\"}"
                    ))
                    .failureHandler((request, response, error) -> writeJson(
                            response, 401,
                            "{\"error\":\"E-mail ou senha incorretos.\"}"
                    ))
            )
            .logout(logout -> logout
                    .logoutUrl("/api/auth/logout")
                    .invalidateHttpSession(true)
                    .clearAuthentication(true)
                    .deleteCookies("JSESSIONID")
                    .logoutSuccessHandler((request, response, authentication) ->
                            response.setStatus(HttpServletResponse.SC_NO_CONTENT))
            )
            .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }

    private static void writeJson(HttpServletResponse response, int status, String json)
            throws IOException {
        response.setStatus(status);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setHeader("Cache-Control", "no-store");
        response.getWriter().write(json);
    }
}
