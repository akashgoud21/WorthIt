package com.worthit.model.enums;

/**
 * Type of smart notification sent to the user.
 *
 * WARRANTY_EXPIRY  — product warranty is expiring soon or has expired
 * SERVICE_DUE      — scheduled maintenance is due
 * REPAIR_FOLLOWUP  — follow-up reminder after a repair was logged
 */
public enum NotificationType {
    WARRANTY_EXPIRY,
    SERVICE_DUE,
    REPAIR_FOLLOWUP
}
