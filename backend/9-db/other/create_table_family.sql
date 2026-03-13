CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	name VARCHAR(15) UNIQUE NOT NULL,
	color VARCHAR(15)
);

CREATE TABLE visited_countries(
	id SERIAL PRIMARY KEY,
	country_code CHAR(2) NOT NULL,
	user_id INTEGER REFERENCES users(id),
	UNIQUE (country_code, user_id)
);