package com.ysay.zari_back.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

@Service
public class GCSService {

    @Value("${gcs.bucket.name}")
    private String bucketName;

    @Value("${gcs.key.file.path}")
    private String keyFilePath;

    private Storage storage;

    @PostConstruct
    public void init() throws IOException {
        storage = StorageOptions.newBuilder()
                .setCredentials(GoogleCredentials.fromStream(new FileInputStream(keyFilePath)))
                .build()
                .getService();
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, fileName).setContentType(file.getContentType()).build();
        storage.create(blobInfo, file.getBytes());
        return String.format("https://storage.googleapis.com/%s/%s", bucketName, fileName);
    }

    public String uploadBase64Image(String base64Image) {
        try {
            String[] parts = base64Image.split(",");
            byte[] imageBytes = Base64.getDecoder().decode(parts[1]);
            String fileName = UUID.randomUUID() + "_base64.png";
            BlobInfo blobInfo = BlobInfo.newBuilder(bucketName, fileName).setContentType("image/png").build();
            storage.create(blobInfo, imageBytes);
            return String.format("https://storage.googleapis.com/%s/%s", bucketName, fileName);
        } catch (Exception e) {
            throw new RuntimeException("Base64 이미지 업로드 실패: " + e.getMessage(), e);
        }
    }
}
