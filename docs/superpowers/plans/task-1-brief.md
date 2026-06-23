### Task 1: Initialize Backend Structure

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/render.yaml`

**Interfaces:**
- Produces: A separate Node package in `backend/` that can be deployed via Render blueprints.

- [ ] **Step 1: Create `backend/package.json`**

```json
{
  "name": "dps-scheduler-backend",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "node --test"
  },
  "dependencies": {
    "axios": "^1.7.9",
    "colorette": "^2.0.20",
    "cors": "^2.8.5",
    "dayjs": "^1.11.13",
    "dotenv": "^16.4.7",
    "express": "^4.19.2",
    "lodash": "^4.17.21",
    "p-queue": "6.6.2",
    "prompts": "^2.4.2",
    "puppeteer": "^24.0.0",
    "puppeteer-extra": "^3.3.6",
    "puppeteer-extra-plugin-anonymize-ua": "^2.4.6",
    "puppeteer-extra-plugin-stealth": "^2.11.2",
    "uuid": "^10.0.0",
    "yaml": "^2.7.0",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/lodash": "^4.17.14",
    "@types/node": "^22.10.5",
    "@types/prompts": "^2.4.9",
    "@types/uuid": "^10.0.0",
    "typescript": "^5.7.3"
  }
}
```

- [ ] **Step 2: Create `backend/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Create `render.yaml` Blueprint**

```yaml
services:
  - type: web
    name: dps-scheduler-api
    env: node
    rootDir: backend
    buildCommand: npm install && npm run build
    startCommand: npm start
    plan: free
```

- [ ] **Step 4: Copy source files**

```bash
mkdir -p backend/src
cp -r ../Downloads/texas-dps-scheduler-main/texas-dps-scheduler-main/src/* backend/src/
# Remove the old CLI index
rm backend/src/index.ts
```

- [ ] **Step 5: Commit**

```bash
git add backend/package.json backend/tsconfig.json backend/render.yaml backend/src
git commit -m "feat: initialize backend structure"
```
