# specify base image that we want to extend
FROM python:3.9-slim

# app target location
ENV APP_DIR=/var/opt/gis

# requirements first to use build caching
COPY ./requirements.txt ${APP_DIR}/requirements.txt

RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

# install build-essentials
RUN apt-get update
RUN apt-get install -y build-essential

# install python dependencies
RUN pip3 install --upgrade pip
# installs every package listed in the requirements.txt file
RUN pip3 install -r requirements.txt

# environment variables
ENV FLASK_APP=server.py
ENV FLASK_DEBUG=1

# run flask server
CMD [ "python", "-m", "flask", "run", "--host=0.0.0.0" ]