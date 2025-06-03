package com.ysay.zari_back.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ysay.zari_back.dto.StoreDetailDto;
import com.ysay.zari_back.dto.StoreRegisterDto;
import com.ysay.zari_back.dto.StoreSimpleDto;
import com.ysay.zari_back.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping(value = "/register/{userId}", consumes = "multipart/form-data")
    public ResponseEntity<String> registerStore(@PathVariable Long userId,
                                                @RequestPart("store") String storeJson,
                                                @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        try {
            StoreRegisterDto dto = objectMapper.readValue(storeJson, StoreRegisterDto.class);
            System.out.println("storeName: " + dto.getStoreName());
            System.out.println("category: " + dto.getCategory());
            System.out.println("image: " + (imageFile != null ? imageFile.getOriginalFilename() : "null"));

            storeService.registerStore(dto, userId, imageFile);
            return ResponseEntity.ok("매장 등록 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("DTO 파싱 실패: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<StoreSimpleDto>> getAllStores() {
        List<StoreSimpleDto> stores = storeService.getAllStores();
        return ResponseEntity.ok(stores);
    }

    @GetMapping("/{storeId}")
    public ResponseEntity<StoreDetailDto> getStoreDetail(@PathVariable Long storeId) {
        StoreDetailDto store = storeService.getStoreDetail(storeId);
        return ResponseEntity.ok(store);
    }

}
