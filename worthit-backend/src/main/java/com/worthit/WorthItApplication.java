package com.worthit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * WorthIt Application Entry Point
 *
 * @SpringBootApplication enables:
 *   - @Configuration     : marks this as a config class
 *   - @EnableAutoConfiguration : auto-configures Spring based on classpath
 *   - @ComponentScan     : scans all classes under com.worthit package
 */
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class WorthItApplication {

    public static void main(String[] args) {
        SpringApplication.run(WorthItApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("  WorthIt Backend Started Successfully!");
        System.out.println("  API Base URL: http://localhost:8080/api");
        System.out.println("  Health Check: http://localhost:8080/api/health");
        System.out.println("========================================\n");
    }
}
