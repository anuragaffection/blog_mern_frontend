# Frontend Deployment Flow (MERN → AWS ECS)

## 1. Pre-checks

1. Make sure `.gitignore` is proper — e.g. `.env` and all sensitive files are properly ignored.
2. Locally run both `frontend` & `backend` using `yarn` or `npm`.
3. Dockerize both `frontend` & `backend` & run locally.

## 2. Docker Commands

### Build the image

```bash
docker build -t <my-app-name:version-name> .
```

Examples:

```bash
docker build -t blog-frontend:latest .
docker build -t blog-backend:latest .
```

### Run the backend container

> **Note:** We have ignored `.env` in the docker container image for the backend, so pass `.env` at run time.

```bash
docker run -d --name blog-backend -p 3000:3000 --env-file .env blog-backend:latest
docker run -it --name blog-backend -p 3000:3000 --env-file .env blog-backend:latest
```

### Run the frontend container

> Pass the backend URL / env at **build time**. In a Vite/React application, environment variables are compiled and baked into the static files at build time (`docker build`), not at runtime (`docker run`).

```bash
docker run -d --name blog-frontend -p 80:80 blog-frontend:latest
docker run -it --name blog-frontend -p 80:80 blog-frontend:latest
```

### Stop & delete a container

```bash
docker stop blog-backend
docker rm blog-backend
```

> **Note:** If the backend expects the frontend URL, pass it accordingly in the env.

## 3. GitHub Action — Checkout Repo

Check out the repo & verify in GitHub.

```yaml
name: Deploy Backend to Production ECS

on:
  push:
    branches:
      - master

  workflow_dispatch:
    inputs:
      image_tag:
        description: Image tag used to deploy
        required: true
        default: latest

permissions:
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout the repository
        uses: actions/checkout@v3
```

## 4. Create ECR in AWS

- Go to `ECR`.
- Check the selected region in the top-right corner.
  - `AWS_REGION: ap-south-1`
  - `ECR_REPOSITORY: blog-mern-frontend`
- Image Tag — keep it default.
- Encryption — keep it default.
- Image Scanning setting — keep it default.

## 5. Create OIDC Identity Provider

Create a permission in AWS with OIDC that has access to push to ECR.

- Go to `IAM`.
- Go to `IAM -> Identity Providers`.
- Add the identity provider:
  - **Provider URL:** `https://token.actions.githubusercontent.com`
  - **Audience:** `sts.amazonaws.com`
  - **Tags (optional):** `oidc_github_aws`

> **Note:** No need to worry about assigning a role here — we attach the identity provider when creating the role in the next step.

## 6. Create a Role for OIDC

- Go to `IAM`.
- Go to `IAM -> Roles -> Create role`.
- **Entity type:** `Web Identity`
- **Provider:** `token.actions.githubusercontent.com` (already created in the step above)
- **Audience:** `sts.amazonaws.com`
- **GitHub organization:** `anuragaffection`
- **Add permissions:** `AmazonEC2ContainerRegistryPowerUser`
- **Role name:** `github-actions-deploy-role`
- **Description:** `Github Actions To ECR Deploy Role`
- Take the ARN of the role:
  - `arn:aws:iam::129494056630:role/github-actions-deploy-role`

> **Note:** `AmazonEC2ContainerRegistryPowerUser` has the following access:
> - ✅ Login to ECR
> - ✅ Push images
> - ✅ Pull images

## 7. GitHub Action — Build & Push Image to ECR

```yaml
name: Deploy Frontend to Production ECS

on:
  push:
    branches:
      - master

  workflow_dispatch:
    inputs:
      image_tag:
        description: Image tag used to deploy
        required: true
        default: latest

env:
  AWS_REGION: ap-south-1
  ECR_REPOSITORY: blog-mern-frontend
  AWS_DEPLOY_ROLE_ARN: arn:aws:iam::129494056630:role/github-actions-deploy-role

permissions:
  contents: read
  id-token: write # required for requesting the OIDC JWT to authenticate with AWS

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout the repository
        uses: actions/checkout@v3

      - name: Configure AWS credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ env.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, tag, and push image to Amazon ECR
        env:
          REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          # On manual runs use the provided tag, otherwise use the commit SHA
          IMAGE_TAG: ${{ github.event.inputs.image_tag || github.sha }}
        run: |
          docker build \
            -t "$REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" \
            -t "$REGISTRY/$ECR_REPOSITORY:latest" \
            .
          docker push "$REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"
          docker push "$REGISTRY/$ECR_REPOSITORY:latest"
          echo "Pushed $REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"
```

