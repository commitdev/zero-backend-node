---
title: Module Parameters
sidebar_label: Module Parameters
sidebar_position: 2
---

## Parameters

| Parameter | Label | Env-var(apply) | Default |
|--|---|---|---|
| useExistingAwsProfile | Use credentials from an existing AWS profile? | n/a | null | 
| profilePicker | n/a | n/a | null | 
| accessKeyId | AWS AccessKeyId | AWS_ACCESS_KEY_ID | null | 
| secretAccessKey | AWS SecretAccessKey | AWS_SECRET_ACCESS_KEY | null | 
| githubAccessToken | Github API Key to setup your repository and optionally CI/CD | GITHUB_ACCESS_TOKEN | null | 
| region | Select AWS Region | n/a | null | 
| productionHostRoot | Production Root Host Name (e.g. mydomain.com) - this must be the root of the chosen domain, not a subdomain. | n/a | null | 
| productionFrontendSubdomain | Production Frontend Host Name (e.g. app.) | n/a | app. | 
| productionBackendSubdomain | Production Backend Host Name (e.g. api.) | n/a | api. | 
| stagingHostRoot | Staging Root Host Name (e.g. mydomain-staging.com) - this must be the root of the chosen domain, not a subdomain. | n/a | null | 
| stagingFrontendSubdomain | Staging Frontend Host Name (e.g. app.) | n/a | app. | 
| stagingBackendSubdomain | Staging Backend Host Name (e.g. api.) | n/a | api. | 
| database | Database engine to use (postgres) | n/a | null | 
| accountId | AWS Account ID | n/a | null | 
| randomSeed | Random seed that will be shared between projects to come up with deterministic resource names | n/a | null | 
| databaseName | n/a | n/a | null | 
| fileUploads | Enable file uploads using S3 and Cloudfront signed URLs? (Will require manual creation of a Cloudfront keypair in AWS) | n/a | true | 
| userAuth | Enable user management using Kratos and authentication using the Oathkeeper access proxy? | n/a | true | 
| apiType | What type of API do you want to expose? | n/a | rest | 
| CIVendor | Using either circleCI or github Actions to build / test your repository | n/a | circleci | 
| circleciApiKey | Circle CI API Key to setup your CI/CD for repositories | CIRCLECI_API_KEY | null | 
| billingEnabled | Provides a subscription example using stripe in backend and frontend repository, this includes the checkout feature so you must have a verified(with bank account setup) Stripe account to use these features | n/a | null | 
| stagingStripePublicApiKey | Staging Stripe public api key, used for frontend repository (Recommended: using sandbox key while setting up) | n/a | null | 
| stagingStripeSecretApiKey | Staging Stripe secret api key, used for backend repository (Recommended: using sandbox key while setting up) | n/a | null | 
| productionStripePublicApiKey | Production Stripe public api key, used for frontend repository (Recommended: using sandbox key while setting up) | n/a | null | 
| productionStripeSecretApiKey | Production Stripe secret api key, used for backend repository (Recommended: using sandbox key while setting up) | n/a | null | 

:::info
Content generated by
```shell
## requires binary: `yq`
which yqq >/dev/null || echo "Please install yq"
cat <<EOF
| Parameter | Label | Env-var(apply) | Default |
|--|---|---|---|
EOF
cat zero-module.yml | yq -r '.parameters[] | "| " + .field + " | " + (.label//"n/a") + " | " +  (.envVarName //"n/a") + " | " +  ((.default)|tostring //"n/a") + " | "'
```
:::