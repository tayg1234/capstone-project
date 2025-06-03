package com.ysay.zari_back.controller;

import com.ysay.zari_back.dto.MessageDto;
import com.ysay.zari_back.dto.ReservationMessageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReservationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/api/message/send-to/{userId}")
    public void sendReservationMessage(@PathVariable String userId, @RequestBody MessageDto dto) {
        messagingTemplate.convertAndSendToUser(userId, "/queue/alert", dto);
    }
}
