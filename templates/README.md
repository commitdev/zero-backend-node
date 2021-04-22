#  <% .Name %> Backend service

# Getting started
You now have a repo to start writing your backend logic! The Go api comes with an endpoint returning the status of the app.

# Deployment
## Kubernetes
Your application is deployed on your EKS cluster through circleCI, you can see the pod status on kubernetes in your application namespace:
```
kubectl -n <% .Name %> get pods
```
### Configuring
You can update the resource limits in the [kubernetes/base/deployment.yml][base-deployment], and control fine-grain customizations based on environment and specific deployments such as Scaling out your production replicas from the [overlays configurations][env-prod]

### Dev Environment
This project is set up with a local/cloud hybrid dev environment. This means you can do fast local development of a single service, even if that service depends on other resources in your cluster. 
Make a change to your service, run it, and you can immediately see the new service in action in a real environment. You can also use any tools like your local IDE, debugger, etc. to test/debug/edit/run your service.

Usually when developing you would run the service locally with a local database and any other dependencies running either locally or in containers using `docker-compose`, `minikube`, etc. 
Now your service will have access to any dependencies within a namespace running in the EKS cluster, with access to resources there.
[Telepresence](https://telepresence.io) is used to provide this functionality. 

 Development workflow:
 
  1. Run `start-dev-env.sh` - You will be dropped into a shell that is the same as your local machine, but works as if it were running inside a pod in your k8s cluster
  2. Change code and run the server - As you run your local server, using local code, it will have access to remote dependencies, and will be sent traffic by the load balancer
  3. Test on your cloud environment with real dependencies - `https://<your name>-<% index .Params `stagingBackendSubdomain` %><% index .Params `stagingHostRoot` %>`
  4. git commit & auto-deploy to Staging through the build pipeline

<%if eq (index .Params `CIVendor`) "circleci" %>## Circle CI
## Circle CI
Your repository comes with a end-to-end CI/CD pipeline, which includes the following steps:
1. Checkout
2. Unit Tests
3. Build and Push Image
4. Deploy Staging
5. Integration Tests
6. Deploy Production


[See details on CircleCi][circleci-details]
<% else if eq (index .Params `CIVendor`) "github-actions" %>## Github actions
Your repository comes with a end-to-end CI/CD pipeline, which includes the following steps:
1. Checkout
2. Unit Tests
3. Build Image
4. Upload Image to ECR
4. Deploy image to Staging cluster
5. Integration tests
6. Deploy image to Production cluster

**Note**: you can add a approval step using Github Environments(Available for Public repos/Github pro), you can configure an environment in the Settings tab then simply add the follow to your ci manifest (`./github/workflows/ci.yml`)
```yml
deploy-production: # or any step you would like to require Explicit approval
  enviroments:
    name: <env-name>
```
### Branch Protection
Your repository comes with a protected branch `master` and you can edit Branch protection in **Branches** tab of Github settings. This ensures code passes tests before getting merged into your default branch.
By default it requires `[lint, unit-test]` to be passing to allow Pull requests to merge.
<% end %>

## Database credentials
Your application is assumed[(ref)][base-deployment-secret] to rely on a database(RDS), In your Kubernetes
application namespace, an application specific user has been created for you and hooked up to the application already.

## Cron Jobs
An example cron job is specified in [kubernetes/base/cronjob.yml][base-cronjob].
The default configuration specifies `suspend: true` to ensure this cronjob does not run unless you want to enable it.
When you are ready for your cron job to run, make sure to set `suspend: false`.

The default cron job specifies three parameters that you will need to change depending on your application's needs:

### Schedule
See a detailed specification of the [cron schedule format](https://en.wikipedia.org/wiki/Cron#Overview).
This will need to be modified to fit the constraints of your application.

### Image
The default image specified is a barebones busybox base image.
You likely want to run processes dependent on your backend codebase; so the image will likely be the same as for your backend application.

### Args
As per the image attribute noted above, you will likely be running custom arguments in the context of that image.
You should specify those arguments [as per the documentation](https://kubernetes.io/docs/tasks/inject-data-application/define-command-argument-container/).

## Database Migration
Database migrations are handled with [Flyway](https://flywaydb.org/). Migrations run in a docker container started in the Kubernetes cluster by CircleCI or the local dev environment startup process.

The migration job is defined in `kubernetes/migration/job.yml` and your SQL scripts should be in `database/migration/`.
Migrations will be automatically run against your dev environment when running `./start-dev-env.sh`. After merging the migration it will be run against other environments automatically as part of the pipeline.

The SQL scripts need to follow Flyway naming convention [here](https://flywaydb.org/documentation/concepts/migrations.html#sql-based-migrations), which allow you to create different types of migrations:
* Versioned - These have a numerically incrementing version id and will be kept track of by Flyway. Only versions that have not yet been applied will be run during the migration process.
* Undo - These have a matching version to a versioned migration and can be used to undo the effects of a migration if you need to roll back.
* Repeatable - These will be run whenever their content changes. This can be useful for seeding data or updating views or functions.

Here are some example migrations:

`V1__create_tables.sql`
```sql
CREATE TABLE address (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    person_id INT(6),
    street_number INT(10),
    street_name VARCHAR(50),
    reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

`V2__add_columns.sql`
```sql
ALTER TABLE address
 ADD COLUMN city VARCHAR(30) AFTER street_name,
 ADD COLUMN province VARCHAR(30) AFTER city
```
<%if eq (index .Params `billingEnabled`) "yes" %>
## Billing example
A subscription and checkout example using [Stripe](https://stripe.com), coupled with the frontend repository to provide an end-to-end checkout example for you to customize. We also setup a webhook and an endpoint in the backend to receive webhook when events occur.

### Setup
We have setup for you in the stripe platform
- 1 product
- 3 prices(subscriptions) [annual, monthly, daily]
- 1 webhook [`charge.failed`, `charge.succeeded`, `customer.created`, `subscription_schedule.created`] 
See link for available webhooks: https://stripe.com/docs/api/webhook_endpoints/create?lang=curl#create_webhook_endpoint-enabled_events

this is setup using the script [scripts/stripe-example-setup.sh](scripts/stripe-example-setup.sh)

### Deployment
The deployment only requires the environment variables 
- STRIPE_API_SECRET_KEY (created in AWS secret then deployed via Kubernetes Secret)
- FRONTEND_URL (used for sending user back to frontend upon checkouts)
- BACKEND_URL (used for redirects after checkout and webhooks)

<% end %>
<!-- Links -->
[base-cronjob]: ./kubernetes/base/cronjob.yml
[base-deployment]: ./kubernetes/base/deployment.yml
[base-deployment-secret]: ./kubernetes/base/deployment.yml#L49-58
[env-prod]: ./kubernetes/overlays/production/deployment.yml
[circleci-details]: ./.circleci/README.md
