# Mini Issue Tracker

A full-stack issue tracking system with **Django + GraphQL** backend and **React + Apollo Client** frontend. Includes:

- 🔐 JWT Authentication
- 📋 Create / Edit / Delete Issues
- 📡 Real-time Updates via GraphQL Subscriptions
- 🧠 AI-powered Description Suggestions (LangChain + Gemini)
- 🧱 Kanban-style Drag & Drop Status Board
- 👥 Team Member Invitations

---

## 🚀 Tech Stack

**Backend**
- Django
- Graphene-Django (GraphQL)
- Channels + Channels-GraphQL-WS (WebSocket support)
- Django Rest Framework (for auth if needed)
- JWT Auth (using `django-graphql-jwt`)

**Frontend**
- React + TypeScript
- Apollo Client
- Tailwind CSS
- Zustand / Redux (optional)
- react-beautiful-dnd (Kanban drag & drop)

---

## 🧑‍💻 Local Development Setup

#### ⬇️ Clone Repo


## ⬇️ Setup Backend


```bash
cd issue_tracker/issue_tracker_backend 

```bash
python3.9 -m venv venv

source venv/bin/activate

pip3 install -r requirements.txt


- Add your environment Data in .env File

``bash

# Manage migrations
python manage.py makemigrations
python manage.py migrate

# Create Super User
python manage.py createsuperuser

# runserver
python manage.py runserver

## ⬇️ Setup Frontend


```bash
cd issue_tracker/mini-issue-tracker-frontend 

npm install

- Add your environment Data in .env File