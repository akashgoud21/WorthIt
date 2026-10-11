package com.worthit.dto;

import com.worthit.model.enums.NotificationType;

import java.time.LocalDateTime;

public class NotificationDTO {

    public static class NotificationResponse {
        private Long id;
        private Long productId;
        private String productName;
        private NotificationType type;
        private String message;
        private Boolean isRead;
        private LocalDateTime sentAt;

        public NotificationResponse() {}

        public NotificationResponse(Long id, Long productId, String productName, NotificationType type,
                                    String message, Boolean isRead, LocalDateTime sentAt) {
            this.id = id;
            this.productId = productId;
            this.productName = productName;
            this.type = type;
            this.message = message;
            this.isRead = isRead;
            this.sentAt = sentAt;
        }

        public static Builder builder() { return new Builder(); }

        public static class Builder {
            private Long id;
            private Long productId;
            private String productName;
            private NotificationType type;
            private String message;
            private Boolean isRead;
            private LocalDateTime sentAt;

            public Builder id(Long id) { this.id = id; return this; }
            public Builder productId(Long productId) { this.productId = productId; return this; }
            public Builder productName(String productName) { this.productName = productName; return this; }
            public Builder type(NotificationType type) { this.type = type; return this; }
            public Builder message(String message) { this.message = message; return this; }
            public Builder isRead(Boolean isRead) { this.isRead = isRead; return this; }
            public Builder sentAt(LocalDateTime sentAt) { this.sentAt = sentAt; return this; }

            public NotificationResponse build() {
                return new NotificationResponse(id, productId, productName, type, message, isRead, sentAt);
            }
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public NotificationType getType() { return type; }
        public void setType(NotificationType type) { this.type = type; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public Boolean getIsRead() { return isRead; }
        public void setIsRead(Boolean isRead) { this.isRead = isRead; }

        public LocalDateTime getSentAt() { return sentAt; }
        public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
    }
}
