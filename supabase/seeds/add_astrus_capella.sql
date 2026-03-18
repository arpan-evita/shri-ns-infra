-- SQL Script to add "Astrus Capella" property
-- Prepared on 2026-03-18

DO $$
DECLARE
    prop_id UUID;
    amenity_power_id UUID;
    amenity_lift_id UUID;
    amenity_security_id UUID;
    amenity_gym_id UUID;
    amenity_spa_id UUID;
    amenity_parking_id UUID;
BEGIN
    -- 1. Insert Property
    INSERT INTO properties (
        title, slug, project_name, description, price, price_per_sqft, 
        property_type, status, city, location, possession_status, 
        possession_date, rera_id, carpet_area, area_unit, brochure_url
    ) VALUES (
        'Astrus Capella',
        'astrus-capella',
        'Astrus Capella',
        'Astrus Capella is a premium commercial high-street marketplace located in Wave City, Ghaziabad. Developed by Astrus Corp, it offers modern retail shops with excellent visibility and connectivity. The project features a stunning glass and HPL facade, double-height retail spaces, and a variety of amenities suitable for a modern business hub.',
        5000000,
        14000,
        'Commercial',
        'buy',
        'Ghaziabad',
        'Plot No. 1G, Sector 2, Pinewood Enclave, Wave City, Ghaziabad, 201015',
        'New Launch',
        '2030-06-23',
        'UPRERAPRJ534892/08/2025',
        312,
        'sqft',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop'
    ) RETURNING id INTO prop_id;

    -- 2. Insert Images (Stock images)
    INSERT INTO property_images (property_id, image_url, is_featured) VALUES
    (prop_id, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', TRUE),
    (prop_id, 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop', FALSE),
    (prop_id, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop', FALSE);

    -- 3. Link Amenities
    SELECT id INTO amenity_power_id FROM amenities WHERE name = 'Power Backup';
    SELECT id INTO amenity_lift_id FROM amenities WHERE name = 'Elevator' OR name = 'Lift';
    SELECT id INTO amenity_security_id FROM amenities WHERE name = 'Security';
    SELECT id INTO amenity_gym_id FROM amenities WHERE name = 'Gym';
    SELECT id INTO amenity_spa_id FROM amenities WHERE name = 'Spa';
    SELECT id INTO amenity_parking_id FROM amenities WHERE name = 'Parking';

    IF amenity_power_id IS NOT NULL THEN INSERT INTO property_amenity_relation (property_id, amenity_id) VALUES (prop_id, amenity_power_id); END IF;
    IF amenity_lift_id IS NOT NULL THEN INSERT INTO property_amenity_relation (property_id, amenity_id) VALUES (prop_id, amenity_lift_id); END IF;
    IF amenity_security_id IS NOT NULL THEN INSERT INTO property_amenity_relation (property_id, amenity_id) VALUES (prop_id, amenity_security_id); END IF;
    IF amenity_gym_id IS NOT NULL THEN INSERT INTO property_amenity_relation (property_id, amenity_id) VALUES (prop_id, amenity_gym_id); END IF;
    IF amenity_spa_id IS NOT NULL THEN INSERT INTO property_amenity_relation (property_id, amenity_id) VALUES (prop_id, amenity_spa_id); END IF;
    IF amenity_parking_id IS NOT NULL THEN INSERT INTO property_amenity_relation (property_id, amenity_id) VALUES (prop_id, amenity_parking_id); END IF;

    -- 4. Insert Nearby Places
    INSERT INTO nearby_places (property_id, type, name, distance) VALUES
    (prop_id, 'Road', '57-meter wide main road', 0.1),
    (prop_id, 'Highway', 'NH-24', 0.5),
    (prop_id, 'Metro', 'Ghaziabad Metro Station', 5),
    (prop_id, 'Hospital', 'Apex Hospital', 2),
    (prop_id, 'School', 'Wave City School', 1.5);

    RAISE NOTICE 'Property Astrus Capella added with ID: %', prop_id;
END $$;
