package com.CampusConnect.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String root() {
        return "CampusConnect API is live and connected to Neon cloud database!";
    }

    @GetMapping("/api/hello")
    public String hello() {
        return "Hello from CampusConnect!";
    }
}