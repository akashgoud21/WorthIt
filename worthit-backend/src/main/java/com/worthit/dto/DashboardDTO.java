package com.worthit.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class DashboardDTO {

    public static class SummaryResponse {
        private long totalProducts;
        private long activeWarranties;
        private long expiringWarranties;
        private BigDecimal totalRepairExpenses;
        private BigDecimal totalPortfolioValue;
        private Double overallRepairRatioPercent;
        private List<ProductDTO.ProductResponse> expiringSoonProducts = new ArrayList<>();
        private List<RepairDTO.RepairResponse> recentRepairs = new ArrayList<>();
        private List<NotificationDTO.NotificationResponse> recentNotifications = new ArrayList<>();

        public SummaryResponse() {}

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private long totalProducts;
            private long activeWarranties;
            private long expiringWarranties;
            private BigDecimal totalRepairExpenses;
            private BigDecimal totalPortfolioValue;
            private Double overallRepairRatioPercent;
            private List<ProductDTO.ProductResponse> expiringSoonProducts = new ArrayList<>();
            private List<RepairDTO.RepairResponse> recentRepairs = new ArrayList<>();
            private List<NotificationDTO.NotificationResponse> recentNotifications = new ArrayList<>();

            public Builder totalProducts(long totalProducts) { this.totalProducts = totalProducts; return this; }
            public Builder activeWarranties(long activeWarranties) { this.activeWarranties = activeWarranties; return this; }
            public Builder expiringWarranties(long expiringWarranties) { this.expiringWarranties = expiringWarranties; return this; }
            public Builder totalRepairExpenses(BigDecimal totalRepairExpenses) { this.totalRepairExpenses = totalRepairExpenses; return this; }
            public Builder totalPortfolioValue(BigDecimal totalPortfolioValue) { this.totalPortfolioValue = totalPortfolioValue; return this; }
            public Builder overallRepairRatioPercent(Double overallRepairRatioPercent) { this.overallRepairRatioPercent = overallRepairRatioPercent; return this; }
            public Builder expiringSoonProducts(List<ProductDTO.ProductResponse> expiringSoonProducts) { this.expiringSoonProducts = expiringSoonProducts; return this; }
            public Builder recentRepairs(List<RepairDTO.RepairResponse> recentRepairs) { this.recentRepairs = recentRepairs; return this; }
            public Builder recentNotifications(List<NotificationDTO.NotificationResponse> recentNotifications) { this.recentNotifications = recentNotifications; return this; }

            public SummaryResponse build() {
                SummaryResponse s = new SummaryResponse();
                s.totalProducts = this.totalProducts;
                s.activeWarranties = this.activeWarranties;
                s.expiringWarranties = this.expiringWarranties;
                s.totalRepairExpenses = this.totalRepairExpenses;
                s.totalPortfolioValue = this.totalPortfolioValue;
                s.overallRepairRatioPercent = this.overallRepairRatioPercent;
                s.expiringSoonProducts = this.expiringSoonProducts != null ? this.expiringSoonProducts : new ArrayList<>();
                s.recentRepairs = this.recentRepairs != null ? this.recentRepairs : new ArrayList<>();
                s.recentNotifications = this.recentNotifications != null ? this.recentNotifications : new ArrayList<>();
                return s;
            }
        }

        public long getTotalProducts() { return totalProducts; }
        public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

        public long getActiveWarranties() { return activeWarranties; }
        public void setActiveWarranties(long activeWarranties) { this.activeWarranties = activeWarranties; }

        public long getExpiringWarranties() { return expiringWarranties; }
        public void setExpiringWarranties(long expiringWarranties) { this.expiringWarranties = expiringWarranties; }

        public BigDecimal getTotalRepairExpenses() { return totalRepairExpenses; }
        public void setTotalRepairExpenses(BigDecimal totalRepairExpenses) { this.totalRepairExpenses = totalRepairExpenses; }

        public BigDecimal getTotalPortfolioValue() { return totalPortfolioValue; }
        public void setTotalPortfolioValue(BigDecimal totalPortfolioValue) { this.totalPortfolioValue = totalPortfolioValue; }

        public Double getOverallRepairRatioPercent() { return overallRepairRatioPercent; }
        public void setOverallRepairRatioPercent(Double overallRepairRatioPercent) { this.overallRepairRatioPercent = overallRepairRatioPercent; }

        public List<ProductDTO.ProductResponse> getExpiringSoonProducts() { return expiringSoonProducts; }
        public void setExpiringSoonProducts(List<ProductDTO.ProductResponse> expiringSoonProducts) { this.expiringSoonProducts = expiringSoonProducts; }

        public List<RepairDTO.RepairResponse> getRecentRepairs() { return recentRepairs; }
        public void setRecentRepairs(List<RepairDTO.RepairResponse> recentRepairs) { this.recentRepairs = recentRepairs; }

        public List<NotificationDTO.NotificationResponse> getRecentNotifications() { return recentNotifications; }
        public void setRecentNotifications(List<NotificationDTO.NotificationResponse> recentNotifications) { this.recentNotifications = recentNotifications; }
    }
}
