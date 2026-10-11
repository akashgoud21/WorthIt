package com.worthit.service;

import com.worthit.dto.WarrantyDTO;
import com.worthit.model.Product;
import com.worthit.model.Warranty;
import com.worthit.model.enums.WarrantyStatus;
import com.worthit.repository.WarrantyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WarrantyService {

    private final WarrantyRepository warrantyRepository;

    public WarrantyService(WarrantyRepository warrantyRepository) {
        this.warrantyRepository = warrantyRepository;
    }

    public List<WarrantyDTO.WarrantyResponse> getAllWarrantiesForUser(Long userId) {
        return warrantyRepository.findAllByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<WarrantyDTO.WarrantyResponse> getExpiringSoonWarranties(Long userId, int thresholdDays) {
        LocalDate today = LocalDate.now();
        LocalDate threshold = today.plusDays(thresholdDays);
        return warrantyRepository.findExpiringSoon(userId, today, threshold).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void evaluateAllWarrantyStatuses() {
        LocalDate today = LocalDate.now();
        List<Warranty> allWarranties = warrantyRepository.findAll();

        for (Warranty w : allWarranties) {
            if (w.getExpiryDate() != null) {
                long days = ChronoUnit.DAYS.between(today, w.getExpiryDate());
                if (days < 0) {
                    w.setStatus(WarrantyStatus.EXPIRED);
                } else if (days <= 30) {
                    w.setStatus(WarrantyStatus.EXPIRING_SOON);
                } else {
                    w.setStatus(WarrantyStatus.ACTIVE);
                }
            }
        }
        warrantyRepository.saveAll(allWarranties);
    }

    public WarrantyDTO.WarrantyResponse mapToResponse(Warranty w) {
        Product p = w.getProduct();
        LocalDate today = LocalDate.now();
        long daysRemaining = w.getExpiryDate() != null
                ? ChronoUnit.DAYS.between(today, w.getExpiryDate())
                : 0;

        WarrantyStatus status = w.getStatus();
        if (w.getExpiryDate() != null) {
            if (daysRemaining < 0) {
                status = WarrantyStatus.EXPIRED;
            } else if (daysRemaining <= 30) {
                status = WarrantyStatus.EXPIRING_SOON;
            } else {
                status = WarrantyStatus.ACTIVE;
            }
        }

        String invoiceFileName = null;
        try {
            if (p != null && p.getDocuments() != null && !p.getDocuments().isEmpty()) {
                invoiceFileName = p.getDocuments().get(0).getFileName();
            }
        } catch (Exception ignored) {
            invoiceFileName = null;
        }

        return WarrantyDTO.WarrantyResponse.builder()
                .id(w.getId())
                .productId(p != null ? p.getId() : null)
                .productName(p != null ? p.getName() : "")
                .brand(p != null ? p.getBrand() : "")
                .category(p != null ? p.getCategory() : "")
                .purchaseDate(p != null ? p.getPurchaseDate() : null)
                .warrantyPeriod(w.getWarrantyPeriod())
                .expiryDate(w.getExpiryDate())
                .daysRemaining(daysRemaining)
                .status(status)
                .invoiceFileName(invoiceFileName)
                .build();
    }
}
