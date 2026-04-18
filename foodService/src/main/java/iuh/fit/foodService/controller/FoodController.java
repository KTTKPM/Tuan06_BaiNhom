package iuh.fit.foodService.controller;

import iuh.fit.foodService.dto.FoodCreateRequest;
import iuh.fit.foodService.dto.FoodResponse;
import iuh.fit.foodService.dto.FoodUpdateRequest;
import iuh.fit.foodService.service.FoodService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FoodResponse create(@Valid @RequestBody FoodCreateRequest request) {
        return foodService.create(request);
    }

    @GetMapping("/{id}")
    public FoodResponse getById(@PathVariable Long id) {
        return foodService.getById(id);
    }

    @GetMapping
    public List<FoodResponse> getAll(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean available
    ) {
        if (keyword != null && !keyword.isBlank()) {
            return foodService.searchByName(keyword);
        }

        if (available != null) {
            return foodService.getByAvailability(available);
        }

        return foodService.getAll();
    }

    @PutMapping("/{id}")
    public FoodResponse update(@PathVariable Long id, @Valid @RequestBody FoodUpdateRequest request) {
        return foodService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        foodService.delete(id);
    }
}
