package com.worthit.repository;

import com.worthit.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository for the 'users' table.
 *
 * JpaRepository<User, Long> gives us CRUD methods for free:
 *   save(), findById(), findAll(), deleteById(), count(), existsById()
 *
 * We only need to define custom queries that JpaRepository doesn't provide.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Used during login — find user by email
    Optional<User> findByEmail(String email);

    // Used during registration — check if email is already taken
    boolean existsByEmail(String email);
}
