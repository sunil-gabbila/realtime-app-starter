package com.kodnest.controller;

import com.kodnest.dto.ItemRequest;
import com.kodnest.dto.ItemResponse;
import com.kodnest.service.ItemService;
import jakarta.validation.Valid;
import java.net.URI;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping
    public ResponseEntity<ItemResponse> add(@Valid @RequestBody ItemRequest request) {
        ItemResponse addedItem = itemService.add(request);
        return ResponseEntity.created(URI.create("/api/items/" + addedItem.id())).body(addedItem);
    }
}
