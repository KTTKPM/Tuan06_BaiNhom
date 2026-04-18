package iuh.fit.foodService.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record FoodResponse(
        Long id,
        String name,
        String category,
        BigDecimal price,
        Boolean available,
        LocalDateTime createdAt
) {
}
