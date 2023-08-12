#!/bin/bash

gcloud functions deploy fetch-teams-gcf \
--gen2 \
--region=us-west1 \
--runtime=nodejs20 \
--entry-point=fetchTeams \
--source=$HOME/Code/personal/pick-em/data-extract \
--trigger-topic=data-extract-fetch-teams-topic-gcf \
--set-env-vars JOB_ID=fetch-teams \
--set-env-vars GCP_PROJECT_ID=pickem-sports-dev \
--set-env-vars GCP_DATA_EXTRACT_BUCKET_NAME=pickem-data-extract-dev \
--no-allow-unauthenticated \
--ingress-settings=internal-only \
--memory=128Mi \
--run-service-account=pickem-dev-gcf-service-account@pickem-sports-dev.iam.gserviceaccount.com \
--timeout=300 \
--min-instances=0 \
--max-instances=1
