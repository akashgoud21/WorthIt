package com.worthit.model.enums;

/**
 * Current warranty status of a product.
 *
 * ACTIVE         — warranty is valid and not close to expiry
 * EXPIRING_SOON  — expiry is within the next 30 days (triggers notification)
 * EXPIRED        — warranty has already expired
 */
public enum WarrantyStatus {
    ACTIVE,
    EXPIRING_SOON,
    EXPIRED
}
