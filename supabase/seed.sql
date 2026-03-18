-- Seed data: create a system device and populate with initial content
-- Run this after 001_initial_schema.sql

-- System device for seed data
insert into devices (id, device_token, nickname) values
  ('00000000-0000-0000-0000-000000000001', 'system-seed-surfingcamel42', 'SurfingCamel42'),
  ('00000000-0000-0000-0000-000000000002', 'system-seed-tajineking', 'TajineKing'),
  ('00000000-0000-0000-0000-000000000003', 'system-seed-wavefinder77', 'WaveFinder77'),
  ('00000000-0000-0000-0000-000000000004', 'system-seed-nomadstar', 'NomadStar'),
  ('00000000-0000-0000-0000-000000000005', 'system-seed-desertrider', 'DesertRider'),
  ('00000000-0000-0000-0000-000000000006', 'system-seed-moroccanstar5', 'MoroccanStar5'),
  ('00000000-0000-0000-0000-000000000007', 'system-seed-sunsetbro', 'SunsetBro'),
  ('00000000-0000-0000-0000-000000000008', 'system-seed-localshredder', 'LocalShredder'),
  ('00000000-0000-0000-0000-000000000009', 'system-seed-beachsister', 'BeachSister'),
  ('00000000-0000-0000-0000-000000000010', 'system-seed-waverider99', 'WaveRider99');

-- Posts
insert into posts (id, device_id, nickname, title, body, tag, upvote_count, comment_count, created_at) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'SurfingCamel42',
   'Anyone driving to Agadir airport tomorrow morning?',
   'My flight is at 11am and I need a ride from the village. Happy to split gas money. Can be ready by 7am. WhatsApp me!',
   'question', 12, 3, now() - interval '2 hours'),

  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'TajineKing',
   'Selling my 7''6 funboard — great for beginners',
   'Moving on to a shortboard. This board is perfect for the bay wave. Minor dings repaired. Comes with fins and a leash. 1500 MAD or best offer.',
   'for_sale', 8, 2, now() - interval '5 hours'),

  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'WaveFinder77',
   'Lost: blue Patagonia cap near Cathedral Rock',
   'Left it on the rocks yesterday evening while watching sunset. Sentimental value — had it for 6 years traveling. If anyone finds it please let me know!',
   'lost_found', 4, 0, now() - interval '8 hours'),

  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'NomadStar',
   'Beach cleanup this Saturday — who''s in?',
   'Meeting at 9am at the main beach. Bags and gloves provided. Let''s keep our village beautiful. Free tajine afterwards at Hassan''s!',
   'event', 31, 2, now() - interval '1 hour'),

  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'DesertRider',
   'Best time of year to visit Imsouane for longboarding?',
   'Planning my first trip. I''ve heard winter is best for the bay wave but some say early spring is less crowded. What do the locals think?',
   'question', 15, 1, now() - interval '12 hours'),

  ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006', 'MoroccanStar5',
   'WiFi spots with reliable internet for remote work?',
   'I''m a digital nomad staying for 3 months. Where are the cafes or coworking spots with decent internet speed? Need video calls to work.',
   'question', 22, 1, now() - interval '18 hours');

-- Surf posts
insert into posts (id, device_id, nickname, title, body, tag, upvote_count, comment_count, created_at) values
  ('10000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000008', 'LocalShredder',
   'Surf forecast: solid NW swell hitting the bay this weekend',
   'Charts are showing a clean NW swell building Friday night, peaking Saturday morning. 4-6ft on the bay, offshore winds until noon. Sunday looks even cleaner with the wind dropping off. Longboarders — this is your weekend. The cathedral side might be too big for beginners so stick to the inside section. Tide will be best mid-morning around 10am. Get out early before the crowd!',
   'surf', 19, 2, now() - interval '3 hours'),

  ('10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000003', 'WaveFinder77',
   'Heads up: strong rip current on the south side of the bay',
   'Noticed a nasty rip forming on the south end near the rocks today. It pulls hard towards the point, especially on the dropping tide. If you get caught in it, don''t fight it — paddle parallel to the beach towards the harbor side until you''re out of it. Beginners should stay on the north end of the bay where the current is much weaker. The inside reform section is safe and mellow. Stay aware out there!',
   'surf', 27, 1, now() - interval '6 hours');

