package iuh.fit.foodService.service.impl;

import iuh.fit.foodService.dto.FoodCreateRequest;
import iuh.fit.foodService.dto.FoodResponse;
import iuh.fit.foodService.dto.FoodUpdateRequest;
import iuh.fit.foodService.entity.Food;
import iuh.fit.foodService.exception.ResourceNotFoundException;
import iuh.fit.foodService.repository.FoodRepository;
import iuh.fit.foodService.service.FoodService;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class FoodServiceImpl implements FoodService {

    private final FoodRepository foodRepository;

    @Override
    public FoodResponse create(FoodCreateRequest request) {
        Food food = Food.builder()
                .name(request.name().trim())
                .category(request.category().trim())
                .price(request.price())
                .available(request.available())
                .createdAt(LocalDateTime.now())
                .build();

        return toResponse(foodRepository.save(food));
    }

    @Override
    @Transactional(readOnly = true)
    public FoodResponse getById(Long id) {
        return toResponse(findExistingFood(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<FoodResponse> getAll() {
        return foodRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<FoodResponse> searchByName(String keyword) {
        String normalizedKeyword = keyword == null ? "" : keyword.trim();
        return foodRepository.findByNameContainingIgnoreCase(normalizedKeyword).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<FoodResponse> getByAvailability(Boolean available) {
        return foodRepository.findByAvailable(available).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public FoodResponse update(Long id, FoodUpdateRequest request) {
        Food existingFood = findExistingFood(id);
        existingFood.setName(request.name().trim());
        existingFood.setCategory(request.category().trim());
        existingFood.setPrice(request.price());
        existingFood.setAvailable(request.available());

        return toResponse(foodRepository.save(existingFood));
    }

    @Override
    public void delete(Long id) {
        Food existingFood = findExistingFood(id);
        foodRepository.delete(existingFood);
    }

    private Food findExistingFood(Long id) {
        return foodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food with id " + id + " not found"));
    }

    private FoodResponse toResponse(Food food) {
        return new FoodResponse(
                food.getId(),
                food.getName(),
                food.getCategory(),
                food.getPrice(),
                food.getAvailable(),
                food.getCreatedAt()
        );
    }
}