## 8. Verify the Image in ECR

- Go to `ECR`.
- You should see the image tags `latest` & the GitHub commit SHA.

**Optimizations:**

- We can shorten the GitHub commit SHA to the first seven characters.
- **Security:** Move the deploy role ARN to GitHub Secrets.

> **Note:** Since the build happens in GitHub Actions, there is no `.env` in the GitHub code, so the image will have no backend URL baked in.

## 9. Commit Frontend Env to Git

- Make sure `.dockerignore` does **not** ignore the env file.
- Because this is a Vite SPA served as static files by Nginx, the URL must be baked in at `npm run build` time. There is no runtime env in Nginx — by the time the container runs, the JS bundles already exist with the value hardcoded inside them. So runtime injection isn't an option without extra machinery.
- Also note: this URL is **not a secret**. It's visible to anyone in their browser's network tab. So there's no security reason to hide it — the only question is how to feed it into the build.

## 10. Set Up ECS

- Go to `ECS -> Create cluster`.
- **Name:** `blog-master`
- **Infrastructure:** `Fargate`

## 11. Create Task Definition for Frontend

- **Task Definition family name:** `blog-frontend-td`

### Infrastructure requirements

- **Launch Type:** `Fargate`
- **Task Size:** CPU `0.5 vCPU`, Memory `1 GB`
- **Task Role:** `-` (leave empty)
- **Task Execution role:** `Create default role` (let AWS create it by default)

### Container 1

- **Name:** `blog-frontend`
- **Image URI by digest:** `129494056630.dkr.ecr.ap-south-1.amazonaws.com/blog-mern-frontend@sha256:eca48ba075ecd891da3d70aa7889954d54e1efa64a85c4e862f009b924426639`
- **Image URI by image tag:** `129494056630.dkr.ecr.ap-south-1.amazonaws.com/blog-mern-frontend:dc18175cd4fa5d4f3f96e11cb28a807edc8f3d7a`
- **Container port:** `80` (same as what we expose in the Dockerfile)
- **Protocol:** `TCP`
- **Port name:** `blog-frontend-http`
- **App protocol:** `http`

### Resource Allocation

- **CPU:** `0.5 vCPU`
- **Memory:** `1 GB`

### Rest

- Keep it optional for now.

## 12. Task Definition JSON

This is our task definition JSON. After the first create, we can revise it as well.

