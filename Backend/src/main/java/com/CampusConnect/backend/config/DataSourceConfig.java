package com.CampusConnect.backend.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.url:}")
    private String configuredUrl;

    @Value("${spring.datasource.username:}")
    private String configuredUsername;

    @Value("${spring.datasource.password:}")
    private String configuredPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String envDbUrl = System.getenv("DATABASE_URL");
        if (envDbUrl == null || envDbUrl.isBlank()) {
            envDbUrl = System.getenv("DB_URL");
        }
        if (envDbUrl == null || envDbUrl.isBlank()) {
            envDbUrl = configuredUrl;
        }

        HikariConfig config = new HikariConfig();

        if (envDbUrl != null && (envDbUrl.startsWith("postgres://") || envDbUrl.startsWith("postgresql://") || envDbUrl.startsWith("jdbc:postgresql://"))) {
            try {
                String raw = envDbUrl.startsWith("jdbc:") ? envDbUrl.substring(5) : envDbUrl;
                String clean = raw.replaceFirst("^postgres(ql)?://", "http://");
                URI uri = new URI(clean);
                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath();
                String query = uri.getQuery();

                String user = configuredUsername;
                String pass = configuredPassword;
                if (uri.getUserInfo() != null && !uri.getUserInfo().isBlank()) {
                    String[] parts = uri.getUserInfo().split(":", 2);
                    user = parts[0];
                    if (parts.length > 1) {
                        pass = parts[1];
                    }
                }

                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path + (query != null && !query.isBlank() ? "?" + query : "");
                try {
                    java.net.InetAddress.getByName(host);
                } catch (Exception ex) {
                    // Fall back to Neon Singapore IP with endpoint parameter if local DNS blocks .aws.neon.tech
                    String endpoint = host != null ? host.split("\\.")[0] : "";
                    String optParam = "options=endpoint%3D" + endpoint;
                    String q = (query != null && !query.isBlank()) ? query + "&" + optParam : optParam;
                    jdbcUrl = "jdbc:postgresql://52.76.212.156:" + port + path + "?" + q;
                }

                config.setJdbcUrl(jdbcUrl);
                config.setUsername(user);
                config.setPassword(pass);
            } catch (Exception e) {
                config.setJdbcUrl(envDbUrl.startsWith("jdbc:") ? envDbUrl : "jdbc:" + envDbUrl);
                config.setUsername(configuredUsername);
                config.setPassword(configuredPassword);
            }
        } else {
            config.setJdbcUrl(configuredUrl);
            config.setUsername(configuredUsername);
            config.setPassword(configuredPassword);
        }

        config.setDriverClassName("org.postgresql.Driver");
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        return new HikariDataSource(config);
    }
}
