# Recruiter API Documentation

**Base URL:** `http://localhost:5001/api/recruiter`

Authentication is handled by the external service at `https://recruit.neurocruit.ai`. All protected routes require the token returned from `/login` passed as a Bearer token.

---

## Authentication

### `POST /login`

Authenticates a recruiter via the external auth service and returns a token.

**Auth required:** No

**Request Body**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success — 200 OK**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "recruiter": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "contactEmail": "hiring@company.com",
    "contactPhone": "+1 555 000 0000"
  }
}
```

> `contactEmail` and `contactPhone` are empty strings if the recruiter has never saved contact details.

**Error Responses**

| Status | Body | Reason |
|--------|------|--------|
| `400` | `{ "message": "Email and password are required" }` | Missing fields |
| `401` | `{ "message": "Invalid credentials" }` | Wrong email or password |
| `503` | `{ "message": "Authentication service unavailable" }` | External auth service unreachable |

---

## Profile

### `GET /me`

Returns the authenticated recruiter's profile including stored contact details.

**Auth required:** Yes

**Headers**
```
Authorization: Bearer <token>
```

**Success — 200 OK**
```json
{
  "recruiter": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "contactEmail": "hiring@company.com",
    "contactPhone": "+1 555 000 0000"
  }
}
```

**Error Responses**

| Status | Body | Reason |
|--------|------|--------|
| `401` | `{ "message": "No token provided" }` | Missing Authorization header |
| `401` | `{ "message": "Invalid token" }` | Token failed external validation |
| `401` | `{ "message": "Token expired" }` | Token is expired |
| `503` | `{ "message": "Authentication service unavailable" }` | External auth service unreachable |

---

### `PUT /contact`

Saves or updates the recruiter's contact email and phone. These are stored in the local database and automatically attached to any job posts created.

**Auth required:** Yes

**Request Body**
```json
{
  "contactEmail": "hiring@company.com",
  "contactPhone": "+1 555 000 0000"
}
```

> Both fields are optional — omitting one clears it.

**Success — 200 OK**
```json
{
  "message": "Contact details updated",
  "recruiter": {
    "contactEmail": "hiring@company.com",
    "contactPhone": "+1 555 000 0000"
  }
}
```

**Error Responses**

| Status | Body | Reason |
|--------|------|--------|
| `401` | `{ "message": "..." }` | Auth failure (see `/me`) |
| `500` | `{ "message": "Server error", "error": "..." }` | Database error |

---

## Jobs

### `GET /jobs`

Returns all job posts belonging to the authenticated recruiter, sorted newest first.

**Auth required:** Yes

**Success — 200 OK**
```json
[
  {
    "_id": "664a1b2c3d4e5f6a7b8c9d0e",
    "recruiterId": "1",
    "recruiterName": "John Doe",
    "recruiterEmail": "john@example.com",
    "title": "Senior Frontend Engineer",
    "description": "<p>We are looking for...</p>",
    "skills": ["React", "TypeScript", "Node.js"],
    "contactEmail": "hiring@company.com",
    "contactPhone": "+1 555 000 0000",
    "createdAt": "2025-06-01T10:00:00.000Z",
    "updatedAt": "2025-06-01T10:00:00.000Z"
  }
]
```

Returns an empty array `[]` if the recruiter has no posts.

---

### `POST /jobs`

Creates a new job post. `contactEmail` and `contactPhone` are automatically pulled from the recruiter's saved contact details.

**Auth required:** Yes

**Request Body**
```json
{
  "title": "Senior Frontend Engineer",
  "description": "<p>We are looking for an experienced...</p>",
  "skills": ["React", "TypeScript", "Node.js"]
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | Yes | — |
| `description` | string | Yes | Accepts plain text or HTML |
| `skills` | string \| string[] | No | Comma-separated string or array both accepted |

**Success — 201 Created**
```json
{
  "message": "Job created",
  "job": {
    "_id": "664a1b2c3d4e5f6a7b8c9d0e",
    "recruiterId": "1",
    "recruiterName": "John Doe",
    "recruiterEmail": "john@example.com",
    "title": "Senior Frontend Engineer",
    "description": "<p>We are looking for an experienced...</p>",
    "skills": ["React", "TypeScript", "Node.js"],
    "contactEmail": "hiring@company.com",
    "contactPhone": "+1 555 000 0000",
    "createdAt": "2025-06-01T10:00:00.000Z",
    "updatedAt": "2025-06-01T10:00:00.000Z"
  }
}
```

**Error Responses**

| Status | Body | Reason |
|--------|------|--------|
| `400` | `{ "message": "title and description are required" }` | Missing required fields |
| `401` | `{ "message": "..." }` | Auth failure |
| `500` | `{ "message": "Server error", "error": "..." }` | Database error |

---

### `PUT /jobs/:id`

Updates an existing job post. Only the owning recruiter can edit a post.

**Auth required:** Yes

**URL Parameters**

| Param | Description |
|-------|-------------|
| `id` | MongoDB `_id` of the job post |

**Request Body**
```json
{
  "title": "Lead Frontend Engineer",
  "description": "<p>Updated description...</p>",
  "skills": ["React", "TypeScript", "GraphQL"]
}
```

All fields are optional — only provided fields are updated.

**Success — 200 OK**
```json
{
  "message": "Job updated",
  "job": {
    "_id": "664a1b2c3d4e5f6a7b8c9d0e",
    "recruiterId": "1",
    "recruiterName": "John Doe",
    "recruiterEmail": "john@example.com",
    "title": "Lead Frontend Engineer",
    "description": "<p>Updated description...</p>",
    "skills": ["React", "TypeScript", "GraphQL"],
    "contactEmail": "hiring@company.com",
    "contactPhone": "+1 555 000 0000",
    "createdAt": "2025-06-01T10:00:00.000Z",
    "updatedAt": "2025-06-01T12:30:00.000Z"
  }
}
```

**Error Responses**

| Status | Body | Reason |
|--------|------|--------|
| `401` | `{ "message": "..." }` | Auth failure |
| `404` | `{ "message": "Job not found or not yours" }` | ID doesn't exist or belongs to another recruiter |
| `500` | `{ "message": "Server error", "error": "..." }` | Database error |

---

### `DELETE /jobs/:id`

Permanently deletes a job post. Only the owning recruiter can delete a post.

**Auth required:** Yes

**URL Parameters**

| Param | Description |
|-------|-------------|
| `id` | MongoDB `_id` of the job post |

**Success — 200 OK**
```json
{
  "message": "Job deleted"
}
```

**Error Responses**

| Status | Body | Reason |
|--------|------|--------|
| `401` | `{ "message": "..." }` | Auth failure |
| `404` | `{ "message": "Job not found or not yours" }` | ID doesn't exist or belongs to another recruiter |
| `500` | `{ "message": "Server error", "error": "..." }` | Database error |

---

## Authorization Flow

Every protected route passes the Bearer token to `https://recruit.neurocruit.ai/api/auth/validate-token`. A `401` is returned if the token is missing, invalid, or expired — no local JWT secret is used.
