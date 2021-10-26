#!/bin/bash

# Create and commit .sam-params-<env> file as SAM deploy parameters
# The cert ARN and hostedZoneID are not sensitive but requires list all permissions in IAM
# therefore are created here instead of granting the CI user those permission to fetch on the fly
# and they should not change often

if [[ "$ENVIRONMENT" == "stage" ]]; then
  BACKEND_DOMAIN_PREFIX=$stagingBackendSubdomain
  DOMAIN=$stagingHostRoot
  FILE_NAME=".sam-params-stage"
elif [[ "$ENVIRONMENT" == "prod" ]]; then
  BACKEND_DOMAIN_PREFIX=$productionBackendSubdomain
  DOMAIN=$productionHostRoot
  FILE_NAME=".sam-params-prod"
fi

HOSTED_ZONE_ID=$(aws route53 list-hosted-zones  --query "HostedZones[?Name == '${DOMAIN}.'].Id | [0]" --output text | sed 's/\/hostedzone\///')
GATEWAY_CERTIFICATE_ARN=$(aws acm list-certificates --region ${REGION} --query "CertificateSummaryList[?DomainName=='${DOMAIN}'].CertificateArn | [0]" --output text)

## TODO: move to infra to create in SSM
