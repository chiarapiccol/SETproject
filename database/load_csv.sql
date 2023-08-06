CREATE TABLE chromium (
    id int NOT NULL PRIMARY KEY,
    country varchar(255), 
    subCommodity varchar(255),
    year2008 numeric(20,3),
    year2009 numeric(20,3),
    year2010 numeric(20,3),
    year2011 numeric(20,3),
    year2012 numeric(20,3),
    year2013 numeric(20,3),
    year2014 numeric(20,3),
    year2015 numeric(20,3),
    year2016 numeric(20,3),
    year2017 numeric(20,3),
    year2018 numeric(20,3),
    eip varchar(255),
    mat varchar(255)
);

COPY chromium FROM '/docker-entrypoint-initdb.d/chromium.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE cobalt (
    id int NOT NULL PRIMARY KEY,
    country varchar(255), 
    subCommodity varchar(255),
    year2008 numeric(20,3),
    year2009 numeric(20,3),
    year2010 numeric(20,3),
    year2011 numeric(20,3),
    year2012 numeric(20,3),
    year2013 numeric(20,3),
    year2014 numeric(20,3),
    year2015 numeric(20,3),
    year2016 numeric(20,3),
    year2017 numeric(20,3),
    year2018 numeric(20,3),
    eip varchar(255),
    mat varchar(255)
);

COPY cobalt FROM '/docker-entrypoint-initdb.d/cobalt.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE copper (
    id int NOT NULL PRIMARY KEY,
    country varchar(255), 
    subCommodity varchar(255),
    year2008 numeric(20,3),
    year2009 numeric(20,3),
    year2010 numeric(20,3),
    year2011 numeric(20,3),
    year2012 numeric(20,3),
    year2013 numeric(20,3),
    year2014 numeric(20,3),
    year2015 numeric(20,3),
    year2016 numeric(20,3),
    year2017 numeric(20,3),
    year2018 numeric(20,3),
    eip varchar(255),
    mat varchar(255) 
);

COPY copper FROM '/docker-entrypoint-initdb.d/copper.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE graphite (
    id int NOT NULL PRIMARY KEY,
    country varchar(255), 
    subCommodity varchar(255),
    year2008 numeric(20,3),
    year2009 numeric(20,3),
    year2010 numeric(20,3),
    year2011 numeric(20,3),
    year2012 numeric(20,3),
    year2013 numeric(20,3),
    year2014 numeric(20,3),
    year2015 numeric(20,3),
    year2016 numeric(20,3),
    year2017 numeric(20,3),
    year2018 numeric(20,3),
    eip varchar(255),
    mat varchar(255)    
);

COPY graphite FROM '/docker-entrypoint-initdb.d/graphite.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE lithium (
    id int NOT NULL PRIMARY KEY,
    country varchar(255), 
    subCommodity varchar(255),
    year2008 numeric(20,3),
    year2009 numeric(20,3),
    year2010 numeric(20,3),
    year2011 numeric(20,3),
    year2012 numeric(20,3),
    year2013 numeric(20,3),
    year2014 numeric(20,3),
    year2015 numeric(20,3),
    year2016 numeric(20,3),
    year2017 numeric(20,3),
    year2018 numeric(20,3),
    eip varchar(255),
    mat varchar(255)
);

COPY lithium FROM '/docker-entrypoint-initdb.d/lithium.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE manganese (
    id int NOT NULL PRIMARY KEY,
    country varchar(255), 
    subCommodity varchar(255),
    year2008 numeric(20,3),
    year2009 numeric(20,3),
    year2010 numeric(20,3),
    year2011 numeric(20,3),
    year2012 numeric(20,3),
    year2013 numeric(20,3),
    year2014 numeric(20,3),
    year2015 numeric(20,3),
    year2016 numeric(20,3),
    year2017 numeric(20,3),
    year2018 numeric(20,3),
    eip varchar(255),
    mat varchar(255)
);

COPY manganese FROM '/docker-entrypoint-initdb.d/manganese.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE molybdenum (
    id int NOT NULL PRIMARY KEY,
    country varchar(255), 
    subCommodity varchar(255),
    year2008 numeric(20,3),
    year2009 numeric(20,3),
    year2010 numeric(20,3),
    year2011 numeric(20,3),
    year2012 numeric(20,3),
    year2013 numeric(20,3),
    year2014 numeric(20,3),
    year2015 numeric(20,3),
    year2016 numeric(20,3),
    year2017 numeric(20,3),
    year2018 numeric(20,3),
    eip varchar(255),
    mat varchar(255)
);

COPY molybdenum FROM '/docker-entrypoint-initdb.d/molybdenum.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE nickel (
    id int NOT NULL PRIMARY KEY,
    country varchar(255), 
    subCommodity varchar(255),
    year2008 numeric(20,3),
    year2009 numeric(20,3),
    year2010 numeric(20,3),
    year2011 numeric(20,3),
    year2012 numeric(20,3),
    year2013 numeric(20,3),
    year2014 numeric(20,3),
    year2015 numeric(20,3),
    year2016 numeric(20,3),
    year2017 numeric(20,3),
    year2018 numeric(20,3),
    eip varchar(255),
    mat varchar(255)
);

