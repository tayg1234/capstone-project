package com.ysay.zari_back.dto;

public class BBox {
    public int x1;
    public int y1;
    public int x2;
    public int y2;


    @Override
    public String toString() {
        return String.format("x1=%d, y1=%d, x2=%d, y2=%d", x1, y1, x2, y2);
    }
}
