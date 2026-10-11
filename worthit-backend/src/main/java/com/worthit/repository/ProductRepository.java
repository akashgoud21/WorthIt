package com.worthit.repository;

import com.worthit.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for the 'products' table.
 *
 * All queries are scoped to a specific user (userId) so that
 * User A can never see User B's products — data isolation.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Get all products for a logged-in user
    List<Product> findByUserId(Long userId);

    // Get a specific product only if it belongs to the logged-in user (security check)
    Optional<Product> findByIdAndUserId(Long id, Long userId);

    // Search products by name (case-insensitive LIKE query)
    // Spring generates: WHERE name LIKE %name% AND user_id = userId
    List<Product> findByUserIdAndNameContainingIgnoreCase(Long userId, String name);

    // Filter products by category
    List<Product> findByUserIdAndCategory(Long userId, String category);

    // Count how many products a user has (for dashboard)
    long countByUserId(Long userId);
}
