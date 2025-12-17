# === 阶段一：构建 (Node) ===
FROM node:22-alpine as builder
WORKDIR /app

# 👇👇👇 【加入这一行】告诉 Node.js：你可以大胆用到 4GB 内存 (我们刚才加了 Swap，够用了)
ENV NODE_OPTIONS="--max-old-space-size=4096"

# ⚠️ 关键：设置国内 npm 镜像源 (淘宝/阿里云)
RUN npm config set registry https://registry.npmmirror.com

# 先复制依赖文件，利用 Docker 缓存
COPY package*.json ./

# 使用 npm ci (比 npm install 更快更可靠)
RUN npm ci --prefer-offline

# 复制源代码
COPY . .

# 使用 build:fast 跳过类型检查（加速构建）
RUN npm run build:fast

# === 阶段二：服务 (Nginx) ===
FROM nginx:alpine

# 把构建好的文件放入 Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
