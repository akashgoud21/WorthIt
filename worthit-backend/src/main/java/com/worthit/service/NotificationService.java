package com.worthit.service;

import com.worthit.dto.NotificationDTO;
import com.worthit.model.Notification;
import com.worthit.model.Product;
import com.worthit.model.User;
import com.worthit.model.enums.NotificationType;
import com.worthit.repository.NotificationRepository;
import com.worthit.repository.ProductRepository;
import com.worthit.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository,
                               ProductRepository productRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public List<NotificationDTO.NotificationResponse> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdOrderBySentAtDesc(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAsRead(Long id, Long userId) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification != null && notification.getUser().getId().equals(userId)) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
    }

    @Transactional
    public Notification createNotification(Long userId, Long productId, NotificationType type, String message) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return null;

        Product product = productId != null ? productRepository.findById(productId).orElse(null) : null;
        Notification notif = new Notification(user, product, type, message);
        return notificationRepository.save(notif);
    }

    public NotificationDTO.NotificationResponse mapToResponse(Notification n) {
        return NotificationDTO.NotificationResponse.builder()
                .id(n.getId())
                .productId(n.getProduct() != null ? n.getProduct().getId() : null)
                .productName(n.getProduct() != null ? n.getProduct().getName() : "System Alert")
                .type(n.getType())
                .message(n.getMessage())
                .isRead(n.getIsRead())
                .sentAt(n.getSentAt())
                .build();
    }
}
