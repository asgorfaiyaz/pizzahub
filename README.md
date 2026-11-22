## Key Learnings

- **Reusable API client:** `serverApiFetch` centralizes API URLs, authentication, response parsing, and error handling for public and protected requests. See [Why `serverApiFetch` is worth having](doc/learnings/reusable-api-client.md).
- **Secure image uploads:** Menu images are validated in the form, uploaded to ImgBB through a server action, and sent to the backend as image URLs without exposing the API key.
- **Framework errors vs. app errors:** `redirect()` throws an internal signal that a `try/catch` can swallow; `unstable_rethrow()` lets Next.js handle it while ordinary API errors still reach your handler. See [Understanding `redirect()` and `unstable_rethrow()`](doc/learnings/unstable-rethrow.md).
