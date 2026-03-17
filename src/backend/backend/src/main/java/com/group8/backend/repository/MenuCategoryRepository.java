package com.group8.backend.repository;

import com.group8.backend.model.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface MenuCategoryRepository extends JpaRepository<MenuCategory, String> {
}
