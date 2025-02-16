package com.stockflow.stockflow.controller;


import com.stockflow.stockflow.models.Users;
import com.stockflow.stockflow.service.UserService;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UserService userService;

    @PostMapping("/save")
    public ResponseEntity<Users> saveUser(@RequestBody Users user) {
        return ResponseEntity.ok(userService.saveUser(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @GetMapping
    public ResponseEntity<List<Users>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/login")
    public ResponseEntity<String> checkUser(@RequestParam String username, @RequestParam String password) {
        boolean isValid = userService.isValidUser(username, password);
        if (isValid) {
            return ResponseEntity.ok("User exists!");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials!");
        }
    }

}
