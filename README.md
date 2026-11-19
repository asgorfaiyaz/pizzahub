## Key Learnings

- **Reusable API client:** `serverApiFetch` centralizes API URLs, authentication, response parsing, and error handling for public and protected requests.
- **Secure image uploads:** Menu images are validated in the form, uploaded to ImgBB through a server action, and sent to the backend as image URLs without exposing the API key.
