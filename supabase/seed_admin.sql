-- Remplacer l'email par le vôtre après création du compte
UPDATE profiles SET role = 'admin', status = 'active' WHERE email = 'admin@testconnect.fr';
