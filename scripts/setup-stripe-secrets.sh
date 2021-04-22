#!/bin/bash

if [[ "$ENVIRONMENT" == "" ]]; then
  echo "Must specify \$ENVIRONMENT to create stripe secret ">&2; exit 1;
elif [[ "$ENVIRONMENT" == "stage" ]]; then
PUBLISHABLE_API_KEY=$stagingStripePublicApiKey
SECRET_API_KEY=$stagingStripeSecretApiKey
elif [[ "$ENVIRONMENT" == "prod" ]]; then
PUBLISHABLE_API_KEY=$productionStripePublicApiKey
SECRET_API_KEY=$productionStripeSecretApiKey
fi

CLUSTER_NAME=${PROJECT_NAME}-${ENVIRONMENT}-${REGION}
STRIPE_SECRET_NAME=${PROJECT_NAME}-${ENVIRONMENT}-stripe-${RANDOM_SEED}
NAMESPACE=${PROJECT_NAME}

API_KEY_JSON=$(printf '{"public_key":"%s","secret_key":"%s"}' "$PUBLISHABLE_API_KEY" "$SECRET_API_KEY");

aws secretsmanager list-secrets --region $REGION --query "SecretList[?Tags[?Key=='stripe' && Value=='${PROJECT_NAME}-${ENVIRONMENT}']].[Name] | [0][0]"  \
  || aws secretsmanager create-secret \
  --region ${REGION} \
  --name ${STRIPE_SECRET_NAME} \
  --description "Stripe API Key" \
  --tags "[{\"Key\":\"stripe\",\"Value\":\"${PROJECT_NAME}-${ENVIRONMENT}\"}]" \
  --secret-string "${API_KEY_JSON}"


BASE64_TOKEN=$(printf ${SECRET_API_KEY} | base64)
## Modify existing application secret to have stripe api key
kubectl --context $CLUSTER_NAME -n $NAMESPACE get secret ${PROJECT_NAME} -o json | \
  jq --arg STRIPE_API_SECRET_KEY $BASE64_TOKEN '.data["STRIPE_API_SECRET_KEY"]=$STRIPE_API_SECRET_KEY' \
  | kubectl apply -f -

sh ${PROJECT_DIR}/scripts/stripe-example-setup.sh
