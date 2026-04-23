package com.zoo.notification.service;

import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import jakarta.mail.internet.MimeMessage;
import java.io.File;

@Service
class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingConfirmation(String to, String bookingId, String guestName, File ticketFile) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Zoo Ticket Confirmation - " + bookingId);
            helper.setText("Dear " + guestName + ",\n\nPlease find your zoo ticket attached.");
            helper.addAttachment("ZooTicket.pdf", ticketFile);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

@RestController
@RequestMapping("/api/notifications")
class NotificationController {
    @Autowired
    private EmailService emailService;

    @PostMapping("/send-ticket")
    public void sendTicket(@RequestBody NotificationRequest request) {
        // Logic to generate PDF (skipped for brevity, but same as monolith)
        // Then call emailService.sendBookingConfirmation
        System.out.println("Sending ticket for booking: " + request.getBookingId());
    }

    @Data
    static class NotificationRequest {
        private String bookingId;
        private String guestEmail;
        private String guestName;
        private Double amount;
    }
}