```json
{
    "taskDefinitionArn": "arn:aws:ecs:ap-south-1:129494056630:task-definition/blog-frontend-td:1",
    "containerDefinitions": [
        {
            "name": "blog-frontend",
            "image": "129494056630.dkr.ecr.ap-south-1.amazonaws.com/blog-mern-frontend:dc18175cd4fa5d4f3f96e11cb28a807edc8f3d7a",
            "cpu": 512,
            "memory": 1024,
            "portMappings": [
                {
                    "containerPort": 80,
                    "hostPort": 80,
                    "protocol": "tcp",
                    "name": "blog-frontend-http",
                    "appProtocol": "http"
                }
            ],
            "essential": true,
            "environment": [],
            "environmentFiles": [],
            "mountPoints": [],
            "volumesFrom": [],
            "ulimits": [],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/blog-frontend-td",
                    "awslogs-create-group": "true",
                    "awslogs-region": "ap-south-1",
                    "awslogs-stream-prefix": "ecs"
                },
                "secretOptions": []
            },
            "systemControls": []
        }
    ],
    "family": "blog-frontend-td",
    "executionRoleArn": "arn:aws:iam::129494056630:role/ecsTaskExecutionRole",
    "networkMode": "awsvpc",
    "revision": 1,
    "volumes": [],
    "status": "ACTIVE",
    "requiresAttributes": [
        {
            "name": "com.amazonaws.ecs.capability.logging-driver.awslogs"
        },
        {
            "name": "ecs.capability.execution-role-awslogs"
        },
        {
            "name": "com.amazonaws.ecs.capability.ecr-auth"
        },
        {
            "name": "com.amazonaws.ecs.capability.docker-remote-api.1.19"
        },
        {
            "name": "ecs.capability.execution-role-ecr-pull"
        },
        {
            "name": "com.amazonaws.ecs.capability.docker-remote-api.1.18"
        },
        {
            "name": "ecs.capability.task-eni"
        },
        {
            "name": "com.amazonaws.ecs.capability.docker-remote-api.1.29"
        }
    ],
    "placementConstraints": [],
    "compatibilities": [
        "EC2",
        "MANAGED_INSTANCES",
        "FARGATE"
    ],
    "runtimePlatform": {
        "cpuArchitecture": "X86_64",
        "operatingSystemFamily": "LINUX"
    },
    "requiresCompatibilities": [
        "FARGATE"
    ],
    "cpu": "512",
    "memory": "1024",
    "registeredAt": "2026-06-09T10:28:56.547Z",
    "registeredBy": "arn:aws:iam::129494056630:root",
    "enableFaultInjection": false,
    "tags": []
}
```

## 13. Create Target Group

| Setting                | Value                          |
| ---------------------- | ------------------------------ |
| Target Type            | IP addresses                   |
| Target Group Name      | `blog-frontend-tg`             |
| Protocol               | HTTP                           |
| Port                   | 80                             |
| IP Address Type        | IPv4                           |
| VPC                    | `vpc-0dff14cfe53eb4a19` (default) |
| Protocol Version       | HTTP1                          |
| Health Check Protocol  | HTTP                           |
| Health Check Path      | `/`                            |

> Your Nginx serves the React app at `/`, so this is perfect.

### Advanced Health Check Settings

After clicking next (or expanding advanced), use:

| Setting             | Value |
| ------------------- | ----- |
| Healthy threshold   | 2     |
| Unhealthy threshold | 3     |
| Timeout             | 5     |
| Interval            | 30    |
| Success codes       | 200   |

**Target Optimizer:** default.

### Register Targets

- Targets registered — as we are just creating the target group for now, we have not attached it to any service or load balancer.
- Remove the attached IP — `172.31.0...`
- **Registered Targets:** 0

## 14. Create Load Balancer

- Go to `EC2 -> Load Balancers`.
- Go to `Application Load Balancer`.

| Setting           | Value                       |
| ----------------- | --------------------------- |
| ALB               | `blog-frontend-alb`         |
| Scheme            | internet-facing             |
| IP Address Type   | IPv4                        |
| Availability      | all subnets                 |
| Security group    | `blog-frontend-sg-alb`      |
| HTTP              | `80`                        |
| Target group      | `blog-frontend-tg` (created above) |

### Security Group (creation)

- **Group name:** `blog-frontend-sg-alb`
- **Description:** Allow HTTP traffic to Application Load Balancer

**Inbound Rules**

| Type  | Protocol | Port | Source                    | Description       |
| ----- | -------- | ---- | ------------------------- | ----------------- |
| HTTP  | TCP      | 80   | Anywhere IPv4 (0.0.0.0/0) | Public web traffic |

If you plan to add HTTPS later:

| Type  | Protocol | Port | Source    |
| ----- | -------- | ---- | --------- |
| HTTPS | TCP      | 443  | 0.0.0.0/0 |

> You can add HTTPS later when ACM certificates are configured.

## 15. Create a Service

Before creating the service, you must have these created:

1. ECS Cluster — ✅ done
2. Task Definition — ✅ done
3. Target Group — ✅ done
4. ALB — ✅ done
5. ECS Service — (this step)

### Name

