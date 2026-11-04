# Deployment — Docker + CI/CD to a VPS

How a push to `production` ends up live on the VPS:

```
git push production
   │
   ▼
GitHub Actions (.github/workflows/deploy.yml)
   ├─ build-and-push : docker build (REACT_APP_SERVER_URL baked in)
   │                   →  push to ghcr.io/radovanrasha/playground
   └─ deploy         : scp docker-compose.yml → VPS ~/playground-front
                       ssh → docker login → docker compose pull → up -d
   │
   ▼
VPS: container "playground-frontend" (nginx serving the React build)
     published on 127.0.0.1:3006
   │
   ▼
nginx (host) : playground.radovanrasha.com  →  proxy_pass 127.0.0.1:3006
```

The image is built **in GitHub Actions**, not on the VPS. The VPS only pulls a
finished image and restarts it. The API has its own identical pipeline in the
`playground-api` repo.

Work happens on `staging`; merge `staging` into `production` to release. You
can also run the workflow by hand from the **Actions** tab (*workflow_dispatch*).

---

## One-time setup

### 1. GitHub repository secrets

Repo → **Settings → Secrets and variables → Actions**. These names are the
same ones the old pm2 workflow used, so they may already be set:

| Secret                 | Value                                                   |
| ---------------------- | ------------------------------------------------------- |
| `VPS_SSH_HOST`         | VPS IP or hostname                                      |
| `VPS_SSH_USER`         | SSH user (e.g. `dev`)                                   |
| `VPS_SSH_PRIVATE_KEY`  | **Private** SSH key whose public half is on the VPS     |
| `VPS_SSH_PORT`         | *(optional)* SSH port — defaults to `22`               |
| `REACT_APP_SERVER_URL` | Public URL of the API, e.g. `https://api.example.com`   |

`GITHUB_TOKEN` is provided automatically; it pushes the image to GHCR and is
reused over SSH to authenticate the pull.

`REACT_APP_SERVER_URL` is compiled into the JavaScript at build time. If you
change it, re-run the workflow so a new image is built.

### 2. On the VPS (once)

```bash
# Docker + compose plugin (skip if already installed for the portfolio)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER"   # then log out/in so `docker` works w/o sudo

# The deploy directory the workflow scps into
mkdir -p ~/playground-front
```

### 3. Switch over from the old pm2 setup

The container uses port **3006**, the same port the old pm2 process used, so
stop pm2 first or the container cannot bind the port:

```bash
pm2 stop playground-frontend
pm2 delete playground-frontend
pm2 save
```

Your existing nginx site for `playground.radovanrasha.com` already proxies to
3006 and keeps working. For a fresh server, see
[`deploy/nginx.conf.example`](deploy/nginx.conf.example).

---

## Check it

After the workflow is green, on the VPS:

```bash
docker ps --filter name=playground-frontend
curl -I http://127.0.0.1:3006          # → HTTP/1.1 200 OK
```

## Roll back

Every image is also tagged with its commit SHA. To go back, on the VPS edit
`~/playground-front/docker-compose.yml` to use
`ghcr.io/radovanrasha/playground:<sha>` and run `docker compose up -d`
(the next deploy puts `:latest` back).

## Run the image locally (optional)

```bash
docker build --build-arg REACT_APP_SERVER_URL=http://localhost:3007 -t playground .
docker run --rm -p 3006:80 playground
# → http://localhost:3006
```
