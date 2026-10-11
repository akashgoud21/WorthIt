package com.worthit.controller;

import com.worthit.dto.ProductDTO;
import com.worthit.service.AuthService;
import com.worthit.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final AuthService authService;

    public ProductController(ProductService productService, AuthService authService) {
        this.productService = productService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO.ProductResponse>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {
        Long userId = authService.getCurrentUserId();
        List<ProductDTO.ProductResponse> products = productService.getProductsForUser(userId, search, category);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO.ProductResponse> getProductById(@PathVariable Long id) {
        Long userId = authService.getCurrentUserId();
        ProductDTO.ProductResponse response = productService.getProductById(id, userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ProductDTO.ProductResponse> createProduct(@Valid @RequestBody ProductDTO.ProductRequest request) {
        Long userId = authService.getCurrentUserId();
        ProductDTO.ProductResponse response = productService.createProduct(request, userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO.ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductDTO.ProductRequest request) {
        Long userId = authService.getCurrentUserId();
        ProductDTO.ProductResponse response = productService.updateProduct(id, request, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Long id) {
        Long userId = authService.getCurrentUserId();
        productService.deleteProduct(id, userId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Product deleted successfully", "id", id));
    }
}
