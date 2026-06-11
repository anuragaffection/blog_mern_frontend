# Frontend Deployment — ASCII Flow Graph

This document shows how every part of our deployment is connected, end to end:
GitHub → GitHub Actions (OIDC) → ECR → ECS (Fargate) → ALB → Cloudflare → User.

---

## 1. High-Level Flow (Bird's Eye)

```
   ┌──────────┐      ┌──────────────────┐      ┌──────────┐      ┌──────────────┐
   │ Developer│ push │  GitHub Repo     │ CI   │  GitHub  │ OIDC │     AWS      │
   │  git push├─────►│  (branch: master)├─────►│  Actions ├─────►│  (ap-south-1)│
   └──────────┘      └──────────────────┘      └────┬─────┘      └──────┬───────┘
                                                    │                   │
                                                    │ build + push      │ deploy
                                                    ▼                   ▼
                                              ┌──────────┐        ┌──────────┐
                                              │   ECR    │◄───────│   ECS    │
                                              │ (image)  │  pull  │ (Fargate)│
                                              └──────────┘        └──────────┘
```

---

## 2. CI/CD Pipeline (GitHub Actions Detail)

```
 TRIGGER
 ┌─────────────────────────────────────────────────────────┐
 │  on:                                                     │
 │   • push -> branch: master        (automatic)           │
 │   • workflow_dispatch (image_tag) (manual button)       │
 └───────────────────────────┬─────────────────────────────┘
                             │
                             ▼
 ┌─────────────────────────────────────────────────────────┐
 │  job: deploy   (runs-on: ubuntu-latest)                  │
 │  permissions: id-token: write  (needed for OIDC)         │
 └───────────────────────────┬─────────────────────────────┘
                             │
        ┌────────────────────┼─────────────────────────────────────┐
        ▼                    ▼                                      ▼
 ┌─────────────┐   ┌────────────────────┐                ┌────────────────────┐
 │ Step 1      │   │ Step 2             │                │ Step 3             │
 │ Checkout    │──►│ Configure AWS      │── assume ─────►│ Login to ECR       │
 │ repo        │   │ creds via OIDC     │   role         │ (docker auth)      │
 └─────────────┘   └────────────────────┘                └─────────┬──────────┘
                            │                                       │
                            │ (role-to-assume:                      ▼
                            │  github-actions-deploy-role)  ┌────────────────────┐
                            ▼                               │ Step 4             │
                   ┌────────────────────┐                  │ Build, tag, push   │
                   │ AWS IAM Role       │                  │ image to ECR       │
                   │ trusts GitHub OIDC │                  │  :SHA  + :latest   │
                   │ provider           │                  └─────────┬──────────┘
                   └────────────────────┘                            │
                                                                     ▼
                   ┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐
                   │ Step 7             │◄──│ Step 6             │◄──│ Step 5             │
                   │ Deploy to ECS      │   │ Render new image   │   │ Download current   │
                   │ service            │   │ into task def      │   │ ECS task def JSON  │
                   │ (wait stability)   │   │ (swap image URI)   │   │                    │
                   └─────────┬──────────┘   └────────────────────┘   └────────────────────┘
                             │
                             ▼  new task definition revision -> ECS rolling deploy
```

### OIDC Trust (no static AWS keys)

```
 GitHub Actions                          AWS IAM
 ┌───────────────────────┐               ┌──────────────────────────────────┐
 │ token.actions.        │               │ Identity Provider (OIDC)         │
 │ githubusercontent.com │──── JWT ──────►│  URL: token.actions.github...    │
 │ (aud: sts.amazonaws)  │               │  Audience: sts.amazonaws.com     │
 └───────────────────────┘               └────────────────┬─────────────────┘
                                                          │ attached to
                                                          ▼
                                         ┌──────────────────────────────────┐
                                         │ Role: github-actions-deploy-role │
                                         │  • AmazonEC2ContainerRegistry... │
                                         │  • AmazonECS_FullAccess          │
                                         └──────────────────────────────────┘
```

---

## 3. Runtime / Network Flow (Request Path)

How a user request reaches the running container, through every layer:

