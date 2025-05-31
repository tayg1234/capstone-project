package com.ysay.zari_back.dto;

public class DetectionDto {
    public String label;
    public double confidence;
    public BBox bbox;

    @Override
    public String toString() {
        return String.format("%s (%.2f) [%s]", label, confidence, bbox);
    }
}


