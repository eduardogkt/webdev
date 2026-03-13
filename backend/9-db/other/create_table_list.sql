CREATE TABLE items (
	id SERIAL PRIMARY KEY,
	text VARCHAR(100) NOT NULL
);

INSERT INTO items (text) VALUES ('Buy milk'), ('Finish homework');

SELECT * FROM items;