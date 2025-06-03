package com.ysay.zari_back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationMessageDto {
    private String storeId;
    private String senderId;
    private String message;
}
