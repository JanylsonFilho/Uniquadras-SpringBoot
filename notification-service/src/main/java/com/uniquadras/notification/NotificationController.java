package com.uniquadras.notification;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NotificationController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/notify")
    public ResponseEntity<Void> notify(@RequestBody Map<String, Object> payload) {
        System.out.println("Received notification: " + payload);

        String userEmail = (String) payload.get("email");
        String mensagem = (String) payload.get("mensagem");
        if (userEmail != null && mensagem != null) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(userEmail);
            message.setSubject("Reserva criada com sucesso!");
            message.setText(mensagem); 
            mailSender.send(message);
        }

        return ResponseEntity.ok().build();
    }
}