- **Task definition family:** `blog-frontend-td` (created above, our first task definition)
- **Task definition revision:** `1 (latest)`
- **Service name:** `blog-frontend-service`

### Compute Configuration

- **Compute options:** `Launch type`

### Deployment Configurations

- **Strategy:** `Replica`
- **Desired tasks:** `1`
- deployment strategy : rolling update
- min running tasks in percent : 100
- max running tasks in percent : 200


### Networking

- **VPC:** `default`
- **Subnets:** `default`
- public ip - no need (currently turn on)
- each task get the new apis 
- 
- 

### Security Group

- **Security group name:** `blog-frontend-sg-ecs`
- **Security group description:** `Security Group For Frontend ECS`

| Setting   | Value                  |
| --------- | ---------------------- |
| Type      | HTTP                   |
| Port      | 80                     |
| Source    | `blog-frontend-sg-alb` |
| Public IP | ON                     |

### Load Balancing

- Use an existing load balancer (created above).
- Use an existing listener.

### Service Auto Scaling 
- desired number of task - 1
- minimum number of task - 0
- maximum number of task - 1
- set the scaling polices

### scaling polices
- For 90% of applications, including your MERN blog, SaaS, Shopify app backend, etc., use Target Tracking.
- After adding a task, ECS waits before adding another. : scale out cooldown 
- After removing a task, ECS waits before removing another.

Min Tasks: 1 
Desired Tasks: 1
Max Tasks: 5

Policy Type:
Target Tracking

Metric:
ECSServiceAverageCPUUtilization

Target Value:
60

Scale-Out Cooldown:
60 seconds

Scale-In Cooldown:
300 seconds


#### Note
- desired = current number of task running 
- minimum = aws will never go belwo this
- maximum = aws will never go above this

## ✅ AWS Configuration Complete

- Everything is attached.
- Verify the working: open your site from the Application Load Balancer DNS and check whether it is working.

## Extending the permission a Role for OIDC
- check the points 5 & 6
- currently we just for have permission for ECR
- now, we will add the permission for ECS & Task Definitions
- go the `IAM -> Roles -> github-actions-deploy-role` 
- `AmazonECS_FullAccess` - attach this permissions
- 


## 16. Our Deployment Yaml Code
```yaml
name: Deploy Frontend to Production ECS

on:
  push:
    branches:
      - master

  workflow_dispatch:
    inputs:
      image_tag:
        description: Image tag used to deploy
        required: true
        default: latest

env:
  AWS_REGION: ap-south-1
  ECR_REPOSITORY: blog-mern-frontend
  AWS_DEPLOY_ROLE_ARN: arn:aws:iam::129494056630:role/github-actions-deploy-role
  ECS_CLUSTER: blog-master
  ECS_SERVICE: blog-frontend-service
  ECS_TASK_FAMILY: blog-frontend-td
  CONTAINER_NAME: blog-frontend

permissions:
  contents: read
  id-token: write # required for requesting the OIDC JWT to authenticate with AWS

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout the repository
        uses: actions/checkout@v3

      - name: Configure AWS credentials via OIDC
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ env.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build, tag, and push image to Amazon ECR
        id: build-image
        env:
          REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          # On manual runs use the provided tag, otherwise use the short commit SHA (first 7 chars)
          IMAGE_TAG: ${{ github.event.inputs.image_tag || github.sha }}
        run: |
          IMAGE_TAG="${IMAGE_TAG:0:7}"
          docker build \
            -t "$REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" \
            -t "$REGISTRY/$ECR_REPOSITORY:latest" \
            .
          docker push "$REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"
          docker push "$REGISTRY/$ECR_REPOSITORY:latest"
          echo "Pushed $REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG"
          # Expose the full image reference for the ECS deploy steps below
          echo "image=$REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> "$GITHUB_OUTPUT"

      - name: Download current ECS task definition
        run: |
          aws ecs describe-task-definition \
            --task-definition "$ECS_TASK_FAMILY" \
            --query taskDefinition \
            --output json > task-definition.json

      - name: Render new image into the task definition
        id: render-task-def
        uses: aws-actions/amazon-ecs-render-task-definition@v1
        with:
          task-definition: task-definition.json
          container-name: ${{ env.CONTAINER_NAME }}
          image: ${{ steps.build-image.outputs.image }}

      - name: Deploy to Amazon ECS service
        uses: aws-actions/amazon-ecs-deploy-task-definition@v2
        with:
          task-definition: ${{ steps.render-task-def.outputs.task-definition }}
          service: ${{ env.ECS_SERVICE }}
          cluster: ${{ env.ECS_CLUSTER }}
          wait-for-service-stability: true
```

