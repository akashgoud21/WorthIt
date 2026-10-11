package com.worthit.controller;

import com.worthit.dto.DocumentDTO;
import com.worthit.model.enums.DocumentType;
import com.worthit.service.DocumentService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentDTO.OcrExtractionResponse> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "productId", required = false) Long productId,
            @RequestParam(value = "type", defaultValue = "INVOICE") DocumentType type) {
        DocumentDTO.OcrExtractionResponse response = documentService.uploadAndExtract(file, productId, type);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<DocumentDTO.DocumentResponse>> getDocumentsByProduct(@PathVariable Long productId) {
        List<DocumentDTO.DocumentResponse> documents = documentService.getDocumentsByProductId(productId);
        return ResponseEntity.ok(documents);
    }
}
