package com.worthit.dto;

import com.worthit.model.enums.WarrantyStatus;

import java.time.LocalDate;

public class WarrantyDTO {

    public static class WarrantyResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String brand;
        private String category;
        private LocalDate purchaseDate;
        private Integer warrantyPeriod;
        private LocalDate expiryDate;
        private Long daysRemaining;
        private WarrantyStatus status;
        private String invoiceFileName;

        public WarrantyResponse() {}

        public WarrantyResponse(Long id, Long productId, String productName, String brand, String category,
                                LocalDate purchaseDate, Integer warrantyPeriod, LocalDate expiryDate,
                                Long daysRemaining, WarrantyStatus status, String invoiceFileName) {
            this.id = id;
            this.productId = productId;
            this.productName = productName;
            this.brand = brand;
            this.category = category;
            this.purchaseDate = purchaseDate;
            this.warrantyPeriod = warrantyPeriod;
            this.expiryDate = expiryDate;
            this.daysRemaining = daysRemaining;
            this.status = status;
            this.invoiceFileName = invoiceFileName;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private Long id;
            private Long productId;
            private String productName;
            private String brand;
            private String category;
            private LocalDate purchaseDate;
            private Integer warrantyPeriod;
            private LocalDate expiryDate;
            private Long daysRemaining;
            private WarrantyStatus status;
            private String invoiceFileName;

            public Builder id(Long id) { this.id = id; return this; }
            public Builder productId(Long productId) { this.productId = productId; return this; }
            public Builder productName(String productName) { this.productName = productName; return this; }
            public Builder brand(String brand) { this.brand = brand; return this; }
            public Builder category(String category) { this.category = category; return this; }
            public Builder purchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; return this; }
            public Builder warrantyPeriod(Integer warrantyPeriod) { this.warrantyPeriod = warrantyPeriod; return this; }
            public Builder expiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; return this; }
            public Builder daysRemaining(Long daysRemaining) { this.daysRemaining = daysRemaining; return this; }
            public Builder status(WarrantyStatus status) { this.status = status; return this; }
            public Builder invoiceFileName(String invoiceFileName) { this.invoiceFileName = invoiceFileName; return this; }

            public WarrantyResponse build() {
                return new WarrantyResponse(id, productId, productName, brand, category,
                        purchaseDate, warrantyPeriod, expiryDate, daysRemaining, status, invoiceFileName);
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public String getBrand() { return brand; }
        public void setBrand(String brand) { this.brand = brand; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public LocalDate getPurchaseDate() { return purchaseDate; }
        public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

        public Integer getWarrantyPeriod() { return warrantyPeriod; }
        public void setWarrantyPeriod(Integer warrantyPeriod) { this.warrantyPeriod = warrantyPeriod; }

        public LocalDate getExpiryDate() { return expiryDate; }
        public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

        public Long getDaysRemaining() { return daysRemaining; }
        public void setDaysRemaining(Long daysRemaining) { this.daysRemaining = daysRemaining; }

        public WarrantyStatus getStatus() { return status; }
        public void setStatus(WarrantyStatus status) { this.status = status; }

        public String getInvoiceFileName() { return invoiceFileName; }
        public void setInvoiceFileName(String invoiceFileName) { this.invoiceFileName = invoiceFileName; }
    }
}
