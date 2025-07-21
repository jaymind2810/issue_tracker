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

- Create a .env file.

```bash
PPOSTGRES_DB=your_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

GOOGLE_API_KEY=your_google_gemini_api_key

```

- Apply migrations

```
python manage.py makemigrations
python manage.py migrate
```

- Create Super User

```
python manage.py createsuperuser
```

- Run development server:

```
daphne -b 0.0.0.0 -p 8000 issue_tracker_backend.asgi:application
```

## ⬇️ Setup Frontend

```bash
cd issue_tracker/mini-issue-tracker-frontend

npm install
```

- Create a .env file:

```bash
VITE_GRAPHQL_API="http://localhost:8000/graphql"
VITE_GRAPHQL_WS="ws://localhost:8000/graphql"

```

- Run the frontend app:

```
npm run dev

```

---

## 🔌 GraphQL API Reference

### 📅 Queries

* `allIssues(status: IssueStatusEnum)`: Get list of all issues (optionally filtered by status)
* `myIssues`: Get issues created or assigned to the logged-in user
* `issueStatusEnum`: Fetch available status enum values

### ✏️ Mutations

* `createIssue(title, description, status)`: Create a new issue
* `updateIssue(id, title, description, status, priority, assignedTo)`: Edit existing issue
* `deleteIssue(id)`: Delete an issue
* `register(username, password)`: Register a new user
* `tokenAuth(username, password)`: Get JWT token
* `refreshToken(token)`: Refresh JWT token
* `inviteUser(email)`: Invite a user to the project
* `enhanceDescription(text)`: Get AI-enhanced description using LangChain + Gemini

### 🛁 Subscriptions

* `issueUpdated`: Real-time updates for any issue changes

---

## 🤖 AI Integration (LangChain + Gemini)

* LangChain is used to orchestrate prompts and connect to the Google Gemini API
* AI is triggered via the `enhanceDescription` mutation

### Purpose:

* Improve issue clarity
* Auto-summarize short descriptions
* Expand vague bug reports into detailed ones

---

## ⚠️ Known Limitations

* 🔐 No role-based access control yet (e.g., admin vs member)
* 📨 Invitation system works via username or email but doesn’t send real emails
* 🧐 AI description enhancement may return generic results with insufficient prompts
* 🛨️ WebSocket support tested only on local/dev environments
* 🐛 No activity logs/history for issue updates yet
* 📱 UI not fully optimized for mobile yet

