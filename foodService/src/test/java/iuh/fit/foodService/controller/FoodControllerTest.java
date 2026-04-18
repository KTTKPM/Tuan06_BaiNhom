package iuh.fit.foodService.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import iuh.fit.foodService.dto.FoodCreateRequest;
import iuh.fit.foodService.dto.FoodResponse;
import iuh.fit.foodService.exception.GlobalExceptionHandler;
import iuh.fit.foodService.exception.ResourceNotFoundException;
import iuh.fit.foodService.service.FoodService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class FoodControllerTest {

    private MockMvc mockMvc;

    private FoodService foodService;

        @BeforeEach
        void setUp() {
                foodService = Mockito.mock(FoodService.class);
                FoodController foodController = new FoodController(foodService);

                mockMvc = MockMvcBuilders.standaloneSetup(foodController)
                                .setControllerAdvice(new GlobalExceptionHandler())
                                .build();
        }

    @Test
    void create_ShouldReturn201() throws Exception {
        FoodResponse response = new FoodResponse(
                1L,
                "Pizza",
                "Italian",
                new BigDecimal("120000"),
                true,
                LocalDateTime.now()
        );

        when(foodService.create(any(FoodCreateRequest.class))).thenReturn(response);

        String requestBody = """
                {
                  "name": "Pizza",
                  "category": "Italian",
                  "price": 120000,
                  "available": true
                }
                """;

        mockMvc.perform(post("/api/foods")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Pizza"));
    }

    @Test
    void getById_WhenNotFound_ShouldReturn404() throws Exception {
        when(foodService.getById(999L)).thenThrow(new ResourceNotFoundException("Food with id 999 not found"));

        mockMvc.perform(get("/api/foods/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Food with id 999 not found"));
    }
}
