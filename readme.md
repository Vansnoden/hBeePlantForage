### Honey Bee Forage Plants Dashboard

#### Overview

This code is for an analysis platform for mapping the distribution of honey bee forage plant species in Africa and beyond. 
The technology stack that was use is composed of the following key technologies:

- FastAPI + Alembic + Postgres + Geoserver for the backend (code in the **backend** folder).
- NextJs + D3js + OpenLayers for the frontend (code in the **frontend** folder). Pnpm was preferred as package manager.
- R for some data processing and statistical analysis.
- Docker + Docker compose for containerization.

In addtition, we have included the codes that were used for processing in the form of notebooks in the **data_processing** folder. This include the codes used for merging data from various public databases (<a href="https://www.gbif.org/" target="_blank">GBIF</a>, <a href="https://www.inaturalist.org/" target="_blank">iNaturalist</a>,...); or codes for performing some statistical analytics on the merged data.


#### Deployment

This section include just the deployment steps of the containerize platform. For the data_processing code, they are stand alone codes that can be ran at any time on you local machine assuming you have Python or R (R-studio) installed on your computer.

##### Local development
* Navigate to the **backend folder** and create a python virtual environment: ```python -m venv venv```.
* Install all the necessary dependencies: ```pip install -r requirements.txt```
* Run the migrations to create the database: ```alembic upgrade head```
* Launch the backend system with the following command: ```uvicorn main:app --reload```. 
* Navigate to the **frontend folder**, install the necessary libraries: ```pnpm install```
* Launch the frontend application: ```pnpm run dev```



##### Production
The application has been entirely containerized using Docker and Docker Compose. In this way with a single file **docker-compose.yml** in the backend folder you can deploy the whole system usign the following command: ```docker compose -up -d```.
