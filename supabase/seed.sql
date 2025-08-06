-- Insert sample companies
INSERT INTO companies (id, name, domain, settings) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'TechCorp Solutions', 'techcorp.com', '{"theme": "blue", "features": ["products", "reports", "forms"]}'),
('550e8400-e29b-41d4-a716-446655440002', 'InnovateNow LLC', 'innovatenow.com', '{"theme": "green", "features": ["products", "forms"]}');

-- Insert sample user profiles (requires auth.users to exist first)
-- Note: In real implementation, these would be created via Supabase Auth
INSERT INTO user_profiles (id, company_id, email, full_name, role) VALUES
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', 'admin@techcorp.com', 'Alice Admin', 'admin'),
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440001', 'manager@techcorp.com', 'Bob Manager', 'manager'),
('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440001', 'user@techcorp.com', 'Carol User', 'user'),
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440002', 'admin@innovatenow.com', 'David Director', 'admin');

-- Insert product categories
INSERT INTO product_categories (id, company_id, name, description, sort_order) VALUES
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440001', 'Electronics', 'Electronic devices and components', 1),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440001', 'Software', 'Software products and licenses', 2),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440001', 'Hardware', 'Computer hardware and accessories', 3),
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440002', 'Innovation Tools', 'Tools for innovation and development', 1);