COPY nickel FROM '/docker-entrypoint-initdb.d/nickel.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE platinum (
    id int NOT NULL PRIMARY KEY,
    country varchar(255), 
    subCommodity varchar(255),
    year2008 numeric(20,3),
    year2009 numeric(20,3),
    year2010 numeric(20,3),
    year2011 numeric(20,3),
    year2012 numeric(20,3),
    year2013 numeric(20,3),
    year2014 numeric(20,3),
    year2015 numeric(20,3),
    year2016 numeric(20,3),
    year2017 numeric(20,3),
    year2018 numeric(20,3),
    eip varchar(255),
    mat varchar(255)
);

COPY platinum FROM '/docker-entrypoint-initdb.d/platinum.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE ree (
    id int NOT NULL PRIMARY KEY,
    country varchar(255), 
    subCommodity varchar(255),
    year2008 numeric(20,3),
    year2009 numeric(20,3),
    year2010 numeric(20,3),
    year2011 numeric(20,3),
    year2012 numeric(20,3),
    year2013 numeric(20,3),
    year2014 numeric(20,3),
    year2015 numeric(20,3),
    year2016 numeric(20,3),
    year2017 numeric(20,3),
    year2018 numeric(20,3),
    eip varchar(255),
    mat varchar(255)
);

COPY ree FROM '/docker-entrypoint-initdb.d/ree.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE silver (
    id int NOT NULL PRIMARY KEY,
    country varchar(255), 
    subCommodity varchar(255),
    year2008 numeric(20,3),
    year2009 numeric(20,3),
    year2010 numeric(20,3),
    year2011 numeric(20,3),
    year2012 numeric(20,3),
    year2013 numeric(20,3),
    year2014 numeric(20,3),
    year2015 numeric(20,3),
    year2016 numeric(20,3),
    year2017 numeric(20,3),
    year2018 numeric(20,3),
    eip varchar(255),
    mat varchar(255)
);

COPY silver FROM '/docker-entrypoint-initdb.d/silver.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE zinc (
    id int NOT NULL PRIMARY KEY,
    country varchar(255), 
    subCommodity varchar(255),
    year2008 numeric(20,3),
    year2009 numeric(20,3),
    year2010 numeric(20,3),
    year2011 numeric(20,3),
    year2012 numeric(20,3),
    year2013 numeric(20,3),
    year2014 numeric(20,3),
    year2015 numeric(20,3),
    year2016 numeric(20,3),
    year2017 numeric(20,3),
    year2018 numeric(20,3),
    eip varchar(255),
    mat varchar(255)
);

COPY zinc FROM '/docker-entrypoint-initdb.d/zinc.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE matTech (
    id int NOT NULL PRIMARY KEY,
    techGroup varchar(255),
    tech varchar(255),
    mat varchar(255),
    scenario varchar(255),
    year2020 numeric(20,3),
    year2030 numeric(20,3),
    year2040 numeric(20,3)
);

COPY matTech FROM '/docker-entrypoint-initdb.d/allMatForAllTech_nachTech.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE priceCRMdollar (
    id int NOT NULL PRIMARY KEY,
    year int,
    month int,
    phosphateRock numeric(20,3),
    urea numeric(20,3),
    potassiumChloride numeric(20,3),
    aluminum numeric(20,3),
    ironOre numeric(20,3),
    copper numeric(20,3),
    lead numeric(20,3),
    tin numeric(20,3),
    nickel numeric(20,3),
    zinc numeric(20,3),
    gold numeric(20,3),
    platinum numeric(20,3),
    silver numeric(20,3)
);

COPY priceCRMdollar FROM '/docker-entrypoint-initdb.d/priceCRMdollar.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE priceRMeuro (
    id int NOT NULL PRIMARY KEY,
    year int,
    month int,
    mineralMetals numeric(20,3),
    preciousMetals numeric(20,3),
    ferrousMetals numeric(20,3),
    allMetals numeric(20,3)
);

COPY priceRMeuro FROM '/docker-entrypoint-initdb.d/priceImportAllRawMatEuro.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE countryTechEnergy (
    id int NOT NULL PRIMARY KEY,
    country varchar(255),
    technologyAndSource varchar(255),
    year int,
    mainCategory varchar(255),
    subCategory varchar(255),
    value numeric(20,3), 
    unit varchar(255)
);

COPY countryTechEnergy FROM '/docker-entrypoint-initdb.d/countryTechEnergy.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE countryTechEnergy_groups (
    id int NOT NULL PRIMARY KEY,
    country varchar(255),
    technologyAndSource varchar(255),
    year int,
    mainCategory varchar(255),
    subCategory varchar(255),
    value numeric(20,3), 
    unit varchar(255),
    Green_Red varchar(255)
);

COPY countryTechEnergy_groups FROM '/docker-entrypoint-initdb.d/countryTechEnergy_groups.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE crmIEP (
    id int NOT NULL PRIMARY KEY,
    country varchar(255), 
    subCommodity varchar(255),
    year2008 numeric(20,3),
    year2009 numeric(20,3),
    year2010 numeric(20,3),
    year2011 numeric(20,3),
    year2012 numeric(20,3),
    year2013 numeric(20,3),
    year2014 numeric(20,3),
    year2015 numeric(20,3),
    year2016 numeric(20,3),
    year2017 numeric(20,3),
    year2018 numeric(20,3),
    eip varchar(255),
    mat varchar(255) 
);

COPY crmIEP FROM '/docker-entrypoint-initdb.d/crmIEP.csv' DELIMITER ';' CSV HEADER;
