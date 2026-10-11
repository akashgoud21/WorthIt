package com.worthit.service;

import com.worthit.dto.DocumentDTO;
import com.worthit.model.Document;
import com.worthit.model.Product;
import com.worthit.model.enums.DocumentType;
import com.worthit.repository.DocumentRepository;
import com.worthit.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final ProductRepository productRepository;
    private final OcrService ocrService;
    private final Path uploadPath;

    public DocumentService(DocumentRepository documentRepository,
                           ProductRepository productRepository,
                           OcrService ocrService,
                           @Value("${app.upload.dir:uploads}") String uploadDir) {
        this.documentRepository = documentRepository;
        this.productRepository = productRepository;
        this.ocrService = ocrService;
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    @Transactional
    public DocumentDTO.OcrExtractionResponse uploadAndExtract(MultipartFile file, Long productId, DocumentType type) {
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.pdf";
        String uniqueFileName = UUID.randomUUID() + "_" + originalFilename;

        try {
            Path targetLocation = this.uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save uploaded file: " + originalFilename, e);
        }

        String fileUrl = "/uploads/" + uniqueFileName;
        DocumentDTO.OcrExtractionResponse ocrResult = ocrService.extractFromInvoice(file, fileUrl);

        if (productId != null) {
            Product product = productRepository.findById(productId).orElse(null);
            if (product != null) {
                Document doc = new Document();
                doc.setProduct(product);
                doc.setFileName(originalFilename);
                doc.setFileUrl(fileUrl);
                doc.setType(type != null ? type : DocumentType.INVOICE);
                doc.setExtractedData(ocrResult.getExtractedJson());
                documentRepository.save(doc);
            }
        }

        return ocrResult;
    }

    public List<DocumentDTO.DocumentResponse> getDocumentsByProductId(Long productId) {
        return documentRepository.findByProductId(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DocumentDTO.DocumentResponse mapToResponse(Document doc) {
        return DocumentDTO.DocumentResponse.builder()
                .id(doc.getId())
                .productId(doc.getProduct() != null ? doc.getProduct().getId() : null)
                .productName(doc.getProduct() != null ? doc.getProduct().getName() : "")
                .fileName(doc.getFileName())
                .fileUrl(doc.getFileUrl())
                .type(doc.getType())
                .extractedData(doc.getExtractedData())
                .uploadedAt(doc.getUploadedAt())
                .build();
    }
}