-- Insert sample products
INSERT INTO products (id, company_id, category_id, name, description, sku, price, cost, stock_quantity, images, specifications, tags, created_by) VALUES
('550e8400-e29b-41d4-a716-446655440501', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440301', 'Smart Sensor Pro', 'Advanced IoT sensor with multiple connectivity options', 'SSP-001', 299.99, 150.00, 50, '["sensor1.jpg", "sensor2.jpg"]', '{"connectivity": ["WiFi", "Bluetooth", "LoRa"], "battery_life": "2 years", "range": "100m"}', '["IoT", "sensor", "smart"]', '550e8400-e29b-41d4-a716-446655440101'),
('550e8400-e29b-41d4-a716-446655440502', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440302', 'DataFlow Analytics', 'Real-time data analytics software platform', 'DFA-002', 1499.99, 300.00, 25, '["software1.jpg"]', '{"users": "unlimited", "storage": "1TB", "integrations": 50}', '["analytics", "software", "data"]', '550e8400-e29b-41d4-a716-446655440101'),
('550e8400-e29b-41d4-a716-446655440503', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440303', 'Server Rack Unit', 'High-performance server for enterprise use', 'SRU-003', 3999.99, 2000.00, 10, '["server1.jpg", "server2.jpg", "server3.jpg"]', '{"cpu": "Intel Xeon", "ram": "64GB", "storage": "2TB SSD"}', '["server", "hardware", "enterprise"]', '550e8400-e29b-41d4-a716-446655440102'),
('550e8400-e29b-41d4-a716-446655440601', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440401', 'Innovation Toolkit', 'Complete toolkit for product innovation', 'ITK-001', 599.99, 250.00, 30, '["toolkit1.jpg"]', '{"components": 25, "software_included": true, "warranty": "1 year"}', '["innovation", "toolkit", "development"]', '550e8400-e29b-41d4-a716-446655440201');

-- Insert form templates
INSERT INTO form_templates (id, company_id, name, description, is_multi_step, steps_config, conditional_logic, created_by) VALUES
('550e8400-e29b-41d4-a716-446655440701', '550e8400-e29b-41d4-a716-446655440001', 'Product Registration Form', 'Multi-step form for new product registration', true, 
'[{"step": 1, "title": "Basic Information", "description": "Enter basic product details"}, {"step": 2, "title": "Technical Specifications", "description": "Add technical details"}, {"step": 3, "title": "Pricing & Inventory", "description": "Set pricing and stock information"}, {"step": 4, "title": "Review & Submit", "description": "Review all information before submission"}]',
'{"show_step_2_if": {"field": "product_type", "value": "electronic"}, "show_step_3_if": {"field": "has_variants", "value": true}}', 
'550e8400-e29b-41d4-a716-446655440101'),
('550e8400-e29b-41d4-a716-446655440702', '550e8400-e29b-41d4-a716-446655440002', 'Innovation Assessment', 'Assess innovation potential of new ideas', true,
'[{"step": 1, "title": "Idea Overview", "description": "Describe your innovation idea"}, {"step": 2, "title": "Market Analysis", "description": "Analyze market potential"}, {"step": 3, "title": "Technical Feasibility", "description": "Assess technical requirements"}]',
'{}', '550e8400-e29b-41d4-a716-446655440201');

-- Insert form questions
INSERT INTO form_questions (id, form_template_id, question_text, question_type, step_number, sort_order, is_required, options, validation_rules, help_text) VALUES
-- Product Registration Form - Step 1
('550e8400-e29b-41d4-a716-446655440801', '550e8400-e29b-41d4-a716-446655440701', 'Product Name', 'text', 1, 1, true, '[]', '{"min_length": 3, "max_length": 255}', 'Enter a clear, descriptive name for your product'),
('550e8400-e29b-41d4-a716-446655440802', '550e8400-e29b-41d4-a716-446655440701', 'Product Category', 'select', 1, 2, true, '["Electronics", "Software", "Hardware", "Services"]', '{}', 'Select the primary category for this product'),
('550e8400-e29b-41d4-a716-446655440803', '550e8400-e29b-41d4-a716-446655440701', 'Product Description', 'textarea', 1, 3, true, '[]', '{"min_length": 10, "max_length": 1000}', 'Provide a detailed description of the product'),
('550e8400-e29b-41d4-a716-446655440804', '550e8400-e29b-41d4-a716-446655440701', 'Product Type', 'radio', 1, 4, true, '["electronic", "mechanical", "software", "hybrid"]', '{}', 'Select the primary product type'),

-- Product Registration Form - Step 2
('550e8400-e29b-41d4-a716-446655440805', '550e8400-e29b-41d4-a716-446655440701', 'Technical Specifications', 'textarea', 2, 1, false, '[]', '{}', 'Enter detailed technical specifications (JSON format supported)'),
('550e8400-e29b-41d4-a716-446655440806', '550e8400-e29b-41d4-a716-446655440701', 'Dimensions (L x W x H)', 'text', 2, 2, false, '[]', '{"pattern": "^[0-9.]+ x [0-9.]+ x [0-9.]+$"}', 'Enter dimensions in format: length x width x height'),
('550e8400-e29b-41d4-a716-446655440807', '550e8400-e29b-41d4-a716-446655440701', 'Weight (kg)', 'number', 2, 3, false, '[]', '{"min": 0, "step": 0.1}', 'Enter weight in kilograms'),

-- Product Registration Form - Step 3
('550e8400-e29b-41d4-a716-446655440808', '550e8400-e29b-41d4-a716-446655440701', 'SKU', 'text', 3, 1, true, '[]', '{"pattern": "^[A-Z]{2,3}-[0-9]{3,4}$"}', 'Enter SKU in format: ABC-123 or ABCD-1234'),
('550e8400-e29b-41d4-a716-446655440809', '550e8400-e29b-41d4-a716-446655440701', 'Price ($)', 'number', 3, 2, true, '[]', '{"min": 0.01, "step": 0.01}', 'Enter the selling price in USD'),
('550e8400-e29b-41d4-a716-446655440810', '550e8400-e29b-41d4-a716-446655440701', 'Cost ($)', 'number', 3, 3, true, '[]', '{"min": 0.01, "step": 0.01}', 'Enter the cost price in USD'),
('550e8400-e29b-41d4-a716-446655440811', '550e8400-e29b-41d4-a716-446655440701', 'Initial Stock Quantity', 'number', 3, 4, true, '[]', '{"min": 0, "step": 1}', 'Enter initial stock quantity'),
('550e8400-e29b-41d4-a716-446655440812', '550e8400-e29b-41d4-a716-446655440701', 'Has Variants?', 'boolean', 3, 5, false, '[]', '{}', 'Does this product have size, color, or other variants?'),

-- Innovation Assessment - Step 1
('550e8400-e29b-41d4-a716-446655440901', '550e8400-e29b-41d4-a716-446655440702', 'Innovation Title', 'text', 1, 1, true, '[]', '{"min_length": 5, "max_length": 200}', 'Give your innovation idea a compelling title'),
('550e8400-e29b-41d4-a716-446655440902', '550e8400-e29b-41d4-a716-446655440702', 'Problem Statement', 'textarea', 1, 2, true, '[]', '{"min_length": 20, "max_length": 500}', 'What problem does your innovation solve?'),
('550e8400-e29b-41d4-a716-446655440903', '550e8400-e29b-41d4-a716-446655440702', 'Solution Overview', 'textarea', 1, 3, true, '[]', '{"min_length": 20, "max_length": 500}', 'Describe your proposed solution'),

-- Innovation Assessment - Step 2
('550e8400-e29b-41d4-a716-446655440904', '550e8400-e29b-41d4-a716-446655440702', 'Target Market Size', 'select', 2, 1, true, '["Small (< $1M)", "Medium ($1M - $10M)", "Large ($10M - $100M)", "Massive (> $100M)"]', '{}', 'Estimate the total addressable market size'),
('550e8400-e29b-41d4-a716-446655440905', '550e8400-e29b-41d4-a716-446655440702', 'Competition Level', 'radio', 2, 2, true, '["No competition", "Light competition", "Moderate competition", "Heavy competition"]', '{}', 'How competitive is this market?');

-- Insert sample form submissions
INSERT INTO form_submissions (id, form_template_id, company_id, submitted_by, status, submission_data, current_step, completed_steps, submitted_at) VALUES
('550e8400-e29b-41d4-a716-446655440a01', '550e8400-e29b-41d4-a716-446655440701', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440103', 'submitted', 
'{"product_name": "Smart Thermostat", "product_category": "Electronics", "product_description": "WiFi-enabled smart thermostat with learning capabilities", "product_type": "electronic", "sku": "STH-001", "price": 199.99, "cost": 89.50, "initial_stock_quantity": 100}', 
4, '{1,2,3,4}', NOW() - INTERVAL '2 days'),

('550e8400-e29b-41d4-a716-446655440a02', '550e8400-e29b-41d4-a716-446655440701', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440103', 'draft', 
'{"product_name": "Smart Lock", "product_category": "Electronics", "product_description": "Bluetooth and fingerprint enabled smart door lock"}', 
2, '{1}', NULL),

('550e8400-e29b-41d4-a716-446655440a03', '550e8400-e29b-41d4-a716-446655440702', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440201', 'submitted',
'{"innovation_title": "AI-Powered Design Tool", "problem_statement": "Designers spend too much time on repetitive tasks", "solution_overview": "AI assistant that automates common design workflows", "target_market_size": "Large ($10M - $100M)", "competition_level": "Moderate competition"}',
3, '{1,2,3}', NOW() - INTERVAL '5 days');

-- Insert sample reports
INSERT INTO reports (id, company_id, name, description, report_type, data_filters, generated_by, status, generation_completed_at) VALUES
('550e8400-e29b-41d4-a716-446655440b01', '550e8400-e29b-41d4-a716-446655440001', 'Q4 Product Summary', 'Comprehensive product report for Q4 2024', 'product_summary', '{"date_range": {"start": "2024-10-01", "end": "2024-12-31"}, "categories": ["Electronics", "Software"]}', '550e8400-e29b-41d4-a716-446655440101', 'completed', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440b02', '550e8400-e29b-41d4-a716-446655440001', 'Form Submissions Analysis', 'Analysis of form submission patterns', 'submission_analysis', '{"form_template_id": "550e8400-e29b-41d4-a716-446655440701"}', '550e8400-e29b-41d4-a716-446655440102', 'completed', NOW() - INTERVAL '3 hours'),
('550e8400-e29b-41d4-a716-446655440b03', '550e8400-e29b-41d4-a716-446655440002', 'Innovation Pipeline Report', 'Current innovation projects status', 'innovation_pipeline', '{}', '550e8400-e29b-41d4-a716-446655440201', 'generating', NULL);