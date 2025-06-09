package com.uniquadras.backend.listeners;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.uniquadras.backend.events.ReservaCriadaEvent;

@Component
public class ReservaListener {
    @EventListener
    public void handleReservaCriada(ReservaCriadaEvent event) {
        var reserva = event.getReserva();
        Map<String, Object> payload = new HashMap<>();
        payload.put("idReserva", reserva.getId());
        payload.put("usuario", reserva.getUsuario().getNome());
        payload.put("quadra", reserva.getQuadra().getNome());
        payload.put("horario", reserva.getHorario().getHorario());

        RestTemplate restTemplate = new RestTemplate();
        String url = "http://localhost:8082/notify"; 
        try {
            restTemplate.postForEntity(url, payload, Void.class);
        } catch (Exception e) {
            System.out.println("Falha ao notificar microserviço: " + e.getMessage());
        }
    }
}