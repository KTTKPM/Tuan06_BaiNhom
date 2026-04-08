package iuh.fit.foodService.service;

import iuh.fit.foodService.dto.FoodCreateRequest;
import iuh.fit.foodService.dto.FoodResponse;
import iuh.fit.foodService.dto.FoodUpdateRequest;
import java.util.List;

public interface FoodService {

    FoodResponse create(FoodCreateRequest request);

    FoodResponse getById(Long id);

    List<FoodResponse> getAll();

    List<FoodResponse> searchByName(String keyword);

    List<FoodResponse> getByAvailability(Boolean available);

    FoodResponse update(Long id, FoodUpdateRequest request);

    void delete(Long id);
}
