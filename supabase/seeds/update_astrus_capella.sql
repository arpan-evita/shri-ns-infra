-- SQL Script to enrich "Astrus Capella" with authentic details
-- Prepared on 2026-03-18

DO $$
DECLARE
    prop_id UUID;
    amen_cctv_id UUID;
    amen_ac_id UUID;
    amen_mep_id UUID;
    amen_toilet_id UUID;
    amen_water_id UUID;
BEGIN
    -- 1. Get Property ID
    SELECT id INTO prop_id FROM properties WHERE slug = 'astrus-capella';

    IF prop_id IS NULL THEN
        RAISE NOTICE 'Property not found. Please ensure Astrus Capella is inserted first.';
        RETURN;
    END IF;

    -- 2. Clean up existing relations for update
    DELETE FROM property_images WHERE property_id = prop_id;
    DELETE FROM property_amenity_relation WHERE property_id = prop_id;
    DELETE FROM nearby_places WHERE property_id = prop_id;

    -- 3. Update Property Details
    UPDATE properties SET
        project_name = 'Astrus Capella - The Star of Wave City',
        description = 'Astrus Capella is a premium commercial high-street marketplace located in Sector-2, Wave City, Ghaziabad. Developed by Astrus Corp, it offers modern retail shops across four levels (LG, UG, 1st, and 2nd Floors). The project features double-height Upper Ground floor shops, premium glass and HPL facades, and sits strategically on a 57-meter wide road. With a high catchment area and GDA/RERA approval, it is the premier retail destination in Wave City.',
        brochure_url = 'https://www.astruscorp.com/assets/images/capella-slider/1.jpg'
    WHERE id = prop_id;

    -- 4. Insert Authentic Images from astruscorp.com
    INSERT INTO property_images (property_id, image_url, is_featured) VALUES
    (prop_id, 'https://www.astruscorp.com/assets/images/capella-slider/1.jpg', TRUE),
    (prop_id, 'https://www.astruscorp.com/assets/images/capella-slider/2.jpg', FALSE),
    (prop_id, 'https://www.astruscorp.com/assets/images/capella-slider/3.jpg', FALSE),
    (prop_id, 'https://www.astruscorp.com/assets/images/capella-slider/4.jpg', FALSE),
    (prop_id, 'https://www.astruscorp.com/assets/images/capella-slider/5.jpg', FALSE),
    (prop_id, 'https://www.astruscorp.com/assets/images/capella-slider/7.jpg', FALSE),
    (prop_id, 'https://www.astruscorp.com/assets/images/capella-slider/8.jpg', FALSE),
    (prop_id, 'https://www.astruscorp.com/assets/images/capella-floor/upper-ground.jpg', FALSE),
    (prop_id, 'https://www.astruscorp.com/assets/images/capella-floor/first-floor.jpg', FALSE),
    (prop_id, 'https://www.astruscorp.com/assets/images/capella-slider/key-plan.jpg', FALSE);

    -- 5. Link Enriched Amenities
    INSERT INTO property_amenity_relation (property_id, amenity_id) 
    SELECT prop_id, id FROM amenities WHERE name IN ('Power Backup', 'Elevator', 'Security', 'Gym', 'Spa', 'Parking', 'Fire Safety', 'CCTV');

    -- 6. Detailed Location Advantages
    INSERT INTO nearby_places (property_id, type, name, distance) VALUES
    (prop_id, 'Hospital', 'Columbia Asia Hospital', 3),
    (prop_id, 'Metro', 'Proposed Metro Station', 3),
    (prop_id, 'Transport', 'Ghaziabad Railway Station', 5),
    (prop_id, 'Education', 'ABES Engineering College', 6),
    (prop_id, 'Education', 'Delhi Public School (DPS)', 8),
    (prop_id, 'Transport', 'ISBT Ghaziabad', 10),
    (prop_id, 'Landmark', 'Akshardham (Delhi)', 15),
    (prop_id, 'Hospital', 'Yashoda Hospital, Kaushambi', 15);

    RAISE NOTICE 'Astrus Capella enriched with authentic data.';
END $$;
