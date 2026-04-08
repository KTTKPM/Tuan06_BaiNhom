package iuh.fit.foodService.config;

import com.zaxxer.hikari.HikariDataSource;
import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import org.springframework.util.StringUtils;

@Configuration
public class DataSourceConfig {

    @Bean
    @Primary
    public DataSource dataSource(Environment environment) {
        String jdbcUrl = firstNonBlank(
                environment.getProperty("DB_URL"),
                environment.getProperty("spring.datasource.url"),
                "jdbc:mariadb://localhost:3306/food_service"
        );

        String username = firstNonBlank(
                environment.getProperty("DB_USERNAME"),
                environment.getProperty("spring.datasource.username"),
                "root"
        );

        String password = firstNonBlank(
                environment.getProperty("DB_PASSWORD"),
                environment.getProperty("spring.datasource.password"),
                "root"
        );

        HikariDataSource dataSource = new HikariDataSource();
        dataSource.setDriverClassName("org.mariadb.jdbc.Driver");
        dataSource.setJdbcUrl(jdbcUrl);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (StringUtils.hasText(value)) {
                return value;
            }
        }
        return "";
    }
}