```
        ┌──────────┐
        │   USER   │   https://articleapp.<company>.in
        │ (browser)│
        └────┬─────┘
             │  DNS lookup
             ▼
   ┌─────────────────────┐
   │     CLOUDFLARE      │   CNAME articleapp -> ALB DNS
   │  (Proxied / orange) │   • DNS + SSL/proxy edge
   └──────────┬──────────┘
              │  HTTPS
              ▼
   ╔═════════════════════════════════════════════════════════════╗
   ║                AWS  VPC (vpc-0dff14cfe53eb4a19)               ║
   ║                                                              ║
   ║   ┌────────────────────────────────────────────────────┐    ║
   ║   │   SECURITY GROUP: blog-frontend-sg-alb             │    ║
   ║   │   inbound: 80 (0.0.0.0/0), 443 (0.0.0.0/0)         │    ║
   ║   │  ┌──────────────────────────────────────────────┐  │    ║
   ║   │  │   APPLICATION LOAD BALANCER                   │  │    ║
   ║   │  │   blog-frontend-alb (internet-facing)         │  │    ║
   ║   │  │                                               │  │    ║
   ║   │  │   Listener :80  HTTP  ──► redirect 301 ─┐     │  │    ║
   ║   │  │   Listener :443 HTTPS (ACM cert) ───────┤     │  │    ║
   ║   │  │                                         ▼     │  │    ║
   ║   │  │                              forward to TG     │  │    ║
   ║   │  └───────────────────────────────┬──────────────┘  │    ║
   ║   └──────────────────────────────────┼─────────────────┘    ║
   ║                                       ▼                      ║
   ║   ┌──────────────────────────────────────────────────┐      ║
   ║   │   TARGET GROUP: blog-frontend-tg                  │      ║
   ║   │   type: IP | port: 80 | proto: HTTP               │      ║
   ║   │   health check: GET /  -> 200                     │      ║
   ║   └───────────────────────────┬──────────────────────┘      ║
   ║                               │ routes to healthy IP         ║
   ║                               ▼                              ║
   ║   ┌────────────────────────────────────────────────────┐    ║
   ║   │   SECURITY GROUP: blog-frontend-sg-ecs             │    ║
   ║   │   inbound: 80  ONLY from  blog-frontend-sg-alb     │    ║
   ║   │  ┌──────────────────────────────────────────────┐  │    ║
   ║   │  │   ECS SERVICE: blog-frontend-service          │  │    ║
   ║   │  │   cluster: blog-master | launch: Fargate      │  │    ║
   ║   │  │   desired tasks: 1                            │  │    ║
   ║   │  │  ┌────────────────────────────────────────┐   │  │    ║
   ║   │  │  │  TASK (Fargate)                        │   │  │    ║
   ║   │  │  │  task def: blog-frontend-td            │   │  │    ║
   ║   │  │  │  ┌──────────────────────────────────┐  │   │  │    ║
   ║   │  │  │  │ CONTAINER: blog-frontend         │  │   │  │    ║
   ║   │  │  │  │  nginx :80 -> static React/Vite  │  │   │  │    ║
   ║   │  │  │  │  image pulled from ECR           │  │   │  │    ║
   ║   │  │  │  └──────────────────────────────────┘  │   │  │    ║
   ║   │  │  └────────────────────────────────────────┘   │  │    ║
   ║   │  └──────────────────────────────────────────────┘  │    ║
   ║   └────────────────────────────────────────────────────┘    ║
   ║                               ▲                              ║
   ║                               │ pull image                   ║
   ║   ┌───────────────────────────┴──────────────────────┐      ║
   ║   │   ECR: blog-mern-frontend  (:latest / :SHA)       │      ║
   ║   └────────────────────────────────────────────────────┘    ║
   ╚═════════════════════════════════════════════════════════════╝
```

---

## 4. Security Group Chaining (Who Can Talk to Whom)

The key isolation: the ECS tasks are **not** open to the internet. Only the ALB's
security group is allowed to reach them.

```
   Internet (0.0.0.0/0)
        │  80 / 443
        ▼
  ┌──────────────────────┐
  │ blog-frontend-sg-alb │   (ALB security group)
  └──────────┬───────────┘
             │  port 80
             │  source = blog-frontend-sg-alb   ◄── references the SG, not an IP
             ▼
  ┌──────────────────────┐
  │ blog-frontend-sg-ecs │   (ECS task security group)
  └──────────────────────┘
             │
             ▼
        nginx container :80
```

---

## 5. SSL / Certificate Flow

```
  ┌──────────────┐   request cert   ┌──────────────────────┐
  │ ACM          │◄─────────────────│ articleapp.<co>.in    │
  │ (ap-south-1) │                  │ www.articleapp.<co>.in│
  └──────┬───────┘                  └──────────────────────┘
         │ gives CNAME (name + value)
         ▼
  ┌──────────────────────┐  add record   ┌──────────────────────┐
  │ Cloudflare DNS       │──────────────►│ ACM validates domain │
  │ (domain manager)     │               │ status -> ISSUED     │
  └──────────────────────┘               └──────────┬───────────┘
                                                    │ attach cert
                                                    ▼
                                         ┌──────────────────────┐
                                         │ ALB HTTPS Listener    │
                                         │ :443  (uses ACM cert) │
                                         └──────────────────────┘
```

---

## 6. Component Legend

| Component                   | Name / Value                         | Role                                            |
| --------------------------- | ------------------------------------ | ----------------------------------------------- |
| Source Repo                 | GitHub (branch `master`)             | Triggers the pipeline on push                   |
| CI/CD                       | GitHub Actions                       | Build, push image, deploy to ECS                |
| Auth                        | OIDC Identity Provider + IAM Role    | Keyless AWS access for GitHub Actions           |
| Image Registry              | ECR `blog-mern-frontend`             | Stores Docker images (`:latest`, `:SHA`)        |
| Orchestrator                | ECS Cluster `blog-master` (Fargate)  | Runs the container as a service                 |
| Task Definition             | `blog-frontend-td`                   | Blueprint: image, CPU/mem, ports, logs          |
| Service                     | `blog-frontend-service`              | Keeps desired number of tasks running           |
| Container                   | `blog-frontend` (nginx :80)          | Serves the static React/Vite build              |
| Load Balancer               | `blog-frontend-alb` (internet-facing)| Entry point, HTTP/HTTPS listeners               |
| Target Group                | `blog-frontend-tg` (IP, :80)         | Routes ALB traffic to healthy task IPs          |
| ALB Security Group          | `blog-frontend-sg-alb`               | Allows 80/443 from internet                     |
| ECS Security Group          | `blog-frontend-sg-ecs`              | Allows 80 only from the ALB security group      |
| Certificate                 | ACM `articleapp.<company>.in`        | TLS cert for HTTPS listener                     |
| DNS / Edge                  | Cloudflare (CNAME, proxied)          | Public domain -> ALB DNS                         |
