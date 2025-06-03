package com.ysay.zari_back.dto;

import com.ysay.zari_back.entity.StoreCategory;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StoreSimpleDto {
    private Long storeId;
    private String storeName;
    private Long ownerId;
    private StoreCategory category;
    private String storeAddress;
    private String imageUrl;
}
