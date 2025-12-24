package com.example.gmail.labels.dto;

public record LabelDto(
    String id,
    String name,
    String type,
    Integer messagesTotal,
    Integer messagesUnread,
    Integer threadsTotal,
    Integer threadsUnread,
    String labelListVisibility,
    String messageListVisibility
) {}