package com.worthit.dto;

import com.worthit.model.enums.DocumentType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class DocumentDTO {

    public static class DocumentResponse {
        private Long id;
        private Long productId;
        private String productName;
        private String fileName;
        private String fileUrl;
        private DocumentType type;
        private String extractedData;
        private LocalDateTime uploadedAt;

        public DocumentResponse() {}

        public DocumentResponse(Long id, Long productId, String productName, String fileName,
                                String fileUrl, DocumentType type, String extractedData, LocalDateTime uploadedAt) {
            this.id = id;
            this.productId = productId;
            this.productName = productName;
            this.fileName = fileName;
            this.fileUrl = fileUrl;
            this.type = type;
            this.extractedData = extractedData;
            this.uploadedAt = uploadedAt;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private Long id;
            private Long productId;
            private String productName;
            private String fileName;
            private String fileUrl;
            private DocumentType type;
            private String extractedData;
            private LocalDateTime uploadedAt;

            public Builder id(Long id) { this.id = id; return this; }
            public Builder productId(Long productId) { this.productId = productId; return this; }
            public Builder productName(String productName) { this.productName = productName; return this; }
            public Builder fileName(String fileName) { this.fileName = fileName; return this; }
            public Builder fileUrl(String fileUrl) { this.fileUrl = fileUrl; return this; }
            public Builder type(DocumentType type) { this.type = type; return this; }
            public Builder extractedData(String extractedData) { this.extractedData = extractedData; return this; }
            public Builder uploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; return this; }

            public DocumentResponse build() {
                return new DocumentResponse(id, productId, productName, fileName, fileUrl, type, extractedData, uploadedAt);
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }

        public String getFileUrl() { return fileUrl; }
        public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

        public DocumentType getType() { return type; }
        public void setType(DocumentType type) { this.type = type; }

        public String getExtractedData() { return extractedData; }
        public void setExtractedData(String extractedData) { this.extractedData = extractedData; }

        public LocalDateTime getUploadedAt() { return uploadedAt; }
        public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
    }

    public static class OcrExtractionResponse {
        private String fileName;
        private String fileUrl;
        private BigDecimal detectedPrice;
        private LocalDate detectedPurchaseDate;
        private Integer detectedWarrantyMonths;
        private Double confidence;
        private String rawExtractedText;
        private String extractedJson;

        public OcrExtractionResponse() {}

        public OcrExtractionResponse(String fileName, String fileUrl, BigDecimal detectedPrice,
                                     LocalDate detectedPurchaseDate, Integer detectedWarrantyMonths,
                                     Double confidence, String rawExtractedText, String extractedJson) {
            this.fileName = fileName;
            this.fileUrl = fileUrl;
            this.detectedPrice = detectedPrice;
            this.detectedPurchaseDate = detectedPurchaseDate;
            this.detectedWarrantyMonths = detectedWarrantyMonths;
            this.confidence = confidence;
            this.rawExtractedText = rawExtractedText;
            this.extractedJson = extractedJson;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private String fileName;
            private String fileUrl;
            private BigDecimal detectedPrice;
            private LocalDate detectedPurchaseDate;
            private Integer detectedWarrantyMonths;
            private Double confidence;
            private String rawExtractedText;
            private String extractedJson;

            public Builder fileName(String fileName) { this.fileName = fileName; return this; }
            public Builder fileUrl(String fileUrl) { this.fileUrl = fileUrl; return this; }
            public Builder detectedPrice(BigDecimal detectedPrice) { this.detectedPrice = detectedPrice; return this; }
            public Builder detectedPurchaseDate(LocalDate detectedPurchaseDate) { this.detectedPurchaseDate = detectedPurchaseDate; return this; }
            public Builder detectedWarrantyMonths(Integer detectedWarrantyMonths) { this.detectedWarrantyMonths = detectedWarrantyMonths; return this; }
            public Builder confidence(Double confidence) { this.confidence = confidence; return this; }
            public Builder rawExtractedText(String rawExtractedText) { this.rawExtractedText = rawExtractedText; return this; }
            public Builder extractedJson(String extractedJson) { this.extractedJson = extractedJson; return this; }

            public OcrExtractionResponse build() {
                return new OcrExtractionResponse(fileName, fileUrl, detectedPrice, detectedPurchaseDate,
                        detectedWarrantyMonths, confidence, rawExtractedText, extractedJson);
            }
        }

        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }

        public String getFileUrl() { return fileUrl; }
        public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

        public BigDecimal getDetectedPrice() { return detectedPrice; }
        public void setDetectedPrice(BigDecimal detectedPrice) { this.detectedPrice = detectedPrice; }

        public LocalDate getDetectedPurchaseDate() { return detectedPurchaseDate; }
        public void setDetectedPurchaseDate(LocalDate detectedPurchaseDate) { this.detectedPurchaseDate = detectedPurchaseDate; }

        public Integer getDetectedWarrantyMonths() { return detectedWarrantyMonths; }
        public void setDetectedWarrantyMonths(Integer detectedWarrantyMonths) { this.detectedWarrantyMonths = detectedWarrantyMonths; }

        public Double getConfidence() { return confidence; }
        public void setConfidence(Double confidence) { this.confidence = confidence; }

        public String getRawExtractedText() { return rawExtractedText; }
        public void setRawExtractedText(String rawExtractedText) { this.rawExtractedText = rawExtractedText; }

        public String getExtractedJson() { return extractedJson; }
        public void setExtractedJson(String extractedJson) { this.extractedJson = extractedJson; }
    }
}
