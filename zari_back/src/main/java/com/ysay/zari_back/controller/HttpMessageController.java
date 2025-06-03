package com.ysay.zari_back.controller;

import com.ysay.zari_back.dto.MessageDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/message")
@RequiredArgsConstructor
public class HttpMessageController {

    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/send")
    public ResponseEntity<String> sendMessageViaHttp(@RequestBody MessageDto message) {
        System.out.println("📨 메시지 전송 대상 경로: /user/" + message.getReceiverId() + "/queue/alert");
        System.out.println("📨 메시지 내용: " + message.getContent());
        messagingTemplate.convertAndSend(
                "/user/" + message.getReceiverId() + "/queue/alert",
                message
        );
        return ResponseEntity.ok("메시지 전송 완료");
    }
}
