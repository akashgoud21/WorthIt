package com.worthit.service;

import com.worthit.model.Document;
import com.worthit.model.Product;
import com.worthit.model.Repair;
import com.worthit.model.User;
import com.worthit.model.Warranty;
import com.worthit.model.enums.DocumentType;
import com.worthit.model.enums.NotificationType;
import com.worthit.model.enums.WarrantyStatus;
import com.worthit.repository.DocumentRepository;
import com.worthit.repository.ProductRepository;
import com.worthit.repository.RepairRepository;
import com.worthit.repository.WarrantyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final AuthService authService;
    private final ProductRepository productRepository;
    private final WarrantyRepository warrantyRepository;
    private final RepairRepository repairRepository;
    private final DocumentRepository documentRepository;
    private final NotificationService notificationService;

    public DataInitializer(AuthService authService,
                           ProductRepository productRepository,
                           WarrantyRepository warrantyRepository,
                           RepairRepository repairRepository,
                           DocumentRepository documentRepository,
                           NotificationService notificationService) {
        this.authService = authService;
        this.productRepository = productRepository;
        this.warrantyRepository = warrantyRepository;
        this.repairRepository = repairRepository;
        this.documentRepository = documentRepository;
        this.notificationService = notificationService;
    }

    @Override
    public void run(String... args) {
        User demoUser = authService.getOrCreateDemoUser();

        if (productRepository.countByUserId(demoUser.getId()) == 0) {
            log.info("Seeding initial demo products into MySQL database...");

            // 1. MacBook Air M2 (Expired)
            Product p1 = new Product();
            p1.setUser(demoUser);
            p1.setName("MacBook Air M2 (13.6-inch)");
            p1.setCategory("Electronics");
            p1.setBrand("Apple");
            p1.setPrice(new BigDecimal("99900.00"));
            p1.setPurchaseDate(LocalDate.of(2024, 3, 15));
            p1 = productRepository.save(p1);

            Warranty w1 = new Warranty(p1, 12, LocalDate.of(2025, 3, 15));
            w1.setStatus(WarrantyStatus.EXPIRED);
            warrantyRepository.save(w1);

            Repair r1 = new Repair(p1, new BigDecimal("4500.00"), "Apple Authorised Service (Imagine)",
                    LocalDate.of(2024, 11, 10), "USB-C charging port inspection and cleaning");
            repairRepository.save(r1);

            Document d1 = new Document(p1, "/uploads/apple_invoice_2024.pdf", "apple_invoice_2024.pdf", DocumentType.INVOICE);
            d1.setExtractedData("{\"price\": 99900, \"purchaseDate\": \"2024-03-15\", \"warrantyMonths\": 12}");
            documentRepository.save(d1);

            // 2. Samsung 55" 4K TV (Expiring Soon)
            Product p2 = new Product();
            p2.setUser(demoUser);
            p2.setName("Samsung 55\" Crystal 4K UHD Smart TV");
            p2.setCategory("Home Appliances");
            p2.setBrand("Samsung");
            p2.setPrice(new BigDecimal("48990.00"));
            p2.setPurchaseDate(LocalDate.of(2025, 11, 1));
            p2 = productRepository.save(p2);

            Warranty w2 = new Warranty(p2, 12, LocalDate.of(2026, 11, 1));
            w2.setStatus(WarrantyStatus.EXPIRING_SOON);
            warrantyRepository.save(w2);

            Document d2 = new Document(p2, "/uploads/samsung_tv_bill.pdf", "samsung_tv_bill.pdf", DocumentType.INVOICE);
            d2.setExtractedData("{\"price\": 48990, \"purchaseDate\": \"2025-11-01\", \"warrantyMonths\": 12}");
            documentRepository.save(d2);

            // 3. LG Front Load Washing Machine (Active)
            Product p3 = new Product();
            p3.setUser(demoUser);
            p3.setName("LG Inverter Direct Drive Front Load 8kg");
            p3.setCategory("Home Appliances");
            p3.setBrand("LG");
            p3.setPrice(new BigDecimal("38500.00"));
            p3.setPurchaseDate(LocalDate.of(2026, 2, 20));
            p3 = productRepository.save(p3);

            Warranty w3 = new Warranty(p3, 24, LocalDate.of(2028, 2, 20));
            w3.setStatus(WarrantyStatus.ACTIVE);
            warrantyRepository.save(w3);

            Repair r2 = new Repair(p3, new BigDecimal("1200.00"), "LG Official Care",
                    LocalDate.of(2026, 8, 14), "Water inlet valve filter replacement and routine descaling");
            repairRepository.save(r2);

            Document d3 = new Document(p3, "/uploads/lg_washing_machine_croma.pdf", "lg_washing_machine_croma.pdf", DocumentType.INVOICE);
            documentRepository.save(d3);

            // 4. Sony WH-1000XM5 (Active)
            Product p4 = new Product();
            p4.setUser(demoUser);
            p4.setName("Sony WH-1000XM5 Wireless Headphones");
            p4.setCategory("Electronics");
            p4.setBrand("Sony");
            p4.setPrice(new BigDecimal("26990.00"));
            p4.setPurchaseDate(LocalDate.of(2026, 9, 1));
            p4 = productRepository.save(p4);

            Warranty w4 = new Warranty(p4, 12, LocalDate.of(2027, 9, 1));
            w4.setStatus(WarrantyStatus.ACTIVE);
            warrantyRepository.save(w4);

            Document d4 = new Document(p4, "/uploads/sony_xm5_amazon.pdf", "sony_xm5_amazon.pdf", DocumentType.INVOICE);
            documentRepository.save(d4);

            // 5. Dyson V12 (Active)
            Product p5 = new Product();
            p5.setUser(demoUser);
            p5.setName("Dyson V12 Detect Slim Cordless Vacuum");
            p5.setCategory("Home Appliances");
            p5.setBrand("Dyson");
            p5.setPrice(new BigDecimal("49900.00"));
            p5.setPurchaseDate(LocalDate.of(2025, 5, 10));
            p5 = productRepository.save(p5);

            Warranty w5 = new Warranty(p5, 24, LocalDate.of(2027, 5, 10));
            w5.setStatus(WarrantyStatus.ACTIVE);
            warrantyRepository.save(w5);

            Repair r3 = new Repair(p5, new BigDecimal("3200.00"), "Dyson Direct Service Hub",
                    LocalDate.of(2026, 4, 12), "Battery pack sensor reset and motor head filter refresh");
            repairRepository.save(r3);

            Document d5 = new Document(p5, "/uploads/dyson_store_invoice.pdf", "dyson_store_invoice.pdf", DocumentType.INVOICE);
            documentRepository.save(d5);

            // Seed notifications
            notificationService.createNotification(
                    demoUser.getId(),
                    p2.getId(),
                    NotificationType.WARRANTY_EXPIRY,
                    "Warranty expiring soon for Samsung 55\" Crystal 4K UHD Smart TV (November 1, 2026). Schedule inspection or check warranty renewal."
            );

            notificationService.createNotification(
                    demoUser.getId(),
                    p3.getId(),
                    NotificationType.SERVICE_DUE,
                    "6-month preventive drum sanitation service recommended by LG care guide."
            );

            log.info("Database seeding completed successfully for demo user.");
        }
    }
}
