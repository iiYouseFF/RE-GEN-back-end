# RE-GEN Backend

The backend service for the RE-GEN application. Built with Node.js, Express, and Supabase.

## Technologies Used

- **Node.js & Express**: API framework and server routing
- **Supabase**: PostgreSQL database, authentication, and user management
- **Cloudinary**: Cloud storage for image uploads
- **Multer**: Middleware for handling `multipart/form-data` (file uploads)
- **Security & Performance**: Helmet, CORS, Express Rate Limit, Morgan, Compression

## Prerequisites

- Node.js (v18 or higher recommended)
- Supabase project and database set up
- Cloudinary account for file storage
- A `.env` file containing the necessary environment variables.

## Environment Variables

Create a `.env` file in the root directory. You will need variables for Supabase, Cloudinary, etc.
Example:

```env
PORT=3000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Getting Started

**1. Install Dependencies**

```bash
npm install
```

**2. Run the Development Server**

```bash
nodemon server.js
```

_(Or start using `node server.js`)_

**3. Test the Endpoints**
You can quickly verify the API status by running the test script provided:

```bash
node test_endpoints.js
```

## Internal Architecture

- `routes/` - Maps incoming URL paths to controller functions.
- `controllers/` - Contains the business logic, handles request/response, and interacts with the database.
- `middleware/` - Pre-processes incoming requests. E.g., handling authentication or formatting errors.
- `config/` - Sets up the Supabase client and Cloudinary uploader variables.
- `utils/` - Contains helper classes and scripts (like calculating EcoStats).

## Documentation

- **[API Endpoints](ENDPOINTS.md)**: Check `ENDPOINTS.md` for a complete list of endpoints and request/response structures.
