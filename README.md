## Key Learning: `serverApiFetch`

I created a reusable, server-only `serverApiFetch` utility to centralize API communication. It handles the backend URL, session-token authentication, public or protected requests, response parsing, and errors in one place. This keeps feature actions focused on business logic and avoids repeating fetch and authentication code across the project.
