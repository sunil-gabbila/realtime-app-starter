package com.kodnest.service.impl;

import com.kodnest.dto.ItemRequest;
import com.kodnest.dto.ItemResponse;
import com.kodnest.exception.ItemAlreadyExistsException;
import com.kodnest.model.Item;
import com.kodnest.repository.ItemRepository;
import com.kodnest.service.ItemService;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;

    public ItemServiceImpl(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Override
    public ItemResponse add(ItemRequest request) {
        String name = request.name().trim();
        if (itemRepository.existsByNameIgnoreCase(name)) {
            throw new ItemAlreadyExistsException(
                    "A product named '" + name + "' already exists. Please choose a different name.");
        }

        Item savedItem = itemRepository.save(new Item(name, request.description(), request.quantity()));
        return toResponse(savedItem);
    }

    @Override
    public List<ItemResponse> findAll() {
        return itemRepository.findAll(Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public ItemResponse updateQuantity(Long id, int quantity) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found."));
        item.setQuantity(quantity);
        return toResponse(itemRepository.save(item));
    }

    private ItemResponse toResponse(Item item) {
        return new ItemResponse(item.getId(), item.getName(), item.getDescription(), item.getQuantity());
    }
}
