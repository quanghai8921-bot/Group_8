package com.group8.backend.service.impl;

import com.group8.backend.model.MenuCategory;
import com.group8.backend.repository.MenuCategoryRepository;
import com.group8.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private MenuCategoryRepository categoryRepository;

    @Override
    public List<MenuCategory> getAllCategories() {
        return categoryRepository.findAll();
    }


    @Override
    public MenuCategory getCategoryById(String categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Override
    @Transactional
    public MenuCategory createCategory(MenuCategory category) {
        if (category.getCategoryId() == null) {
            category.setCategoryId(com.group8.backend.config.IDGenerator.generateID());
        }
        return categoryRepository.save(category);
    }

    @Override
    @Transactional
    public MenuCategory updateCategory(String categoryId, MenuCategory category) {
        MenuCategory existing = getCategoryById(categoryId);
        existing.setCategoryName(category.getCategoryName());
        // Existing logic might need more fields if schema changes
        return categoryRepository.save(existing);
    }

    @Override
    @Transactional
    public void deleteCategory(String categoryId) {
        categoryRepository.deleteById(categoryId);
    }
}
