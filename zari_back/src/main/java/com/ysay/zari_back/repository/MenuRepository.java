package com.ysay.zari_back.repository;

import com.ysay.zari_back.entity.Menu;
import com.ysay.zari_back.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByStore(Store store);
}
