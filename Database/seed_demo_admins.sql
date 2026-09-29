-- CampusConnect: Seed Demo Administrator Accounts
-- Inserts 3 demo administrator accounts into app_users if they do not already exist.

INSERT INTO app_users (email, password, role)
VALUES
    ('admin1@campusconnect.demo', '$2a$10$CnBdy34gV3CsbR84QqWNdeuoARisDwwTzjIIz9krDbLQr3SmFlAHm', 'ADMIN'),
    ('admin2@campusconnect.demo', '$2a$10$JRc939OlkzZwgty7rfPbDeIAjn5Hcgg6hHm//zy4NNIbtUreIlL0O', 'ADMIN'),
    ('admin3@campusconnect.demo', '$2a$10$4kp1VsTLolQZrF9/pZLHlOX5zwJ7qnOdxd5mAkqhrbBiFO.3rEqxa', 'ADMIN')
ON CONFLICT (email) DO NOTHING;
