package com.ysay.zari_back.dto;

import com.ysay.zari_back.entity.StoreCategory;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class StoreDetailDto {
    private Long storeId;
    private String storeName;
    private String storeAddress;
    private String storePhone;
    private StoreCategory category;
    private double latitude;
    private double longitude;
    private Long ownerId;
    private String imageUrl;
    private List<MenuSimpleDto> menus;
}
