package com.zoo.booking.entity;

import lombok.Data;

@Data
public class SystemSetting {
    private Long id;
    private String settingKey;
    private String settingValue;
    private String description;
}
