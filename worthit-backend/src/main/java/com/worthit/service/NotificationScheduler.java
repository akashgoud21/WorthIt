package com.worthit.service;

import com.worthit.model.Product;
import com.worthit.model.Warranty;
import com.worthit.model.enums.NotificationType;
import com.worthit.model.enums.WarrantyStatus;
import com.worthit.repository.NotificationRepository;
import com.worthit.repository.WarrantyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class NotificationScheduler {

    private static final Logger log = LoggerFactory.getLogger(NotificationScheduler.class);

    private final WarrantyRepository warrantyRepository;
    private final NotificationService notificationService;
    private final WarrantyService warrantyService;

    public NotificationScheduler(WarrantyRepository warrantyRepository,
                                 NotificationService notificationService,
                                 WarrantyService warrantyService) {
        this.warrantyRepository = warrantyRepository;
        this.notificationService = notificationService;
        this.warrantyService = warrantyService;
    }

    /**
     * Runs daily at 08:00 AM (and every hour in dev) to check upcoming warranty expiries
     */
    @Scheduled(cron = "0 0 8 * * *")
    @Scheduled(fixedDelay = 3600000, initialDelay = 10000)
    @Transactional
    public void scanAndGenerateWarrantyAlerts() {
        log.info("Running scheduled warranty expiry and maintenance check...");

        // 1. Evaluate all status flags
        warrantyService.evaluateAllWarrantyStatuses();

        // 2. Find warranties expiring in next 30 days
        LocalDate today = LocalDate.now();
        LocalDate next30Days = today.plusDays(30);

        List<Warranty> expiringList = warrantyRepository.findByExpiryDateBetweenAndStatusNot(
                today, next30Days, WarrantyStatus.EXPIRED
        );

        for (Warranty w : expiringList) {
            Product p = w.getProduct();
            if (p != null && p.getUser() != null) {
                long daysLeft = ChronoUnit.DAYS.between(today, w.getExpiryDate());
                String message = String.format(
                        "Warranty alert: %s warranty expires in %d days (%s). Check warranty claim or extension.",
                        p.getName(), daysLeft, w.getExpiryDate()
                );

                notificationService.createNotification(
                        p.getUser().getId(),
                        p.getId(),
                        NotificationType.WARRANTY_EXPIRY,
                        message
                );
            }
        }

        log.info("Completed scheduled warranty alert scan. Inspected {} items.", expiringList.size());
    }
}
