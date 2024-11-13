#!/bin/bash

# 啟動 Django
cd /app
# python manage.py migrate
# python manage.py runserver 0.0.0.0:8000 &

# 啟動 Nginx
nginx -g "daemon off;"
