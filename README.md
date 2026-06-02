# Backend Overview (NestJS + PostgreSQL)

This backend is a NestJS API with JWT auth and OAuth (Google/Facebook). It uses TypeORM with PostgreSQL and auto-loads entities. The current AppModule only registers the Auth module and the root controller, so only `/` and `/auth/*` routes are active by default.

Base URL: `http://localhost:3001` (configurable via `PORT`)

## Runtime Behavior

- **CORS**: enabled for `http://localhost:3000` and `http://localhost:3001`, `credentials: true`.
- **Serialization**: `ClassSerializerInterceptor` is enabled globally (excludes `passwordHash`).
- **Database**: `DATABASE_URL` with SSL (`rejectUnauthorized: false`), `synchronize: true`.

## Environment Variables

Required/used in code:

- `DATABASE_URL` — PostgreSQL connection string.
- `PORT` — server port (defaults to `3001`).
- `FRONTEND_URL` — redirect target after OAuth.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth.
- `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET` — Facebook OAuth.
- `FACEBOOK_CALLBACK_URL` — optional override; defaults to `http://localhost:3001/auth/facebook/callback`.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — Cloudinary uploads.

## Auth & Security

- **JWT**: Bearer token is expected in `Authorization` header for protected endpoints.
- **Important**: `JwtStrategy` uses secret `SECRET_KEY` while `JwtModule` signs with `secretKey`. This mismatch will cause `JwtAuthGuard` validation to fail unless aligned.

## Data Model (TypeORM Entities)

### User
- `id: number`
- `email: string`
- `genre: Genre` (enum; default `comedy`)
- `profilePic: string` (non-nullable)
- `passwordHash: string | null` (excluded from serialization)
- `name?: string`
- `thoughts: Thoughts[]`

### Thoughts
- `id: number`
- `thought: string`
- `user: User` (many-to-one)
- `likes: ThoughtLike`
- `shares: ThoughtShare`
- `likeCount: number` (default `0`)
- `shareCount: number` (default `0`)

### ThoughtLike
- `id: uuid`
- `user: User`
- `thought: Thoughts`
- `createdAt: Date`

### ThoughtShare
- `id: uuid`
- `user: User`
- `thought: Thoughts`
- `createdAt: Date`

### Friendships
- `id: number`
- `sender: User`
- `receiver: User`
- `status: FriendshipStatus` (`pending | accepted | declined | blocked | unfriended`)
- `createdAt: Date`
- `updatedAt: Date`

## Active API Endpoints

These are the endpoints actually registered by `AppModule` and reachable at runtime.

### GET /
**Auth**: none  
**Response**: `"Hello World!"`

### POST /auth/signup
**Auth**: none  
**Body (JSON)**:
```json
{ "email": "user@example.com", "password": "plaintext-password" }
```
**Response**:
```json
{ "user": { "...User" }, "access_token": "jwt" }
```
Notes:
- Creates a user with `passwordHash`.
- Returned `user` is a `User` entity (passwordHash excluded by serializer).

### POST /auth/login
**Auth**: none  
**Body (JSON)**:
```json
{ "email": "user@example.com", "password": "plaintext-password" }
```
**Response**:
```json
{ "access_token": "jwt", "user": { "...User" } }
```

### GET /auth/google
**Auth**: none  
**Behavior**: starts Google OAuth flow (redirect via Passport).

### GET /auth/google/callback
**Auth**: none (Passport handles)  
**Behavior**: exchanges Google profile for a local user and redirects to:
```
${FRONTEND_URL}/auth/google/callback?token=<jwt>&user=<urlencoded_user_json>
```
On error:
```
${FRONTEND_URL}/login?error=auth_failed
```

### GET /auth/facebook
**Auth**: none  
**Behavior**: starts Facebook OAuth flow (redirect via Passport).

### GET /auth/facebook/callback
**Auth**: none (Passport handles)  
**Behavior**: exchanges Facebook profile for a local user and redirects to:
```
${FRONTEND_URL}/login?token=<jwt>&user=<urlencoded_user_json>&provider=facebook
```
On error:
```
${FRONTEND_URL}/login?error=auth_failed&provider=facebook
```

### GET /auth/ano
**Auth**: none  
**Response**: `"hey there"`

### GET /auth/me
**Auth**: `Authorization: Bearer <jwt>`  
**Response**: `{ "userId": number, "email": string }`  
**Note**: This uses `JwtStrategy` and will fail unless the JWT secret mismatch is fixed.

## Declared but Not Wired (Not Active at Runtime)

The following controllers and modules exist in the codebase but are **not registered** in `AppModule` or their own module and therefore are not reachable unless wired in:

### UsersController (not registered in `UserModule`)
Routes:
- `PATCH /users/profile` — expects `multipart/form-data` with:
  - file field `profilePic` (jpeg/png/webp, max 5MB)
  - optional body fields from `UpdateProfileDto` (`name`, `email`, `password`, `genre`)
- `GET /users` — list users excluding current user

Both routes require `Authorization: Bearer <jwt>` via `JwtAuthGuard`.

### ThoughtsModule / FriendshipsModule
Both controllers are empty and modules are not imported into `AppModule`. No routes are exposed.

## Cloudinary Uploads (Used by UsersController)

`CloudinaryService.uploadImage(file)` uploads to `profile-pics` folder and returns `secure_url`.  
**Note**: `UserService` depends on `CloudinaryService`, but `UserModule` does not import `CloudinaryModule`, so DI will fail if `UsersController` is enabled without fixing imports.

## Frontend Integration Notes

- Use `Authorization: Bearer <token>` for protected calls.
- OAuth is redirect-based. Frontend should parse `token` and `user` query params from redirect URL.
- Default API port is `3001`, and CORS allows `http://localhost:3000`.
