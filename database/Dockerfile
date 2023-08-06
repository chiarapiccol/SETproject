# specify base image that we want to extend
FROM kartoza/postgis:14-3.3

# set environment variables that we want to change
ENV POSTGRES_DB="gis_db"
ENV POSTGRES_USER="gis_user"
ENV POSTGRES_PASS="gis_pass"

# install required packages
RUN apt-get update
RUN apt-get install -y osm2pgsql wget

#destatis and bka tables
COPY allMatForAllTech_nachTech.csv /docker-entrypoint-initdb.d/allMatForAllTech_nachTech.csv
COPY chromium.csv /docker-entrypoint-initdb.d/chromium.csv
COPY cobalt.csv /docker-entrypoint-initdb.d/cobalt.csv
COPY copper.csv /docker-entrypoint-initdb.d/copper.csv
COPY countryTechEnergy.csv /docker-entrypoint-initdb.d/countryTechEnergy.csv
COPY countryTechEnergy_groups.csv /docker-entrypoint-initdb.d/countryTechEnergy_groups.csv
COPY graphite.csv /docker-entrypoint-initdb.d/graphite.csv
COPY lithium.csv /docker-entrypoint-initdb.d/lithium.csv
COPY manganese.csv /docker-entrypoint-initdb.d/manganese.csv
COPY molybdenum.csv /docker-entrypoint-initdb.d/molybdenum.csv
COPY nickel.csv /docker-entrypoint-initdb.d/nickel.csv
COPY platinum.csv /docker-entrypoint-initdb.d/platinum.csv
COPY priceCRMdollar.csv /docker-entrypoint-initdb.d/priceCRMdollar.csv
COPY priceImportAllRawMatEuro.csv /docker-entrypoint-initdb.d/priceImportAllRawMatEuro.csv
COPY ree.csv /docker-entrypoint-initdb.d/ree.csv
COPY silver.csv /docker-entrypoint-initdb.d/silver.csv
COPY zinc.csv /docker-entrypoint-initdb.d/zinc.csv
COPY crmIEP.csv /docker-entrypoint-initdb.d/crmIEP.csv
COPY load_csv.sql /docker-entrypoint-initdb.d/test.sql

