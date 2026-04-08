package iuh.fit.foodService.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import iuh.fit.foodService.dto.FoodCreateRequest;
import iuh.fit.foodService.dto.FoodUpdateRequest;
import iuh.fit.foodService.entity.Food;
import iuh.fit.foodService.exception.ResourceNotFoundException;
import iuh.fit.foodService.repository.FoodRepository;
import iuh.fit.foodService.service.impl.FoodServiceImpl;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class FoodServiceImplTest {

    @Mock
    private FoodRepository foodRepository;

    private FoodServiceImpl foodService;

    @BeforeEach
    void setUp() {
        foodService = new FoodServiceImpl(foodRepository);
    }

    @Test
    void create_ShouldReturnCreatedFood() {
        FoodCreateRequest request = new FoodCreateRequest(
                "Pho Bo",
                "Vietnamese",
                new BigDecimal("50000"),
                true
        );

        Food savedFood = Food.builder()
                .id(1L)
                .name("Pho Bo")
                .category("Vietnamese")
                .price(new BigDecimal("50000"))
                .available(true)
                .createdAt(LocalDateTime.now())
                .build();

        when(foodRepository.save(any(Food.class))).thenReturn(savedFood);

        var result = foodService.create(request);

        assertEquals("Pho Bo", result.name());
        assertEquals(new BigDecimal("50000"), result.price());
        verify(foodRepository).save(any(Food.class));
    }

    @Test
    void getById_WhenNotFound_ShouldThrowException() {
        when(foodRepository.findById(100L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> foodService.getById(100L));
    }

    @Test
    void update_WhenFound_ShouldUpdateData() {
        Food existing = Food.builder()
                .id(2L)
                .name("Banh Mi")
                .category("Vietnamese")
                .price(new BigDecimal("25000"))
                .available(true)
                .createdAt(LocalDateTime.now())
                .build();

        FoodUpdateRequest request = new FoodUpdateRequest(
                "Banh Mi Cha",
                "Vietnamese",
                new BigDecimal("30000"),
                true
        );

        when(foodRepository.findById(2L)).thenReturn(Optional.of(existing));
        when(foodRepository.save(any(Food.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = foodService.update(2L, request);

        assertEquals("Banh Mi Cha", result.name());
        assertEquals(new BigDecimal("30000"), result.price());
    }
}