## 17. Verify the Deployment

- Our deployment is working fine.
- Verify the DNS.
- Go to `ALB -> DNS name`.
- `blog-frontend-alb-2074191274.ap-south-1.elb.amazonaws.com`
- Access the DNS in your browser to confirm the site loads.

## 18. SSL the Frontend URL

High-level steps:

1. Get the certificate.
2. Attach it to the ALB.

### Getting the Certificate

- Go to `AWS Certificate Manager (ACM)`.
- Request a public certificate with these domains:
  - `articleapp.<myCompany>.in`
  - `www.articleapp.<myCompany>.in`
- **Export:** disabled
- **Validation method:** DNS
- **Key algorithm:** `RSA 2048`

### Verify the DNS (validate the certificate)

- ACM gives you a CNAME name & value.
- Put that CNAME record in your domain manager (Cloudflare).
- Wait a few minutes for the certificate status to become `Issued`.

### After the Certificate Becomes "Issued"

#### 1. Add HTTPS Listener

- Go to `ALB / Load Balancers -> Listeners -> Add Listener`.

| Setting     | Value                                |
| ----------- | ------------------------------------ |
| Protocol    | HTTPS                                |
| Port        | 443                                  |
| Certificate | `articleapp.<companyname>.in`        |
| Action      | Forward to `blog-frontend-tg`        |
| Rest        | default                              |

> **Note:** Till here, our HTTPS (ALB) is redirecting to `blog-frontend-tg`.

#### 2. Redirect HTTP → HTTPS

Now our HTTP should permanently redirect to HTTPS.

- Edit the existing `HTTP : 80` listener.
- Change the action from **Forward to Target Group** to **Redirect to URL**.

| Setting     | Value                  |
| ----------- | ---------------------- |
| Protocol    | HTTPS                  |
| Port        | 443                    |
| Status Code | 301 (permanently moved)|

#### 3. Modify the ALB Security Group

- We have a security group on our ALB that we also have to modify.
- If we remember, when we created the security group for the ALB, we allowed just port 80.
- Now add HTTPS too.

| Type  | Protocol | Port | Source    |
| ----- | -------- | ---- | --------- |
| HTTP  | TCP      | 80   | 0.0.0.0/0 |
| HTTPS | TCP      | 443  | 0.0.0.0/0 |

#### 4. Final Cloudflare DNS Record

After the listener is added, create the CNAME record:

| Setting | Value                                                  |
| ------- | ------------------------------------------------------ |
| Type    | CNAME                                                  |
| Name    | `articleapp`                                           |
| Target  | `blog-frontend-alb-2074191274.ap-south-1.elb.amazonaws.com` |
| Proxy   | Proxied (orange cloud)                                 |

Also add the `www` record:

| Type  | Name                                    | Target                      |
| ----- | --------------------------------------- | --------------------------- |
| CNAME | [www.articleapp](http://www.articleapp) | `articleapp.<companyname>.in` |

Then:

```
https://articleapp.<companyname>.in
```

will work through **Cloudflare → ALB → ECS**. Wait a few minutes for the DNS to propagate.

## 19. Cost Optimization

- Currently our ALB, ECS service, and public VPC IP address are costing money.

| Resource             | Action                                                          |
| -------------------- | --------------------------------------------------------------- |
| ALB                  | Delete it & recreate when needed — take a screenshot first.     |
| ECS Service          | Set the service's desired tasks to `0`.                         |
| Public VPC IP        | Attached to ECS, so leave it — no calls to the VPC, so no cost. |