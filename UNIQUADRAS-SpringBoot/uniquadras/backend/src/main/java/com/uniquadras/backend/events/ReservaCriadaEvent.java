package com.uniquadras.backend.events;

import org.springframework.context.ApplicationEvent;
import com.uniquadras.backend.models.Reserva;

public class ReservaCriadaEvent extends ApplicationEvent {
    private final Reserva reserva;

    public ReservaCriadaEvent(Object source, Reserva reserva) {
        super(source);
        this.reserva = reserva;
    }

    public Reserva getReserva() {
        return reserva;
    }
}