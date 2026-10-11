package com.worthit.dto;

import com.worthit.model.enums.WarrantyStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ProductDTO {

    public static class ProductRequest {
        @NotBlank(message = "Product name is required")
        private String name;

        private String category;
        private String brand;

        @Positive(message = "Price must be positive")
        private BigDecimal price;

        private LocalDate purchaseDate;
        private Integer warrantyPeriod;
        private String invoiceFileName;
        private String extractedData;

        public ProductRequest() {}

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getBrand() { return brand; }
        public void setBrand(String brand) { this.brand = brand; }

        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }

        public LocalDate getPurchaseDate() { return purchaseDate; }
        public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

        public Integer getWarrantyPeriod() { return warrantyPeriod; }
        public void setWarrantyPeriod(Integer warrantyPeriod) { this.warrantyPeriod = warrantyPeriod; }

        public String getInvoiceFileName() { return invoiceFileName; }
        public void setInvoiceFileName(String invoiceFileName) { this.invoiceFileName = invoiceFileName; }

        public String getExtractedData() { return extractedData; }
        public void setExtractedData(String extractedData) { this.extractedData = extractedData; }
    }

    public static class ProductResponse {
        private Long id;
        private String name;
        private String category;
        private String brand;
        private BigDecimal price;
        private LocalDate purchaseDate;
        private Integer warrantyPeriod;
        private LocalDate expiryDate;
        private WarrantyStatus status;
        private Long daysRemaining;
        private String invoiceFileName;
        private List<RepairDTO.RepairResponse> repairs = new ArrayList<>();
        private List<DocumentDTO.DocumentResponse> documents = new ArrayList<>();

        public ProductResponse() {}

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private Long id;
            private String name;
            private String category;
            private String brand;
            private BigDecimal price;
            private LocalDate purchaseDate;
            private Integer warrantyPeriod;
            private LocalDate expiryDate;
            private WarrantyStatus status;
            private Long daysRemaining;
            private String invoiceFileName;
            private List<RepairDTO.RepairResponse> repairs = new ArrayList<>();
            private List<DocumentDTO.DocumentResponse> documents = new ArrayList<>();

            public Builder id(Long id) { this.id = id; return this; }
            public Builder name(String name) { this.name = name; return this; }
            public Builder category(String category) { this.category = category; return this; }
            public Builder brand(String brand) { this.brand = brand; return this; }
            public Builder price(BigDecimal price) { this.price = price; return this; }
            public Builder purchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; return this; }
            public Builder warrantyPeriod(Integer warrantyPeriod) { this.warrantyPeriod = warrantyPeriod; return this; }
            public Builder expiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; return this; }
            public Builder status(WarrantyStatus status) { this.status = status; return this; }
            public Builder daysRemaining(Long daysRemaining) { this.daysRemaining = daysRemaining; return this; }
            public Builder invoiceFileName(String invoiceFileName) { this.invoiceFileName = invoiceFileName; return this; }
            public Builder repairs(List<RepairDTO.RepairResponse> repairs) { this.repairs = repairs; return this; }
            public Builder documents(List<DocumentDTO.DocumentResponse> documents) { this.documents = documents; return this; }

            public ProductResponse build() {
                ProductResponse p = new ProductResponse();
                p.id = this.id;
                p.name = this.name;
                p.category = this.category;
                p.brand = this.brand;
                p.price = this.price;
                p.purchaseDate = this.purchaseDate;
                p.warrantyPeriod = this.warrantyPeriod;
                p.expiryDate = this.expiryDate;
                p.status = this.status;
                p.daysRemaining = this.daysRemaining;
                p.invoiceFileName = this.invoiceFileName;
                p.repairs = this.repairs != null ? this.repairs : new ArrayList<>();
                p.documents = this.documents != null ? this.documents : new ArrayList<>();
                return p;
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public String getBrand() { return brand; }
        public void setBrand(String brand) { this.brand = brand; }

        public BigDecimal getPrice() { return price; }
        public void setPrice(BigDecimal price) { this.price = price; }

        public LocalDate getPurchaseDate() { return purchaseDate; }
        public void setPurchaseDate(LocalDate purchaseDate) { this.purchaseDate = purchaseDate; }

        public Integer getWarrantyPeriod() { return warrantyPeriod; }
        public void setWarrantyPeriod(Integer warrantyPeriod) { this.warrantyPeriod = warrantyPeriod; }

        public LocalDate getExpiryDate() { return expiryDate; }
        public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

        public WarrantyStatus getStatus() { return status; }
        public void setStatus(WarrantyStatus status) { this.status = status; }

        public Long getDaysRemaining() { return daysRemaining; }
        public void setDaysRemaining(Long daysRemaining) { this.daysRemaining = daysRemaining; }

        public String getInvoiceFileName() { return invoiceFileName; }
        public void setInvoiceFileName(String invoiceFileName) { this.invoiceFileName = invoiceFileName; }

        public List<RepairDTO.RepairResponse> getRepairs() { return repairs; }
        public void setRepairs(List<RepairDTO.RepairResponse> repairs) { this.repairs = repairs; }

        public List<DocumentDTO.DocumentResponse> getDocuments() { return documents; }
        public void setDocuments(List<DocumentDTO.DocumentResponse> documents) { this.documents = documents; }
    }
}
