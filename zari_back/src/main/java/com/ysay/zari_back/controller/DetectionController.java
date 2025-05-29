package com.ysay.zari_back.controller;

import com.ysay.zari_back.dto.DetectionDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class DetectionController {

    @PostMapping("/detections")
    public ResponseEntity<Void> receive(@RequestBody List<DetectionDto> detections) {
        detections.forEach(System.out::println);
        return ResponseEntity.ok().build();
    }
}
