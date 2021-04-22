#!/bin/bash
set -e

PROJECT_NAME=<% .Name %>
RANDOM_SEED=<% index .Params `randomSeed` %>
REGION=<% index .Params `region` %>

echo "Running on ${ENVIRONMENT}"
if [[ "$ENVIRONMENT" == "" ]]; then
  exit 1;
elif [[ "$ENVIRONMENT" == "stage" ]]; then
BACKEND_API_WEBHOOK_ENDPOINT="https://<% index .Params `stagingBackendSubdomain` %><% index .Params `stagingHostRoot` %>/webhook/stripe"
elif [[ "$ENVIRONMENT" == "prod" ]]; then
BACKEND_API_WEBHOOK_ENDPOINT="https://<% index .Params `productionBackendSubdomain` %><% index .Params `productionHostRoot` %>/webhook/stripe"
fi

STRIPE_SECRET_NAME=${PROJECT_NAME}-${ENVIRONMENT}-stripe-${RANDOM_SEED}
STRIPE_API_KEY=$(aws secretsmanager get-secret-value --region ${REGION} \
  --secret-id=$STRIPE_SECRET_NAME | \
  jq -r '.SecretString' | jq -r ".secret_key")

# STRIPE_API_KEY="sk_test_51IfTRKFzzFzHAJpZr8sIN9GXizOeBJqT7bwOscPJVYjoBuJuolnUpfdC26GkkZ8gZ0FOEgUGrjFYcT7xhB9VUK8c00Wt6PyWnx"
TOKEN=$(echo $STRIPE_API_KEY | base64)
AUTH_HEADER="Authorization: Basic ${TOKEN}"

## Create Product
PRODUCT_ID=$(curl -XPOST \
  --url https://api.stripe.com/v1/products \
  --header "${AUTH_HEADER}" \
  -d "name"="$PROJECT_NAME" | jq -r ".id")

curl https://api.stripe.com/v1/prices \
  --header "${AUTH_HEADER}" \
  -d "product"="$PRODUCT_ID" \
  -d "unit_amount"=5499 \
  -d "currency"="CAD" \
  -d "recurring[interval]=month" \
  -d "nickname"="Monthly Plan"

curl https://api.stripe.com/v1/prices \
  --header "${AUTH_HEADER}" \
  -d "product"="$PRODUCT_ID" \
  -d "unit_amount"=299 \
  -d "currency"="CAD" \
  -d "recurring[interval]=day" \
  -d "nickname"="Daily Plan"

  curl https://api.stripe.com/v1/prices \
  --header "${AUTH_HEADER}" \
  -d "product"="$PRODUCT_ID" \
  -d "unit_amount"=50000 \
  -d "currency"="CAD" \
  -d "recurring[interval]=year" \
  -d "nickname"="Annual Plan"

# Create webhook on stripe platform
# See link for available webhooks: https://stripe.com/docs/api/webhook_endpoints/create?lang=curl#create_webhook_endpoint-enabled_events
curl https://api.stripe.com/v1/webhook_endpoints \
  --header "${AUTH_HEADER}" \
  -d url="${BACKEND_API_WEBHOOK_ENDPOINT}" \
  -d "enabled_events[]"="charge.failed" \
  -d "enabled_events[]"="charge.succeeded" \
  -d "enabled_events[]"="customer.created"  \
  -d "enabled_events[]"="subscription_schedule.created"
