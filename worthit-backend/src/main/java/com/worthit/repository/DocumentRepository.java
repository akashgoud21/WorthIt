package com.worthit.repository;

import com.worthit.model.Document;
import com.worthit.model.enums.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for the 'documents' table.
 *
 * Documents are always accessed through their parent product,
 * so all queries include productId.
 */
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {

    // Get all documents for a product
    List<Document> findByProductId(Long productId);

    // Get documents filtered by type (INVOICE or WARRANTY)
    List<Document> findByProductIdAndType(Long productId, DocumentType type);
}
