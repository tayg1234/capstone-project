package com.ysay.zari_back.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ysay.zari_back.entity.StoreCategory;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class StoreRegisterDto {
    private String storeName;
    private String storeAddress;
    private String storePhone;
    private StoreCategory category;
    private double latitude;
    private double longitude;
}