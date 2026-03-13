CREATE TABLE countries (
	id SERIAL PRIMARY KEY,
	country_code CHAR(2) UNIQUE NOT NULL,
	country_name VARCHAR(100)
);