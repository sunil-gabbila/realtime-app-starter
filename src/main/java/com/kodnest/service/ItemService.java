package com.kodnest.service;

import com.kodnest.dto.ItemRequest;
import com.kodnest.dto.ItemResponse;
import java.util.List;

public interface ItemService {

    ItemResponse add(ItemRequest request);

    List<ItemResponse> findAll();
}
