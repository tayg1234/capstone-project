package com.ysay.zari_back.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MenuSimpleDto {
    private Long menuId;
    private String name;
    private int price;
    private String imageUrl;
}
