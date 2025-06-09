package com.uniquadras.notification;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NotificationController {
    @PostMapping("/notify")
    public ResponseEntity<Void> notify(@RequestBody Map<String, Object> payload) {
        System.out.println("Received notification: " + payload);
        // Here you could send an email, push notification, etc.
        return ResponseEntity.ok().build();
    }
}