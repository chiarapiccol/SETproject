# GIS Project Template

This repository serves as a starting point for the GIS application you are developing in the scope of the GIS tutorials.
It is a modular dockerized setup consisting of a [PostGIS](https://postgis.net/) database, a python [flask](https://flask.palletsprojects.com/en/2.2.x/) backend and an [Angular](https://angular.io/) frontend service.


## Forking

To be able to make changes to this code, you first need to create your own, private duplicate of this repository.
This can be achieved by *forking*. You can create your own fork by pressing the **Fork** button in the top right.

For more information, check out the [documentation](https://docs.gitlab.com/ee/user/project/repository/forking_workflow.html).

## Run

To start the application, simply type `docker-compose up --build` on the console within your project's folder with [Docker](https://docs.docker.com/get-docker/) installed on your machine.

For Windows users, we encourage the usage of the [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install).

The frontend of the application will be available on [localhost:4200](http://localhost:4200/).
