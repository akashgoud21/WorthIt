package com.worthit.repository;

import com.worthit.model.Warranty;
import com.worthit.model.enums.WarrantyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repository for the 'warranties' table.
 *
 * Key queries:
 *  - Find warranties expiring soon (for notifications)
 *  - Find warranty by product ID
 */
@Repository
public interface WarrantyRepository extends JpaRepository<Warranty, Long> {

    // Get the warranty for a specific product
    Optional<Warranty> findByProductId(Long productId);

    // Get warranties that expire within a given date range
    // Used by the daily scheduler to create expiry notifications
    // JPQL: joins Warranty → Product → User to ensure user-scoping
    @Query("SELECT w FROM Warranty w WHERE w.product.user.id = :userId " +
           "AND w.expiryDate BETWEEN :today AND :threshold " +
           "AND w.status <> 'EXPIRED'")
    List<Warranty> findExpiringSoon(@Param("userId") Long userId,
                                   @Param("today") LocalDate today,
                                   @Param("threshold") LocalDate threshold);

    // Get all warranties for a user by status (ACTIVE, EXPIRING_SOON, EXPIRED)
    @Query("SELECT w FROM Warranty w WHERE w.product.user.id = :userId " +
           "AND w.status = :status")
    List<Warranty> findByUserIdAndStatus(@Param("userId") Long userId,
                                        @Param("status") WarrantyStatus status);

    // Get all warranties for a user (for the warranty list page)
    @Query("SELECT w FROM Warranty w WHERE w.product.user.id = :userId")
    List<Warranty> findAllByUserId(@Param("userId") Long userId);

    // Used by scheduler: find all warranties expiring within N days (across all users)
    List<Warranty> findByExpiryDateBetweenAndStatusNot(LocalDate from, LocalDate to,
                                                       WarrantyStatus status);
}
