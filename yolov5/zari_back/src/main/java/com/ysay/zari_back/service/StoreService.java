package com.ysay.zari_back.service;

import com.ysay.zari_back.dto.StoreRegisterDto;
import com.ysay.zari_back.dto.StoreSimpleDto;
import com.ysay.zari_back.entity.Store;
import com.ysay.zari_back.entity.User;
import com.ysay.zari_back.repository.StoreRepository;
import com.ysay.zari_back.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.stream.Collectors;
import java.io.IOException;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final GCSService gcsService;

    @Transactional
    public void registerStore(StoreRegisterDto dto, Long userId, MultipartFile imageFile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        String imageUrl = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                imageUrl = gcsService.uploadFile(imageFile);
            } catch (IOException e) {
                throw new RuntimeException("이미지 업로드 실패", e);
            }
        }

        Store store = Store.builder()
                .storeName(dto.getStoreName())
                .storeAddress(dto.getStoreAddress())
                .storePhone(dto.getStorePhone())
                .category(dto.getCategory())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .owner(user)
                .imageUrl(imageUrl)
                .build();

        storeRepository.save(store);
    }


    public List<StoreSimpleDto> getAllStores() {
        return storeRepository.findAll().stream()
                .map(store -> StoreSimpleDto.builder()
                        .storeId(store.getStoreId())
                        .storeName(store.getStoreName())
                        .category(store.getCategory())
                        .storeAddress(store.getStoreAddress())
                        .imageUrl(store.getImageUrl())
                        .build())
                .collect(Collectors.toList());
    }

}

