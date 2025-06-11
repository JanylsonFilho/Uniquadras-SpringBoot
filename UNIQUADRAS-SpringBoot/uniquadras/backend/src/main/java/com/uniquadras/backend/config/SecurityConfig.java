// UNIQUADRAS-SpringBoot/uniquadras/backend/src/main/java/com/uniquadras/backend/config/SecurityConfig.java
package com.uniquadras.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer; // Importar para desabilitar csrf
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity // Habilita a segurança web do Spring
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configuração da cadeia de filtros de segurança
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // Desabilita CSRF (necessário para APIs REST sem sessões)
            .authorizeHttpRequests(authorize -> authorize
                // Permite acesso irrestrito a todas as rotas de API para testes (ajuste conforme necessário para segurança real)
                .requestMatchers("/**").permitAll() 
                .anyRequest().authenticated() // Todas as outras requisições exigem autenticação
            );
        return http.build();
    }

    // Bean para configurar CORS em nível de filtro (necessário quando Spring Security está ativo)
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true); // Permite envio de cookies, cabeçalhos de autorização, etc.
        config.addAllowedOrigin("http://localhost:5173"); // Permite requisições do seu frontend
        config.addAllowedHeader("*"); // Permite todos os cabeçalhos
        config.addAllowedMethod("*"); // Permite todos os métodos HTTP (GET, POST, PUT, DELETE, PATCH, OPTIONS)
        source.registerCorsConfiguration("/**", config); // Aplica a configuração CORS a todas as rotas
        return new CorsFilter(source);
    }
}