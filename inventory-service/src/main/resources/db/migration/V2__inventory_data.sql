-- Add-on Master Data (to be moved here)
-- For now, let's just add slots
INSERT INTO slots (date, start_time, end_time, capacity, booked_count, is_active)
VALUES 
(CURRENT_DATE, '09:00:00', '11:00:00', 50, 0, true),
(CURRENT_DATE, '11:00:00', '13:00:00', 50, 0, true),
(CURRENT_DATE, '14:00:00', '16:00:00', 50, 0, true),
(CURRENT_DATE + 1, '09:00:00', '11:00:00', 50, 0, true),
(CURRENT_DATE + 1, '11:00:00', '13:00:00', 50, 0, true);