-- Service posts
insert into posts (id, device_id, nickname, title, body, tag, service_type, service_category, price, contact, upvote_count, comment_count, created_at) values
  ('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000007', 'SunsetBro',
   'Airport transfer — daily runs to Agadir',
   'I do daily airport transfers Imsouane ↔ Agadir. Comfortable car, AC, reliable schedule. Message me on WhatsApp to book.',
   'service', 'offering', 'Airport Transfer', '250 MAD', '+212 6XX XXX XXX', 18, 0, now() - interval '24 hours'),

  ('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000008', 'LocalShredder',
   'Surf lessons for all levels — born here, surfing since age 5',
   'Offering private and group lessons at the bay. I know every inch of this wave. Equipment included. 2 hours session.',
   'service', 'offering', 'Surf Lessons', '300 MAD', '+212 6XX XXX XXX', 25, 0, now() - interval '36 hours'),

  ('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000009', 'BeachSister',
   'Cozy room available — ocean view, 5 min walk to the bay',
   'Private room with terrace overlooking the ocean. Shared kitchen. Perfect for solo travelers or couples. Available from next week.',
   'service', 'offering', 'Accommodation', '200 MAD/night', '+212 6XX XXX XXX', 14, 0, now() - interval '48 hours'),

  ('10000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000010', 'WaveRider99',
   'Looking for surfboard rental — shortboard 6''2 or similar',
   'Here for 2 weeks and don''t want to travel with my board. Looking for a decent shortboard to rent. Happy to pay daily or weekly rate.',
   'service', 'looking_for', 'Board Rental', '', '+212 6XX XXX XXX', 3, 0, now() - interval '6 hours');

-- Comments (triggers will auto-update comment_count, but we set it manually above to match)
insert into comments (id, post_id, device_id, nickname, body, upvote_count, created_at) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'TajineKing',
   'I''m heading out at 7:30. DM me if you want to share the ride!', 4, now() - interval '1 hour 30 minutes'),

  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000004', 'NomadStar',
   'SunsetBro does daily transfers, check his service listing.', 2, now() - interval '1 hour'),

  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000007', 'SunsetBro',
   'Yeah message me! I have space tomorrow morning.', 6, now() - interval '45 minutes'),

  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'WaveFinder77',
   'What size fins? And can I try it before buying?', 1, now() - interval '4 hours'),

  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'TajineKing',
   'FCS II setup. Sure, come by the yellow house near the harbor.', 2, now() - interval '3 hours'),

  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'SurfingCamel42',
   'Count me in! Will bring some friends too.', 3, now() - interval '50 minutes'),

  ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000006', 'MoroccanStar5',
   'Love this initiative. See you there!', 5, now() - interval '30 minutes'),

  ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000008', 'LocalShredder',
   'December to March is the sweet spot. January is king. Swell hits the bay perfectly.', 8, now() - interval '10 hours'),

  ('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000005', 'DesertRider',
   'Cafe Imsouane has decent wifi. Also try the new coworking space above the pharmacy.', 7, now() - interval '16 hours'),

  ('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000010', 'WaveRider99',
   'Finally! Been waiting for a proper swell all week. See you out there Saturday morning.', 3, now() - interval '2 hours'),

  ('20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'SurfingCamel42',
   'The bay was already showing signs of it this afternoon. Small but clean lines coming through. Tomorrow is going to be epic.', 5, now() - interval '1 hour 30 minutes'),

  ('20000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000008', 'LocalShredder',
   'Good call posting this. I''ve seen tourists get dragged out there every winter. The rip moves depending on the sandbank so always check before paddling out.', 9, now() - interval '5 hours');

-- Note: The comment_count trigger will fire on these inserts, so the posts will have
-- their comment_count incremented. Since we set the initial values above, we need to
-- reset them to the correct values after seed:
update posts set comment_count = 3 where id = '10000000-0000-0000-0000-000000000001';
update posts set comment_count = 2 where id = '10000000-0000-0000-0000-000000000002';
update posts set comment_count = 0 where id = '10000000-0000-0000-0000-000000000003';
update posts set comment_count = 2 where id = '10000000-0000-0000-0000-000000000004';
update posts set comment_count = 1 where id = '10000000-0000-0000-0000-000000000005';
update posts set comment_count = 1 where id = '10000000-0000-0000-0000-000000000006';
update posts set comment_count = 0 where id = '10000000-0000-0000-0000-000000000007';
update posts set comment_count = 0 where id = '10000000-0000-0000-0000-000000000008';
update posts set comment_count = 0 where id = '10000000-0000-0000-0000-000000000009';
update posts set comment_count = 0 where id = '10000000-0000-0000-0000-000000000010';
update posts set comment_count = 2 where id = '10000000-0000-0000-0000-000000000011';
update posts set comment_count = 1 where id = '10000000-0000-0000-0000-000000000012';
