package com.ysay.zari_back.dto;

import com.ysay.zari_back.entity.Role;
import lombok.*;


@Getter
@Setter
public class UserSignUpDto {
    private String email;
    private String password;
    private String nickname;
    private Role role;
}
