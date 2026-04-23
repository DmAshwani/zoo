package com.zoo.identity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuResponse {
    private Long id;
    private String label;
    private String path;
    private String icon;
    private Long parentId;
    private Integer sequence;
    private List<MenuResponse> children;
}
