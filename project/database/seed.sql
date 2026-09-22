-- Seed data for Home Appliance Comparison and Buying Guide Platform

USE home_appliance_db;

SET FOREIGN_KEY_CHECKS = 0;

-- 2. Insert admin and regular users
INSERT INTO users (name, email, phone, password, role) VALUES
('Admin User', 'admin@homeappliance.com', '9876543210', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Rahul Sharma', 'rahul@example.com', '9876543211', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LjZAc2/A3Iq', 'user'),
('Priya Patel', 'priya@example.com', '9876543212', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LjZAc2/A3Iq', 'user'),
('Amit Kumar', 'amit@example.com', '9876543213', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LjZAc2/A3Iq', 'user');


-- 3. Insert 9 categories
INSERT INTO categories (name, slug, description, icon) VALUES
('Refrigerator', 'refrigerator', 'Find the best refrigerators ranging from single door to side-by-side.', '🥶'),
('Washing Machine', 'washing-machine', 'Compare top load, front load and semi-automatic washing machines.', '🧺'),
('Air Conditioner', 'air-conditioner', 'Stay cool with our selection of window and split air conditioners.', '❄️'),
('Television', 'television', 'Discover Smart TVs with 4K, OLED, and QLED displays.', '📺'),
('Microwave', 'microwave', 'Solo, grill, and convection microwave ovens for your kitchen.', '♨️'),
('Air Cooler', 'air-cooler', 'Efficient air coolers for dry climates.', '🌬️'),
('Dishwasher', 'dishwasher', 'Automate your dishwashing with smart dishwashers.', '🍽️'),
('Water Purifier', 'water-purifier', 'RO, UV, UF water purifiers for clean drinking water.', '💧'),
('Vacuum Cleaner', 'vacuum-cleaner', 'Keep your home spotless with powerful vacuum cleaners.', '🧹');

-- 4. Insert 5 refrigerators
INSERT INTO products (name, brand, category_id, model_number, price, original_price, discount_percentage, capacity, energy_rating, warranty_years, is_featured, is_popular) VALUES
('Samsung 253 L 3 Star with Inverter Double Door', 'Samsung', 1, 'RT28A3453S8/HL', 24490.00, 29990.00, 18, '253L', 3, 1, 1, 1),
('LG 190 L 4 Star Inverter Direct-Cool Single Door', 'LG', 1, 'GL-B199OERD', 18000.00, 21990.00, 18, '190L', 4, 1, 0, 1),
('Whirlpool 265 L 2 Star Frost-Free Double Door', 'Whirlpool', 1, 'INTELLIFRESH INV CNV', 26490.00, 31990.00, 17, '265L', 2, 1, 0, 0),
('Haier 570 L Inverter Frost-Free Side-by-Side', 'Haier', 1, 'HRF-622KS', 58990.00, 72990.00, 19, '570L', 3, 1, 1, 0),
('Godrej 190 L 5 Star Inverter Direct-Cool Single Door', 'Godrej', 1, 'RD EDGENEO 207D', 18990.00, 22990.00, 17, '190L', 5, 1, 0, 0);

-- 5. Insert 5 washing machines
INSERT INTO products (name, brand, category_id, model_number, price, original_price, discount_percentage, capacity, energy_rating, warranty_years, is_featured, is_popular) VALUES
('LG 7 Kg 5 Star Semi-Automatic Top Loading', 'LG', 2, 'P7020NGAY', 12490.00, 14990.00, 16, '7kg', 5, 2, 0, 1),
('Samsung 6.5 kg Fully-Automatic Top Loading', 'Samsung', 2, 'WA65A4002VS/TL', 15500.00, 18990.00, 18, '6.5kg', 4, 2, 0, 1),
('IFB 8 Kg 5 Star Fully-Automatic Front Loading', 'IFB', 2, 'Senator WSS', 35990.00, 41990.00, 14, '8kg', 5, 4, 1, 0),
('Whirlpool 7.5 Kg 5 Star Semi-Automatic Top Load', 'Whirlpool', 2, 'ACE SUPREME PLUS', 12990.00, 15490.00, 16, '7.5kg', 5, 2, 0, 0),
('Bosch 7 kg 5 Star Inverter Touch Control Front Loading', 'Bosch', 2, 'WAJ2416SIN', 31990.00, 38990.00, 18, '7kg', 5, 2, 1, 1);

-- 6. Insert 5 air conditioners
INSERT INTO products (name, brand, category_id, model_number, price, original_price, discount_percentage, capacity, energy_rating, warranty_years, is_featured, is_popular) VALUES
('Daikin 1.5 Ton 5 Star Inverter Split AC', 'Daikin', 3, 'MTKM50U', 45990.00, 56990.00, 19, '1.5 Ton', 5, 1, 1, 1),
('Voltas 1.5 Ton 3 Star Inverter Split AC', 'Voltas', 3, '183V CZT3', 34990.00, 42990.00, 18, '1.5 Ton', 3, 1, 0, 1),
('LG 1.0 Ton 5 Star DUAL Inverter Split AC', 'LG', 3, 'PS-Q13NYZA', 38990.00, 47990.00, 18, '1.0 Ton', 5, 1, 0, 0),
('Samsung 2 Ton 3 Star Inverter Split AC', 'Samsung', 3, 'AR24AYLYZ', 52990.00, 64990.00, 18, '2 Ton', 3, 1, 1, 0),
('Blue Star 1.5 Ton 4 Star Inverter Split AC', 'Blue Star', 3, 'IA418DLU', 41990.00, 52990.00, 20, '1.5 Ton', 4, 1, 0, 1);

-- 7. Insert 5 televisions
INSERT INTO products (name, brand, category_id, model_number, price, original_price, discount_percentage, capacity, energy_rating, warranty_years, is_featured, is_popular) VALUES
('Sony Bravia 55 inches 4K Ultra HD Smart LED TV', 'Sony', 4, 'KD-55X74K', 65990.00, 89900.00, 26, '55 inches', 3, 1, 1, 1),
('Samsung 43 inches Crystal 4K Neo Series Smart LED TV', 'Samsung', 4, 'UA43AUE65AKXXL', 34990.00, 47900.00, 27, '43 inches', 3, 1, 0, 1),
('LG 32 inches HD Ready Smart LED TV', 'LG', 4, '32LM563BPTC', 15990.00, 21990.00, 27, '32 inches', 3, 1, 0, 1),
('Mi 5X Series 50 inches 4K Ultra HD Android Smart TV', 'Mi', 4, 'L50M6-ES', 41999.00, 59999.00, 30, '50 inches', 3, 1, 1, 0),
('OnePlus 65 inches U Series 4K LED Smart Android TV', 'OnePlus', 4, '65U1S', 64999.00, 69999.00, 7, '65 inches', 3, 1, 1, 1);

-- 8. Insert 5 microwaves
INSERT INTO products (name, brand, category_id, model_number, price, original_price, discount_percentage, capacity, energy_rating, warranty_years, is_featured, is_popular) VALUES
('LG 28 L Convection Microwave Oven', 'LG', 5, 'MC2846SL', 12990.00, 15490.00, 16, '28 L', 0, 1, 1, 1),
('Samsung 23 L Solo Microwave Oven', 'Samsung', 5, 'MS23J5133AG/TL', 6500.00, 7990.00, 18, '23 L', 0, 1, 0, 1),
('IFB 30 L Convection Microwave Oven', 'IFB', 5, '30BRC2', 15990.00, 18990.00, 15, '30 L', 0, 1, 1, 0),
('Bajaj 20 Litres Grill Microwave Oven', 'Bajaj', 5, '2005 ETB', 5490.00, 6490.00, 15, '20 L', 0, 1, 0, 0),
('Whirlpool 20 L Solo Microwave Oven', 'Whirlpool', 5, 'MAGICOOK PRO 20SE', 5100.00, 6200.00, 17, '20 L', 0, 1, 0, 0);

-- 9. Insert product_features
-- (Using some dynamic inserts or static for the first few to satisfy requirements)
INSERT INTO product_features (product_id, feature_type, feature_text) VALUES
(1, 'feature', 'Convertible Freezer'), (1, 'feature', 'Digital Inverter Compressor'), (1, 'pro', 'Good energy efficiency'), (1, 'con', 'Base stand not included'),
(6, 'feature', 'WindFree Cooling'), (6, 'feature', 'PM 1.0 Filter'), (6, 'pro', 'Very quiet operation'), (6, 'con', 'Installation is expensive'),
(11, 'feature', 'X1 4K Processor'), (11, 'feature', 'Dolby Audio'), (11, 'pro', 'Excellent color reproduction'), (11, 'con', 'Higher price point compared to rivals'),
(16, 'feature', 'Diet Fry Feature'), (16, 'feature', 'Indian Roti Basket'), (16, 'pro', 'Multiple preset menus'), (16, 'con', 'Takes up counter space');

-- 10. Insert product_specifications
INSERT INTO product_specifications (product_id, spec_key, spec_value) VALUES
(1, 'Color', 'Elegant Inox'), (1, 'Dimensions', '555 x 1545 x 637 mm'), (1, 'Weight', '52 Kg'), (1, 'Defrosting Type', 'Frost Free'), (1, 'Compressor Type', 'Digital Inverter Compressor'), (1, 'Door Type', 'Double Door'),
(6, 'Color', 'White'), (6, 'Dimensions', '890 x 285 x 213 mm'), (6, 'Weight', '10 Kg'), (6, 'Cooling Capacity', '5000 Watts'), (6, 'Condenser Coil', 'Copper'), (6, 'Refrigerant', 'R32'),
(11, 'Color', 'Black'), (11, 'Dimensions', '1243 x 719 x 71 mm'), (11, 'Weight', '15.7 Kg'), (11, 'Display Type', 'LED'), (11, 'Resolution', '3840 x 2160 Pixels'), (11, 'Operating System', 'Google TV'),
(16, 'Color', 'Silver'), (16, 'Dimensions', '510 x 305 x 495 mm'), (16, 'Weight', '17.5 Kg'), (16, 'Oven Type', 'Convection'), (16, 'Cavity Material', 'Stainless Steel'), (16, 'Maximum Power', '900 W');

-- 11. Insert buying guides
INSERT INTO buying_guides (title, category_id, slug, content, summary, author_id, is_published) VALUES
('Ultimate Guide to Buying a Refrigerator in India', 1, 'refrigerator-buying-guide', 
'# Refrigerator Buying Guide\n\nChoosing the right refrigerator can be daunting. With so many options available in the Indian market, making the right choice requires considering several factors.\n\n## 1. Capacity\nThe size of your family determines the capacity you need.\n- 1 to 2 members: 150 - 250 Litres\n- 3 to 5 members: 250 - 500 Litres\n- 6+ members: 500+ Litres\n\n## 2. Types of Refrigerators\n- **Single Door**: Economical, consumes less power, but requires manual defrosting in many models.\n- **Double Door**: Frost-free operation with a separate freezer section.\n- **Side-by-Side**: Premium design with ample space and features like water dispensers.\n\n## 3. Energy Efficiency\nLook for BEE star ratings. A 5-star refrigerator costs more upfront but saves significantly on electricity bills in the long run.\n\n## 4. Compressor Type\nInverter compressors are quieter, more durable, and consume less energy compared to standard compressors.\n\n## 5. Additional Features\nLook for features like convertible freezer, built-in stabilizer, and deodorizer.\n\n## Conclusion\nAnalyze your budget and requirements to find the perfect fit for your kitchen.', 
'Learn everything you need to know about buying a refrigerator in India, including capacity, types, energy ratings, and key features to consider.', 
1, 1),
('How to Choose the Best Washing Machine', 2, 'washing-machine-buying-guide', 
'# Washing Machine Buying Guide\n\nA washing machine is an essential appliance for modern homes. Here is how to choose the right one.\n\n## 1. Semi-Automatic vs. Fully Automatic\n- **Semi-Automatic**: Requires manual intervention to move clothes from washing tub to drying tub. More affordable and uses less water.\n- **Fully Automatic**: Does everything with the push of a button. Takes up less space and offers better wash quality.\n\n## 2. Top Load vs. Front Load\n- **Top Load**: Easier to load and unload. Generally cheaper.\n- **Front Load**: Better wash quality, gentler on clothes, and uses less water and electricity.\n\n## 3. Capacity\n- 1-2 people: 6 kg\n- 3-4 people: 7 kg\n- 5+ people: 8 kg and above\n\n## 4. Wash Programs\nLook for customized wash programs for different fabrics like cotton, wool, and synthetics.\n\n## 5. Inverter Technology\nEnsures quiet operation and better energy efficiency.\n\n## Conclusion\nConsider your daily laundry load, budget, and space available before making a purchase.', 
'A comprehensive guide to help you choose the best washing machine, comparing semi vs fully automatic, and top vs front load options.', 
1, 1),
('Air Conditioner Buying Guide: Beat the Heat', 3, 'ac-buying-guide', 
'# Air Conditioner Buying Guide\n\nChoosing the right AC ensures optimal cooling and energy savings.\n\n## 1. Capacity (Tonnage)\n- Up to 120 sq ft: 1.0 Ton\n- 120 - 180 sq ft: 1.5 Ton\n- Above 180 sq ft: 2.0 Ton\n\n## 2. Window vs. Split AC\n- **Window AC**: Easier to install, economical, but blocks a window and can be noisier.\n- **Split AC**: Aesthetically pleasing, quieter, better air distribution, but more expensive to buy and install.\n\n## 3. Inverter Technology\nInverter ACs adjust the compressor speed to maintain the desired temperature, offering consistent cooling and up to 30-50% energy savings.\n\n## 4. Energy Ratings\nHigher star ratings mean better energy efficiency. If usage is more than 5 hours daily, opt for a 4 or 5-star AC.\n\n## 5. Condenser Coil\nAlways choose ACs with copper coils over aluminum coils due to better heat exchange, durability, and easier maintenance.\n\n## Conclusion\nAn inverter split AC with copper condenser is highly recommended for most Indian homes.', 
'Understand tonnage, window vs split options, inverter technology, and energy ratings to choose the best air conditioner for your home.', 
1, 1);

-- 12. Insert reviews
INSERT INTO reviews (product_id, user_id, rating, title, review_text) VALUES
(1, 2, 5, 'Excellent Refrigerator', 'Very spacious and cooling is perfect. The convertible feature is very handy.'),
(1, 3, 4, 'Good value for money', 'Working fine so far. Slightly noisy sometimes but manageable.'),
(6, 4, 5, 'Best washing machine in this budget', 'The wash quality is superb and it uses very little water.'),
(11, 2, 4, 'Amazing Picture Quality', 'The 4K resolution is stunning. Sound could be better though.'),
(16, 3, 5, 'Very useful for baking', 'Convection works flawlessly. Made several cakes and pizzas.');

SET FOREIGN_KEY_CHECKS = 1;
