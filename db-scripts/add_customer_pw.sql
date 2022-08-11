-- add password column with default value Password123!
ALTER TABLE customer
ADD password varchar(150) NOT NULL default '$2a$04$OSb2IqQV9gQ0QymXPpd8cu3ZdMaIye0vKavJUvs4bUVmtVGKk1Je6';