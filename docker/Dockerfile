# 使用官方的 Python 3.11 基礎映像
FROM python:slim

# 安裝基本工具和 Node.js (包含 npm)
RUN apt-get update && \
    apt-get install -y curl gnupg openssl nginx && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# 驗證 Python 和 Node.js 版本
RUN python3 --version && node --version && npm --version

# 建立應用目錄
WORKDIR /app

# 安裝 Python 套件管理工具 pip 及 Virtualenv
# RUN pip install --upgrade pip && \
#     pip install virtualenv

# 設置 Virtualenv 環境
# RUN python -m virtualenv venv
# ENV PATH="/app/venv/bin:$PATH"

# 安裝 Django
# RUN pip install django
COPY requirements.txt /tmp/requirements.txt
RUN pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt

# 安裝 React 相關的工具
RUN npm install -g create-react-app

# 設置 Nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 建立一個啟動腳本，啟動 Django 和 Nginx
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# 對外開放的端口（Nginx 使用默認的 80 端口）
EXPOSE 80

# 預設執行啟動腳本
# CMD ["/start.sh"]
