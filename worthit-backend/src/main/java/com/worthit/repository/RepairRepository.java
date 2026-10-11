package com.worthit.repository;

import com.worthit.model.Repair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Repository for the 'repairs' table.
 *
 * The key analytics query here calculates the total repair cost
 * for a product — used by RepairAnalyticsService to compare
 * against the original product price (repair vs replace decision).
 */
@Repository
public interface RepairRepository extends JpaRepository<Repair, Long> {

    // Get all repairs for a product (newest first)
    List<Repair> findByProductIdOrderByRepairDateDesc(Long productId);

    // SUM of all repair costs for a product — the core analytics query
    // COALESCE returns 0 if there are no repairs yet (avoids null)
    @Query("SELECT COALESCE(SUM(r.cost), 0) FROM Repair r WHERE r.product.id = :productId")
    BigDecimal sumCostByProductId(@Param("productId") Long productId);

    // Count how many repairs a product has had
    long countByProductId(Long productId);

    // Monthly expense: sum of repair costs for a user in a specific month/year
    @Query("SELECT COALESCE(SUM(r.cost), 0) FROM Repair r " +
           "WHERE r.product.user.id = :userId " +
           "AND YEAR(r.repairDate) = :year AND MONTH(r.repairDate) = :month")
    BigDecimal sumMonthlyRepairCost(@Param("userId") Long userId,
                                   @Param("year") int year,
                                   @Param("month") int month);
}
