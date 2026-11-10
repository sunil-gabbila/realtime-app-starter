package com.kodnest.service;

import com.kodnest.dto.ItemRequest;
import com.kodnest.dto.ItemResponse;

public interface ItemService {

    ItemResponse add(ItemRequest request);
}
