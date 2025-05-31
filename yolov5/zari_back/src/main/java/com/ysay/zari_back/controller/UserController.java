package com.ysay.zari_back.controller;


import com.ysay.zari_back.dto.UserLoginDto;
import com.ysay.zari_back.dto.UserSignUpDto;
import com.ysay.zari_back.entity.User;
import com.ysay.zari_back.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserController {


    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserSignUpDto dto) {
        userService.signup(dto);
        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDto dto) {
        try {
            User user = userService.login(dto.getEmail(), dto.getPassword());
            return ResponseEntity.ok().body(
                    Map.of(
                            "userId", user.getUserId(),
                            "email", user.getEmail(),
                            "nickname", user.getNickname(),
                            "role", user.getRole().toString()
                    )
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


}
