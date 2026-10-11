# InfluEnhance API

Copy `.env.example` to `.env` for local development, then edit the values as
needed. The `.env` file is ignored by Git; for deployment, set the same
variables in your hosting provider's environment configuration.
For the frontend, copy `frontend/.env.example` to `frontend/.env.local` and
update `NEXT_PUBLIC_API_URL` to the deployed API URL.

Run the Node.js backend from this folder:

```sh
npm start
```

The API reads `PORT`, `FRONTEND_ORIGIN`, `MONGODB_URI`, `MONGODB_DB`, and
`SESSION_SECRET` from `.env`. The local defaults connect to MongoDB at
`127.0.0.1:27017` and use the `influenhance` database. Ensure the local MongoDB
service is running before starting the backend. Accounts are stored in the
`users` collection, with passwords hashed before they are saved. Use a random
session secret of at least 32 characters. Set `NEXT_PUBLIC_API_URL` in the
frontend's `.env.local` to point at the deployed API;
`frontend/.env.example` shows the local default.

- `GET /api/health` checks that the API is running.
- `POST /api/signup` creates an account and starts a session.
- `POST /api/login` verifies an account and starts a session.
- `GET /api/session` checks the current session; `POST /api/logout` clears it.
- Database configuration and connection are in `config/database.js`.
- API endpoints are grouped in `routes/`; shared request handling is in
  `middleware/`.
