package com.worthit.service;

import com.worthit.dto.DashboardDTO;
import com.worthit.dto.NotificationDTO;
import com.worthit.dto.ProductDTO;
import com.worthit.dto.RepairDTO;
import com.worthit.model.enums.WarrantyStatus;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ProductService productService;
    private final RepairService repairService;
    private final NotificationService notificationService;

    public DashboardService(ProductService productService,
                            RepairService repairService,
                            NotificationService notificationService) {
        this.productService = productService;
        this.repairService = repairService;
        this.notificationService = notificationService;
    }

    public DashboardDTO.SummaryResponse getSummary(Long userId) {
        List<ProductDTO.ProductResponse> products = productService.getProductsForUser(userId, null, null);
        List<RepairDTO.RepairResponse> allRepairs = repairService.getAllRepairsForUser(userId);
        List<NotificationDTO.NotificationResponse> notifications = notificationService.getNotificationsForUser(userId);

        long totalProducts = products.size();
        long activeWarranties = products.stream().filter(p -> p.getStatus() == WarrantyStatus.ACTIVE).count();
        long expiringWarranties = products.stream().filter(p -> p.getStatus() == WarrantyStatus.EXPIRING_SOON).count();

        BigDecimal totalPortfolioValue = products.stream()
                .map(p -> p.getPrice() != null ? p.getPrice() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalRepairExpenses = allRepairs.stream()
                .map(r -> r.getCost() != null ? r.getCost() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double overallRepairRatio = 0.0;
        if (totalPortfolioValue.compareTo(BigDecimal.ZERO) > 0) {
            overallRepairRatio = totalRepairExpenses
                    .divide(totalPortfolioValue, 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"))
                    .doubleValue();
        }

        List<ProductDTO.ProductResponse> expiringSoonList = products.stream()
                .filter(p -> p.getStatus() == WarrantyStatus.EXPIRING_SOON)
                .collect(Collectors.toList());

        List<RepairDTO.RepairResponse> recentRepairs = allRepairs.stream()
                .limit(5)
                .collect(Collectors.toList());

        List<NotificationDTO.NotificationResponse> recentNotifications = notifications.stream()
                .limit(5)
                .collect(Collectors.toList());

        return DashboardDTO.SummaryResponse.builder()
                .totalProducts(totalProducts)
                .activeWarranties(activeWarranties)
                .expiringWarranties(expiringWarranties)
                .totalRepairExpenses(totalRepairExpenses)
                .totalPortfolioValue(totalPortfolioValue)
                .overallRepairRatioPercent(Math.round(overallRepairRatio * 10.0) / 10.0)
                .expiringSoonProducts(expiringSoonList)
                .recentRepairs(recentRepairs)
                .recentNotifications(recentNotifications)
                .build();
    }
}
