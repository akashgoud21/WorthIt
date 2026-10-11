package com.worthit.service;

import com.worthit.dto.RepairDTO;
import com.worthit.model.Product;
import com.worthit.model.Repair;
import com.worthit.repository.ProductRepository;
import com.worthit.repository.RepairRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RepairService {

    private final RepairRepository repairRepository;
    private final ProductRepository productRepository;

    public RepairService(RepairRepository repairRepository,
                         ProductRepository productRepository) {
        this.repairRepository = repairRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public RepairDTO.RepairResponse logRepair(RepairDTO.RepairRequest request, Long userId) {
        Product product = productRepository.findByIdAndUserId(request.getProductId(), userId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found or does not belong to user"));

        Repair repair = new Repair(
                product,
                request.getCost(),
                request.getServiceCenter().trim(),
                request.getRepairDate(),
                request.getDescription() != null ? request.getDescription().trim() : ""
        );

        Repair saved = repairRepository.save(repair);
        return mapToResponse(saved);
    }

    public List<RepairDTO.RepairResponse> getRepairsByProductId(Long productId, Long userId) {
        productRepository.findByIdAndUserId(productId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found or access denied"));

        return repairRepository.findByProductIdOrderByRepairDateDesc(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<RepairDTO.RepairResponse> getAllRepairsForUser(Long userId) {
        List<Product> products = productRepository.findByUserId(userId);
        return products.stream()
                .flatMap(p -> repairRepository.findByProductIdOrderByRepairDateDesc(p.getId()).stream())
                .sorted((a, b) -> b.getRepairDate().compareTo(a.getRepairDate()))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public RepairDTO.RepairAnalyticsResponse getRepairAnalytics(Long productId, Long userId) {
        Product product = productRepository.findByIdAndUserId(productId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found or access denied"));

        BigDecimal totalCost = repairRepository.sumCostByProductId(productId);
        long count = repairRepository.countByProductId(productId);

        double ratioPercent = 0.0;
        if (product.getPrice() != null && product.getPrice().compareTo(BigDecimal.ZERO) > 0) {
            ratioPercent = totalCost
                    .divide(product.getPrice(), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"))
                    .doubleValue();
        }

        String recommendation;
        if (ratioPercent >= 50.0) {
            recommendation = "REPLACE_RECOMMENDED (Repair costs exceed 50% of original device price)";
        } else if (ratioPercent >= 25.0) {
            recommendation = "MONITOR_CLOSELY (Repair costs approaching critical threshold)";
        } else {
            recommendation = "REPAIR_RECOMMENDED (Device maintenance remains economical)";
        }

        List<RepairDTO.RepairResponse> repairs = repairRepository.findByProductIdOrderByRepairDateDesc(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return RepairDTO.RepairAnalyticsResponse.builder()
                .productId(product.getId())
                .productName(product.getName())
                .productPrice(product.getPrice())
                .totalRepairCost(totalCost)
                .repairCount(count)
                .repairCostRatioPercent(Math.round(ratioPercent * 10.0) / 10.0)
                .recommendation(recommendation)
                .repairs(repairs)
                .build();
    }

    public RepairDTO.RepairResponse mapToResponse(Repair r) {
        return RepairDTO.RepairResponse.builder()
                .id(r.getId())
                .productId(r.getProduct() != null ? r.getProduct().getId() : null)
                .productName(r.getProduct() != null ? r.getProduct().getName() : "")
                .productBrand(r.getProduct() != null ? r.getProduct().getBrand() : "")
                .cost(r.getCost())
                .serviceCenter(r.getServiceCenter())
                .repairDate(r.getRepairDate())
                .description(r.getDescription())
                .build();
    }
}
