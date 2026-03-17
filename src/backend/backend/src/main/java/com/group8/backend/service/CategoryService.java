package com.group8.backend.service;

import com.group8.backend.model.MenuCategory;
import java.util.List;

public interface CategoryService {
    List<MenuCategory> getAllCategories();
    MenuCategory getCategoryById(String categoryId);
    MenuCategory createCategory(MenuCategory category);
    MenuCategory updateCategory(String categoryId, MenuCategory category);
    void deleteCategory(String categoryId);
}
