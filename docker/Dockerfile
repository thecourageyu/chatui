# RUN rm -rf node_modules package-lock.json && \
#     npm install

# Base image with Python and Node.js
FROM node:20-bullseye

ENV DEBIAN_FRONTEND=noninteractive

# Install Python, pip, PostgreSQL dependencies, and OpenSSH
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 python3-pip python3-venv \
        build-essential libpq-dev postgresql-client openssh-server \
        curl git gnupg openssl nginx vim sudo supervisor && \
    rm -rf /var/lib/apt/lists/* && \
    mkdir /var/run/sshd

# 安裝 locales 並產生 en_US.UTF-8
RUN apt-get update && \
    apt-get install -y locales && \
    echo "en_US.UTF-8 UTF-8" > /etc/locale.gen && \
    locale-gen && \
    update-locale LANG=en_US.UTF-8

# 設定環境變數
ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8
    
ARG SSH_USER
ARG SSH_PASSWORD
ENV SSH_USER=${SSH_USER}
ENV SSH_PASSWORD=${SSH_PASSWORD}

RUN useradd -ms /bin/bash ${SSH_USER} && \
    echo "${SSH_USER}:${SSH_PASSWORD}" | chpasswd && \
    adduser ${SSH_USER} sudo

RUN sed -i 's/^#PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config
RUN sed -i 's/^#PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config

ARG WORK_DIR
ARG PYTHON_VENV
ENV WORK_DIR=${WORK_DIR}
ENV PYTHON_VENV=${PYTHON_VENV}
#ENV PYTHON_VENV="datas"
#ENV WORK_DIR=/app

# Set up working directory
WORKDIR ${WORK_DIR}

RUN pip install --upgrade pip && \
    pip install virtualenv

RUN python3 -m virtualenv ${WORK_DIR}/${PYTHON_VENV}
ENV PATH="${WORK_DIR}/${PYTHON_VENV}/bin:$PATH"

# Automatically activate venv on login
RUN echo "source ${WORK_DIR}/${PYTHON_VENV}/bin/activate" >> /root/.bashrc
RUN echo "source ${WORK_DIR}/${PYTHON_VENV}/bin/activate" >> /home/${SSH_USER}/.bashrc

COPY requirements.txt /tmp/requirements.txt
#COPY ./docker/requirements.txt /tmp/requirements.txt

# RUN pip install --upgrade pip && \
#     pip install -r /tmp/requirements.txt

# Copy backend requirements and install
# COPY backend/requirements.txt ./backend/requirements.txt
# RUN ${WORK_DIR}/venv/bin/python3 -m pip install --upgrade pip && \
#     ${WORK_DIR}/app/venv/bin/pip3 install -r /tmp/requirements.txt

RUN python3 -m pip install --upgrade pip && \
    pip install -r /tmp/requirements.txt
            
# Install frontend dependencies and build React with Tailwind (Vite)
# WORKDIR /app/frontend
# COPY frontend/package.json frontend/package-lock.json ./
# RUN npm install
# COPY frontend .
# RUN npm run build

# COPY connectors ${WORK_DIR}/connectors
# COPY logs.py ${WORK_DIR}/logs.py
# COPY crawl.py ${WORK_DIR}/crawl.py
# COPY scheduler.py ${WORK_DIR}/scheduler.py
# COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports: 8000 for FastAPI, 3000 for React dev, 22 for SSH
EXPOSE 9997 3000 22

# Final working directory
# WORKDIR /app/backend

# Default command starts SSH and FastAPI
# CMD service ssh start && uvicorn main:app --host 0.0.0.0 --port 8000
# CMD ["/usr/sbin/sshd", "-D"]
CMD ["/usr/bin/supervisord"]
