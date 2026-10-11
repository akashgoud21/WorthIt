package com.worthit.service;

import com.worthit.dto.DocumentDTO;
import com.worthit.dto.ProductDTO;
import com.worthit.dto.RepairDTO;
import com.worthit.model.Document;
import com.worthit.model.Product;
import com.worthit.model.User;
import com.worthit.model.Warranty;
import com.worthit.model.enums.DocumentType;
import com.worthit.model.enums.WarrantyStatus;
import com.worthit.repository.DocumentRepository;
import com.worthit.repository.ProductRepository;
import com.worthit.repository.RepairRepository;
import com.worthit.repository.UserRepository;
import com.worthit.repository.WarrantyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final WarrantyRepository warrantyRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final RepairRepository repairRepository;
    private final RepairService repairService;
    private final DocumentService documentService;

    public ProductService(ProductRepository productRepository,
                          WarrantyRepository warrantyRepository,
                          DocumentRepository documentRepository,
                          UserRepository userRepository,
                          RepairRepository repairRepository,
                          RepairService repairService,
                          DocumentService documentService) {
        this.productRepository = productRepository;
        this.warrantyRepository = warrantyRepository;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.repairRepository = repairRepository;
        this.repairService = repairService;
        this.documentService = documentService;
    }

    @Transactional(readOnly = true)
    public List<ProductDTO.ProductResponse> getProductsForUser(Long userId, String search, String category) {
        List<Product> products;
        if (search != null && !search.trim().isEmpty()) {
            products = productRepository.findByUserIdAndNameContainingIgnoreCase(userId, search.trim());
        } else if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
            products = productRepository.findByUserIdAndCategory(userId, category.trim());
        } else {
            products = productRepository.findByUserId(userId);
        }

        return products.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductDTO.ProductResponse getProductById(Long id, Long userId) {
        Product product = productRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
        return mapToResponse(product);
    }

    public ProductDTO.ProductResponse createProduct(ProductDTO.ProductRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        Product product = new Product();
        product.setUser(user);
        product.setName(request.getName().trim());
        product.setCategory(request.getCategory() != null ? request.getCategory().trim() : "Electronics");
        product.setBrand(request.getBrand() != null ? request.getBrand().trim() : "Generic");
        product.setPrice(request.getPrice());
        product.setPurchaseDate(request.getPurchaseDate() != null ? request.getPurchaseDate() : LocalDate.now());

        Product savedProduct = productRepository.save(product);

        // Auto-create Warranty
        int months = request.getWarrantyPeriod() != null && request.getWarrantyPeriod() > 0
                ? request.getWarrantyPeriod()
                : 12;
        LocalDate expiryDate = savedProduct.getPurchaseDate().plusMonths(months);

        LocalDate today = LocalDate.now();
        long daysRemaining = ChronoUnit.DAYS.between(today, expiryDate);

        WarrantyStatus status = WarrantyStatus.ACTIVE;
        if (daysRemaining < 0) {
            status = WarrantyStatus.EXPIRED;
        } else if (daysRemaining <= 30) {
            status = WarrantyStatus.EXPIRING_SOON;
        }

        Warranty warranty = new Warranty();
        warranty.setProduct(savedProduct);
        warranty.setWarrantyPeriod(months);
        warranty.setExpiryDate(expiryDate);
        warranty.setStatus(status);
        Warranty savedWarranty = warrantyRepository.save(warranty);
        savedProduct.setWarranty(savedWarranty);

        // If invoice document provided
        if (request.getInvoiceFileName() != null && !request.getInvoiceFileName().trim().isEmpty()) {
            Document doc = new Document();
            doc.setProduct(savedProduct);
            doc.setFileName(request.getInvoiceFileName().trim());
            doc.setFileUrl("/uploads/" + request.getInvoiceFileName().trim());
            doc.setType(DocumentType.INVOICE);
            doc.setExtractedData(request.getExtractedData() != null ? request.getExtractedData() : "{}");
            documentRepository.save(doc);
        }

        return mapToResponse(savedProduct);
    }

    public ProductDTO.ProductResponse updateProduct(Long id, ProductDTO.ProductRequest request, Long userId) {
        Product product = productRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));

        product.setName(request.getName().trim());
        if (request.getCategory() != null) product.setCategory(request.getCategory().trim());
        if (request.getBrand() != null) product.setBrand(request.getBrand().trim());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getPurchaseDate() != null) product.setPurchaseDate(request.getPurchaseDate());

        if (request.getWarrantyPeriod() != null && request.getWarrantyPeriod() > 0) {
            Warranty warranty = warrantyRepository.findByProductId(product.getId())
                    .orElseGet(() -> {
                        Warranty w = new Warranty();
                        w.setProduct(product);
                        return w;
                    });
            warranty.setWarrantyPeriod(request.getWarrantyPeriod());
            LocalDate expiryDate = product.getPurchaseDate().plusMonths(request.getWarrantyPeriod());
            warranty.setExpiryDate(expiryDate);

            long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), expiryDate);
            if (daysRemaining < 0) {
                warranty.setStatus(WarrantyStatus.EXPIRED);
            } else if (daysRemaining <= 30) {
                warranty.setStatus(WarrantyStatus.EXPIRING_SOON);
            } else {
                warranty.setStatus(WarrantyStatus.ACTIVE);
            }
            warrantyRepository.save(warranty);
            product.setWarranty(warranty);
        }

        Product updated = productRepository.save(product);
        return mapToResponse(updated);
    }

    public void deleteProduct(Long id, Long userId) {
        Product product = productRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    @Transactional(readOnly = true)
    public ProductDTO.ProductResponse mapToResponse(Product p) {
        Warranty w = warrantyRepository.findByProductId(p.getId()).orElse(p.getWarranty());
        LocalDate today = LocalDate.now();

        Integer warrantyPeriod = w != null ? w.getWarrantyPeriod() : 12;
        LocalDate expiryDate = w != null ? w.getExpiryDate() : (p.getPurchaseDate() != null ? p.getPurchaseDate().plusMonths(12) : null);

        long daysRemaining = expiryDate != null ? ChronoUnit.DAYS.between(today, expiryDate) : 0;
        WarrantyStatus status = WarrantyStatus.ACTIVE;
        if (expiryDate != null) {
            if (daysRemaining < 0) {
                status = WarrantyStatus.EXPIRED;
            } else if (daysRemaining <= 30) {
                status = WarrantyStatus.EXPIRING_SOON;
            } else {
                status = WarrantyStatus.ACTIVE;
            }
        }

        List<DocumentDTO.DocumentResponse> documents = documentService.getDocumentsByProductId(p.getId());
        String invoiceFileName = !documents.isEmpty() ? documents.get(0).getFileName() : null;

        List<RepairDTO.RepairResponse> repairs = p.getId() != null
                ? repairRepository.findByProductIdOrderByRepairDateDesc(p.getId()).stream().map(repairService::mapToResponse).collect(Collectors.toList())
                : new ArrayList<>();

        return ProductDTO.ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .category(p.getCategory())
                .brand(p.getBrand())
                .price(p.getPrice())
                .purchaseDate(p.getPurchaseDate())
                .warrantyPeriod(warrantyPeriod)
                .expiryDate(expiryDate)
                .status(status)
                .daysRemaining(daysRemaining)
                .invoiceFileName(invoiceFileName)
                .repairs(repairs)
                .documents(documents)
                .build();
    }
}
