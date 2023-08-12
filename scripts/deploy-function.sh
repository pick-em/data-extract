#!/bin/bash

gcloud functions deploy fetch-teams-gcf \
--gen2 \
--region=us-west1 \
--runtime=nodejs20 \
--entry-point=fetchTeams \
--trigger-topic=data-extract-fetch-teams-topic-gcf \
--set-env-vars JOB_ID=fetch-teams,GCP_PROJECT_ID=pickem-sports-dev,GCP_DATA_EXTRACT_BUCKET_NAME=pickem-data-extract-dev
