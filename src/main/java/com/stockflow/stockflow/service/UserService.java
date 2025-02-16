package com.stockflow.stockflow.service;

import com.stockflow.stockflow.models.Users;
import com.stockflow.stockflow.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UsersRepository usersRepository;

    public Users saveUser(Users user) {
        user.setCreated_at(LocalDateTime.now());
        return usersRepository.save(user);
    }

    public void deleteUser(Long userId) {
        usersRepository.deleteById(userId);
    }
    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }
    public boolean isValidUser(String username, String password) {
        Optional<Users> user = usersRepository.findByUsernameAndPassword(username, password);
        return user.isPresent();
    }

}
