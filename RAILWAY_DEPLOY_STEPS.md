# Railway 部署 - 复制粘贴指南

我已经帮你准备好了一切，你只需要按照下面的步骤复制粘贴即可。

## ✅ 我已准备好的内容
- ✅ 代码已修复并推送到GitHub
- ✅ Dockerfile配置正确
- ✅ 所有配置文件都已就绪
- ✅ JWT_SECRET已生成（见下方）

---

## 📋 你需要做的步骤（5分钟）

### 步骤1: 删除旧服务（如果有很多失败的服务）

1. 在Railway项目页面
2. 找到并删除这些服务（如果存在）：
   - `dynamic-laughter`
   - `fulfilling-achievement` 
   - 其他失败的测试服务
3. **保留或找到 `waikato-alumni-connect` 服务**

---

### 步骤2: 检查或创建服务

#### 情况A：如果 `waikato-alumni-connect` 服务已存在
1. 点击 `waikato-alumni-connect` 服务卡片
2. 进入 **"Settings"** 标签
3. 找到 **"Source"** 部分
4. 确认分支是 **`main`**
5. 点击 **"Redeploy"** 按钮
6. 选择最新commit：**`ced8b14`** 或 **"Deploy latest"**
7. ✅ 完成！跳到步骤4

#### 情况B：如果没有 `waikato-alumni-connect` 服务，创建新的
1. 在项目页面，点击 **"+ New"** → **"GitHub Repo"**
2. 选择仓库：**`mkunal3/waikato-alumni-connect`**
3. **重要：** 在配置页面，找到 **"Root Directory"**
4. 输入：**`backend`**
5. 点击 **"Deploy"** 或 **"Create"**

---

### 步骤3: 添加PostgreSQL数据库（如果还没有）

1. 在项目页面，点击 **"+ New"** → **"Database"** → **"PostgreSQL"**
2. 等待数据库创建完成（约1分钟）
3. 点击数据库服务卡片
4. 进入 **"Variables"** 标签
5. 复制 **`DATABASE_URL`** 的值（我们下一步要用）

---

### 步骤4: 设置环境变量（关键步骤）

1. 点击 **`waikato-alumni-connect`** 服务
2. 进入 **"Variables"** 标签
3. 点击 **"+ New Variable"**，逐个添加以下变量：

#### 变量1: DATABASE_URL
- **Name:** `DATABASE_URL`
- **Value:** `<从步骤3复制的数据库URL>`

#### 变量2: JWT_SECRET
- **Name:** `JWT_SECRET`
- **Value:** `<见下方，我已生成好>`

#### 变量3: NODE_ENV
- **Name:** `NODE_ENV`
- **Value:** `production`

#### 变量4: FRONTEND_URL
- **Name:** `FRONTEND_URL`
- **Value:** `http://localhost:3000`（稍后部署前端后再更新）

#### 变量5: PORT
- **Name:** `PORT`
- **Value:** `4000`

4. 保存所有变量后，服务会自动重新部署

---

### 步骤5: 等待部署完成

1. 进入 **"Deployments"** 标签
2. 等待部署状态变为 **"SUCCESS"**（约2-3分钟）
3. ✅ 如果成功，你会看到绿色的 "SUCCESS" 标记

---

### 步骤6: 运行数据库迁移

1. 部署成功后，点击服务 → **"Deployments"** → 最新部署 → **"Shell"** 或 **"Terminal"**
2. 在终端运行以下命令（直接复制粘贴）：
```bash
npx prisma migrate deploy
```
3. 等待完成（应该显示 "All migrations have been applied"）

---

### 步骤7: 获取后端URL

1. 点击服务 → **"Settings"** → **"Domains"** 或 **"Networking"**
2. 复制显示的URL（类似：`https://xxx.up.railway.app`）
3. ✅ **保存这个URL，部署前端时需要用到**

---

## 🔑 已生成的值

### JWT_SECRET（步骤4中使用）：
```
a72d2c5ee41856aa98164afe43debb33d540f04ff95b542d0b798698ed46c8fa
```

---

## ❓ 如果部署失败

如果部署仍然失败，请告诉我：
1. 错误信息是什么（从Build Logs中复制）
2. 哪个步骤出了问题
3. 我会立即帮你修复

---

## ✅ 完成后

部署成功后：
- ✅ 后端URL：`https://xxx.up.railway.app`
- ✅ 测试：在浏览器打开URL，应该看到 `{"message":"Waikato Connect API is running"}`
- ✅ 然后我们可以继续部署前端（Vercel，更简单）
