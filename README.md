# Mini Issue Tracker

A full-stack issue tracking system with **Django + GraphQL** backend and **React + Apollo Client** frontend. Includes:

- 👥 Register/login user
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
- Redux
- react-beautiful-dnd (Kanban drag & drop)

---

## 🧑‍💻 Local Development Setup

## ⬇️ Cloning the repository

- Clone the repository using the command below :

```bash
git clone https://github.com/jaymind2810/issue_tracker.git

```


## ⬇️ Setup Backend

- Move into the backend directory where we have the project files : 

```bash
cd issue_tracker/issue_tracker_backend 

```

- Create a virtual environment and activate this :

```bash
python3.9 -m venv venv

source venv/bin/activate

```

- Install requirements file.

```bash
pip3 install -r requirements.txt

```

- Add your environment Data in .env File. sample env data below

```bash
POSTGRES_DB=issue_tracker_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

GOOGLE_API_KEY=AIzaSyDsdddddddddddddddddddddddddddddOc

```


- Manage migrations

```
python manage.py makemigrations
python manage.py migrate
```

- Create Super User

```
python manage.py createsuperuser
```

- start local server

```
python manage.py runserver
```


## ⬇️ Setup Frontend


```bash
cd issue_tracker/mini-issue-tracker-frontend 

npm install
```

- Add your environment Data in .env File

```bash
VITE_GRAPHQL_API="http://localhost:8000/graphql"
VITE_GRAPHQL_WS="ws://localhost:8000/graphql"

```

- start local server

```
npm run dev

```
