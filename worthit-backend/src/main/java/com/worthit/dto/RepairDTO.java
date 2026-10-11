package com.worthit.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class RepairDTO {

    public static class RepairRequest {
        @NotNull(message = "Product ID is required")
        private Long productId;

        @NotNull(message = "Cost is required")
        @Positive(message = "Cost must be positive")
        private BigDecimal cost;

        @NotBlank(message = "Service center is required")
        private String serviceCenter;

        @NotNull(message = "Repair date is required")
        private LocalDate repairDate;

        private String description;

        public RepairRequest() {}

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public BigDecimal getCost() { return cost; }
        public void setCost(BigDecimal cost) { this.cost = cost; }

        public String getServiceCenter() { return serviceCenter; }
        public void setServiceCenter(String serviceCenter) { this.serviceCenter = serviceCenter; }

        public LocalDate getRepairDate() { return repairDate; }
        public void setRepairDate(LocalDate repairDate) { this.repairDate = repairDate; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class RepairResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String productBrand;
        private BigDecimal cost;
        private String serviceCenter;
        private LocalDate repairDate;
        private String description;

        public RepairResponse() {}

        public RepairResponse(Long id, Long productId, String productName, String productBrand,
                              BigDecimal cost, String serviceCenter, LocalDate repairDate, String description) {
            this.id = id;
            this.productId = productId;
            this.productName = productName;
            this.productBrand = productBrand;
            this.cost = cost;
            this.serviceCenter = serviceCenter;
            this.repairDate = repairDate;
            this.description = description;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private Long id;
            private Long productId;
            private String productName;
            private String productBrand;
            private BigDecimal cost;
            private String serviceCenter;
            private LocalDate repairDate;
            private String description;

            public Builder id(Long id) { this.id = id; return this; }
            public Builder productId(Long productId) { this.productId = productId; return this; }
            public Builder productName(String productName) { this.productName = productName; return this; }
            public Builder productBrand(String productBrand) { this.productBrand = productBrand; return this; }
            public Builder cost(BigDecimal cost) { this.cost = cost; return this; }
            public Builder serviceCenter(String serviceCenter) { this.serviceCenter = serviceCenter; return this; }
            public Builder repairDate(LocalDate repairDate) { this.repairDate = repairDate; return this; }
            public Builder description(String description) { this.description = description; return this; }

            public RepairResponse build() {
                return new RepairResponse(id, productId, productName, productBrand, cost, serviceCenter, repairDate, description);
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public String getProductBrand() { return productBrand; }
        public void setProductBrand(String productBrand) { this.productBrand = productBrand; }

        public BigDecimal getCost() { return cost; }
        public void setCost(BigDecimal cost) { this.cost = cost; }

        public String getServiceCenter() { return serviceCenter; }
        public void setServiceCenter(String serviceCenter) { this.serviceCenter = serviceCenter; }

        public LocalDate getRepairDate() { return repairDate; }
        public void setRepairDate(LocalDate repairDate) { this.repairDate = repairDate; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class RepairAnalyticsResponse {
        private Long productId;
        private String productName;
        private BigDecimal productPrice;
        private BigDecimal totalRepairCost;
        private Long repairCount;
        private Double repairCostRatioPercent;
        private String recommendation;
        private List<RepairResponse> repairs = new ArrayList<>();

        public RepairAnalyticsResponse() {}

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private Long productId;
            private String productName;
            private BigDecimal productPrice;
            private BigDecimal totalRepairCost;
            private Long repairCount;
            private Double repairCostRatioPercent;
            private String recommendation;
            private List<RepairResponse> repairs = new ArrayList<>();

            public Builder productId(Long productId) { this.productId = productId; return this; }
            public Builder productName(String productName) { this.productName = productName; return this; }
            public Builder productPrice(BigDecimal productPrice) { this.productPrice = productPrice; return this; }
            public Builder totalRepairCost(BigDecimal totalRepairCost) { this.totalRepairCost = totalRepairCost; return this; }
            public Builder repairCount(Long repairCount) { this.repairCount = repairCount; return this; }
            public Builder repairCostRatioPercent(Double repairCostRatioPercent) { this.repairCostRatioPercent = repairCostRatioPercent; return this; }
            public Builder recommendation(String recommendation) { this.recommendation = recommendation; return this; }
            public Builder repairs(List<RepairResponse> repairs) { this.repairs = repairs; return this; }

            public RepairAnalyticsResponse build() {
                RepairAnalyticsResponse res = new RepairAnalyticsResponse();
                res.productId = this.productId;
                res.productName = this.productName;
                res.productPrice = this.productPrice;
                res.totalRepairCost = this.totalRepairCost;
                res.repairCount = this.repairCount;
                res.repairCostRatioPercent = this.repairCostRatioPercent;
                res.recommendation = this.recommendation;
                res.repairs = this.repairs;
                return res;
            }
        }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public BigDecimal getProductPrice() { return productPrice; }
        public void setProductPrice(BigDecimal productPrice) { this.productPrice = productPrice; }

        public BigDecimal getTotalRepairCost() { return totalRepairCost; }
        public void setTotalRepairCost(BigDecimal totalRepairCost) { this.totalRepairCost = totalRepairCost; }

        public Long getRepairCount() { return repairCount; }
        public void setRepairCount(Long repairCount) { this.repairCount = repairCount; }

        public Double getRepairCostRatioPercent() { return repairCostRatioPercent; }
        public void setRepairCostRatioPercent(Double repairCostRatioPercent) { this.repairCostRatioPercent = repairCostRatioPercent; }

        public String getRecommendation() { return recommendation; }
        public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

        public List<RepairResponse> getRepairs() { return repairs; }
        public void setRepairs(List<RepairResponse> repairs) { this.repairs = repairs; }
    }
}
