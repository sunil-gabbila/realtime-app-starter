package com.kodnest.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.kodnest.dto.ItemRequest;
import com.kodnest.dto.ItemResponse;
import com.kodnest.exception.ItemAlreadyExistsException;
import com.kodnest.model.Item;
import com.kodnest.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ItemServiceImplTest {

    @Mock
    private ItemRepository itemRepository;

    private ItemServiceImpl itemService;

    @BeforeEach
    void setUp() {
        itemService = new ItemServiceImpl(itemRepository);
    }

    @Test
    void addThrowsMeaningfulErrorWhenNameAlreadyExists() {
        when(itemRepository.existsByNameIgnoreCase("Coffee")).thenReturn(true);

        ItemAlreadyExistsException exception = assertThrows(
                ItemAlreadyExistsException.class,
                () -> itemService.add(new ItemRequest(" Coffee ", "Ground coffee"))
        );

        assertEquals("An item named 'Coffee' already exists.", exception.getMessage());
        verify(itemRepository, never()).save(any(Item.class));
    }

    @Test
    void addTrimsNameBeforeCheckingAndSaving() {
        when(itemRepository.existsByNameIgnoreCase("Coffee")).thenReturn(false);
        when(itemRepository.save(any(Item.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ItemResponse response = itemService.add(new ItemRequest(" Coffee ", "Ground coffee"));

        assertEquals("Coffee", response.name());
        assertEquals("Ground coffee", response.description());
        verify(itemRepository).existsByNameIgnoreCase("Coffee");
    }
}
