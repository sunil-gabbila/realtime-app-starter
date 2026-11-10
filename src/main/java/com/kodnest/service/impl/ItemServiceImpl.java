package com.kodnest.service.impl;

import com.kodnest.dto.ItemRequest;
import com.kodnest.dto.ItemResponse;
import com.kodnest.model.Item;
import com.kodnest.repository.ItemRepository;
import com.kodnest.service.ItemService;
import org.springframework.stereotype.Service;

@Service
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;

    public ItemServiceImpl(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Override
    public ItemResponse add(ItemRequest request) {
        Item savedItem = itemRepository.save(new Item(request.name(), request.description()));
        return new ItemResponse(savedItem.getId(), savedItem.getName(), savedItem.getDescription());
    }
}
