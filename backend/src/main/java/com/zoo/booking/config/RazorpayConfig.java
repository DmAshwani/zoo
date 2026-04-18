package com.zoo.booking.config;

import com.razorpay.RazorpayClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RazorpayConfig {

	private static final String RAZORPAY_KEY_ID = "";
    private static final String RAZORPAY_KEY_SECRET = "";

    @Bean
    RazorpayClient razorpayClient() throws Exception {
        return new RazorpayClient(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET);
    }
}
