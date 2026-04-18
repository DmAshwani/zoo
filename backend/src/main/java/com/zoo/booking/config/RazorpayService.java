package com.zoo.booking.config;

import com.razorpay.*;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class RazorpayService {

	private final RazorpayClient razorpayClient;


	private static final String RAZORPAY_KEY_SECRET = "";

	public RazorpayService(RazorpayClient razorpayClient) {
		this.razorpayClient = razorpayClient;
	}

	// Create Razorpay Order
	public String createOrder(Double amount, String currency, String receipt) throws RazorpayException {
		JSONObject orderRequest = new JSONObject();
		orderRequest.put("amount", amount * 100); // Amount in paise
		orderRequest.put("currency", currency);
		orderRequest.put("receipt", receipt);
		orderRequest.put("payment_capture", 1);

		Order order = razorpayClient.orders.create(orderRequest);
		return order.get("id").toString();
	}


	public Map<String, String> verifyPayment(String orderId) {
		try {
			// ✅ Fetch order details from Razorpay
			Order order = razorpayClient.orders.fetch(orderId);
			System.out.println("Order Details: " + order);

			// ✅ Fetch payment details using orderId
			List<Payment> payments = razorpayClient.orders.fetchPayments(orderId);
			System.out.println("Payments: " + payments);

			if (payments.isEmpty()) {
				return Map.of("error", "No payment found for this order");
			}

			// ✅ Fetch the first (latest) payment
			Payment payment = payments.get(0);
			String paymentId = payment.get("id");
			String status = payment.get("status");
			String signature = payment.has("signature") ? payment.get("signature") : null;
			String paymentMethod = payment.get("method");

			// ✅ Validate payment signature (if available)
			if (signature != null) {
				JSONObject options = new JSONObject();
				options.put("razorpay_payment_id", paymentId);
				options.put("razorpay_order_id", orderId);
				options.put("razorpay_signature", signature);

				boolean isValid = Utils.verifyPaymentSignature(options, RAZORPAY_KEY_SECRET);
				if (!isValid) {
					return Map.of("error", "Invalid Signature Verification");
				}
			}

			return Map.of("paymentId", paymentId, "status", status, "message", "Payment status updated successfully");
		} catch (Exception e) {
			return Map.of("error", "Payment Verification Failed: " + e.getMessage());
		}
	}

	
	

}
