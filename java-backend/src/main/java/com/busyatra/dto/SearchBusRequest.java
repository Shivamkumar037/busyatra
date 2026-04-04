package com.busyatra.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * Search Bus Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchBusRequest {

    private Long sourceCityId;
    private Long destinationCityId;
    private LocalDate travelDate;
    private String busNo;
}