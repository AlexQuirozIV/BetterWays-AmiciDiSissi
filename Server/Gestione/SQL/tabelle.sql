CREATE TABLE locations (
	id INT AUTO_INCREMENT PRIMARY KEY,
    name Varchar(255) NOT NULL,
    latitude Decimal(9,6) NOT NULL,
    Longitude Decimal(9,6) NOT NULL
);

INSERT INTO locations (name, latitude, longitude) VALUES
('Castello-Visconteo', 45.312376641034014, 9.498816848941937),
('Chiesa-di-San-Francesco', 45.314617754968054, 9.507929720552477),
('Duomo-di-Lodi', 45.314214319510235, 9.503150096251492),
('Faustina-Sporting-Club', 45.30054479572416, 9.50729370117188),
('Monumento-alla-Resistenza', 45.31043780366223, 9.501946341831502),
('Museo-della-Stampa', 45.31796325796598, 9.502647436164928),
('Museo-dello-Strumento-Musicale-&-della-Musica', 45.30701338770822, 9.50199549913424),
('Museo-di-Paolo-Gorini', 45.3138348117735, 9.508056454515657),
('Palazzetto-Palacastellotti', 45.297359483089814, 9.510770296119013),
('Parco-Adda-Sud', 45.314040272551736, 9.498271300674975),
('Parco-Isola-Carolina', 45.315097006869266, 9.498896680791935),
('Parco-Villa-Braila', 45.30376301489828, 9.508691843847435),
('Stadio-Dossenina', 45.30739132224016, 9.495022000717784),
('Teatro-Alle-Vigne', 45.31506910520015, 9.506154729318768),
('Tempio-Civico-Incoronata', 45.31465971960593, 9.502055674244136),
('Torrione-di-Lodi', 45.3126397552172, 9.498001343678204),
('Piazza-Broletto', 45.31452738912999, 9.50285367329064),
('Piazza-Mercato', 45.315046320365575, 9.504111225140116),
('Ufficio-turistico', 45.31457313558977, 9.502831126442807),
('Chiesa-della-Maddalena', 45.31835179420975, 9.504352611647226),
('Biblioteca-Laudense', 45.316260560309566, 9.504173325140222),
('Piazza-Castello', 45.3126698, 9.4997774);

CREATE TABLE User (
	id INT AUTO_INCREMENT PRIMARY KEY,
    nome Varchar(255) NOT NULL,
    cognome Varchar(255) NOT NULL,
    email Varchar(255) NOT NULL,
    password Varchar(255) NOT NULL,
);

INSERT INTO User (nome, cognome, email, password) VALUES
('Mario', 'Rossi', 'mario.rossi@example.com', 'password123'),
('Luca', 'Bianchi', 'luca.bianchi@example.com', 'password456'),
('Giulia', 'Verdi', 'giulia.verdi@example.com', 'password789'),
('Francesca', 'Neri', 'francesca.neri@example.com', 'password321'),
('Marco', 'Gialli', 'marco.gialli@example.com', 'password654'),
('Anna', 'Blu', 'anna.blu@example.com', 'password987'),
('Paolo', 'Grigi', 'paolo.grigi@example.com', 'password741'),
('Elena', 'Marroni', 'elena.marroni@example.com', 'password852'),
('Davide', 'Rosa', 'davide.rosa@example.com', 'password963'),
('Chiara', 'Azzurri', 'chiara.azzurri@example.com', 'password159');