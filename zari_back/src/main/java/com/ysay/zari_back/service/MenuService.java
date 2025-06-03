package com.ysay.zari_back.service;

import com.ysay.zari_back.dto.MenuRegisterDto;
import com.ysay.zari_back.entity.Menu;
import com.ysay.zari_back.entity.Store;
import com.ysay.zari_back.repository.MenuRepository;
import com.ysay.zari_back.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;
    private final StoreRepository storeRepository;
    private final GCSService gcsService;

    public void registerMenu(Long storeId, MenuRegisterDto dto, MultipartFile imageFile) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new IllegalArgumentException("해당 매장이 존재하지 않습니다."));

        String imageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                imageUrl = gcsService.uploadFile(imageFile);
            } catch (IOException e) {
                throw new RuntimeException("이미지 업로드 실패", e);
            }
        }


        Menu menu = Menu.builder()
                .name(dto.getName())
                .price(dto.getPrice())
                .imageUrl(imageUrl)
                .store(store)
                .build();

        menuRepository.save(menu);
    }
}
