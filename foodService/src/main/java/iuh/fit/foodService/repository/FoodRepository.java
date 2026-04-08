package iuh.fit.foodService.repository;

import iuh.fit.foodService.entity.Food;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodRepository extends JpaRepository<Food, Long> {

    List<Food> findByNameContainingIgnoreCase(String keyword);

    List<Food> findByAvailable(Boolean available);
}
