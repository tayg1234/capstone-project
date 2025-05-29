package com.ysay.zari_back.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long menuId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = true)
    private String imageUrl;

    @Column(nullable = false)
    private int price;

    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;
}
