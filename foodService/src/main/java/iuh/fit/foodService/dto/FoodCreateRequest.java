package iuh.fit.foodService.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record FoodCreateRequest(
        @NotBlank(message = "name must not be blank")
        @Size(max = 120, message = "name must be <= 120 characters")
        String name,

        @NotBlank(message = "category must not be blank")
        @Size(max = 60, message = "category must be <= 60 characters")
        String category,

        @NotNull(message = "price must not be null")
        @DecimalMin(value = "0.0", inclusive = false, message = "price must be > 0")
        BigDecimal price,

        @NotNull(message = "available must not be null")
        Boolean available
) {
}
