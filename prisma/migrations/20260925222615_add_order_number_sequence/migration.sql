-- RG-14 : numéro de commande OS-000123 généré par une vraie séquence
-- Postgres, atomique sous accès concurrent (contrairement à l'ancien
-- compteur applicatif `SELECT COUNT(*)+1`, sujet à collision).
CREATE SEQUENCE IF NOT EXISTS "order_number_seq";

-- Initialise la séquence après le plus grand numéro déjà utilisé (données
-- de démonstration du seed), pour ne jamais entrer en collision avec une
-- commande existante.
SELECT setval('order_number_seq', COALESCE((SELECT MAX(CAST(SUBSTRING("number" FROM 4) AS INTEGER)) FROM "Order"), 0) + 1, false);
