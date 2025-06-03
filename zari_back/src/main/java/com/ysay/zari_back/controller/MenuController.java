package com.ysay.zari_back.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ysay.zari_back.dto.MenuRegisterDto;
import com.ysay.zari_back.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/menus")
public class MenuController {

    private final MenuService menuService;
    private final ObjectMapper objectMapper;

    @PostMapping(value = "/register/{storeId}", consumes = "multipart/form-data")
    public ResponseEntity<String> registerMenu(
            @PathVariable Long storeId,
            @RequestPart("menu") String menuJson,
            @RequestPart(value = "image", required = false) MultipartFile imageFile
    ) {
        try {
            MenuRegisterDto dto = objectMapper.readValue(menuJson, MenuRegisterDto.class);
            menuService.registerMenu(storeId, dto, imageFile);
            return ResponseEntity.ok("메뉴 등록 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("메뉴 등록 실패: " + e.getMessage());
        }
    }
}
