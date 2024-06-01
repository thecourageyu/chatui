#!/bin/bash

# referenec: https://medium.com/@devsumitg/how-to-connect-reactjs-django-framework-c5ba268cb8be

pip install Django==5.0.6
# https://nodejs.org/en

# Step 1: Create a New Django Project and a New React Application
django-admin startproject backend
npx create-react-app frontend

# Step 2: Install Required Packages
pip install -r template/backend/requirements.txt
cd frontend 
npm install --save axios
cd -

# Step 3: Build the API Endpoints in Django
cd backend
python manage.py startapp chatapi
cd -
cp template/backend/backend/settings.py backend/backend/
cp template/backend/backend/urls.py backend/backend/
cp template/backend/chatapi/views.py backend/chatapi/
cp template/backend/chatapi/urls.py backend/chatapi/

# Step 4: Create a React Component to Make HTTP Requests
cp template/frontend/src/HelloWorld.js frontend/src/

# Step 5: Render the React Component
cp template/frontend/src/App.js frontend/src/

# Step 6: Run the Project
cd backend
python manage.py runserver &
cd -

cd fronend
npm start