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

The API reads `PORT` and `FRONTEND_ORIGIN` from `.env`. Set
`NEXT_PUBLIC_API_URL` in the frontend's `.env.local` to point it at the
deployed API; `frontend/.env.example` shows the local default.

- `GET /api/health` checks that the API is running.
- `POST /api/login` is handled in `routes/authRoutes.js`.
- Shared request handling is in `middleware/`.

The login endpoint is a scaffold only; it does not authenticate users or create
sessions until an authentication provider and user store are configured.
