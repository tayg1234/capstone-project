package com.ysay.zari_back.service;

import com.ysay.zari_back.dto.MessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendToUser(String userId, MessageDto messageDto) {
        messagingTemplate.convertAndSendToUser(userId, "/queue/alert", messageDto);
    }
}