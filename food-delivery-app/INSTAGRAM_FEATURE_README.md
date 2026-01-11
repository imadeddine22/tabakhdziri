# Instagram Posts Management Feature

## Overview
This feature allows administrators to manage Instagram posts that are displayed on the Services page. Admins can upload images, add Instagram post URLs, and control which posts are visible to users.

## Features

### Admin Panel
- **Add New Posts**: Upload an image and provide an Instagram post URL
- **Edit Posts**: Update existing posts (image, URL, order, status)
- **Delete Posts**: Remove posts from the database
- **Toggle Status**: Activate/deactivate posts without deleting them
- **Order Management**: Control the display order of posts
- **Bilingual Support**: Full Arabic and French language support

### Frontend Display
- **Dynamic Loading**: Posts are fetched from the API
- **Clickable Links**: Each post opens the Instagram URL in a new tab
- **Smooth Animation**: Infinite scrolling carousel effect
- **Responsive Design**: Works on all screen sizes
- **Loading States**: Shows loading spinner while fetching data
- **Empty State**: Displays message when no posts are available

## Technical Implementation

### Backend (Node.js + Express + MongoDB)

#### Model: `InstagramPost.js`
```javascript
{
    image: String,        // Path to uploaded image
    postUrl: String,      // Instagram post URL
    order: Number,        // Display order
    isActive: Boolean,    // Active/inactive status
    timestamps: true      // createdAt, updatedAt
}
```

#### API Endpoints
- `GET /api/instagram` - Get all active posts (Public)
- `GET /api/instagram/admin/all` - Get all posts including inactive (Admin)
- `GET /api/instagram/:id` - Get single post (Public)
- `POST /api/instagram` - Create new post (Admin)
- `PUT /api/instagram/:id` - Update post (Admin)
- `PATCH /api/instagram/:id/toggle` - Toggle active status (Admin)
- `DELETE /api/instagram/:id` - Delete post (Admin)

### Frontend (Next.js + TypeScript)

#### Admin Page: `/app/admin/instagram/page.tsx`
- Full CRUD operations
- Image upload with preview
- Form validation
- Dark mode support
- Responsive grid layout

#### Services Page: `/app/services/page.tsx`
- Fetches posts from API on mount
- Displays posts in infinite scrolling carousel
- Each post is clickable and opens Instagram URL in new tab
- Shows loading state while fetching
- Shows empty state when no posts available

## Usage

### For Administrators

1. **Access Admin Panel**
   - Navigate to `/admin/instagram`
   - Click "إضافة منشور جديد" / "Ajouter un Post"

2. **Add New Post**
   - Upload an image (JPEG, PNG, etc.)
   - Enter Instagram post URL (must start with https://www.instagram.com/)
   - Set display order (optional, default: 0)
   - Toggle active status (default: active)
   - Click "حفظ" / "Enregistrer"

3. **Edit Post**
   - Click "تعديل" / "Modifier" button on any post
   - Update fields as needed
   - Save changes

4. **Delete Post**
   - Click "حذف" / "Supprimer" button
   - Confirm deletion

5. **Toggle Status**
   - Click the eye icon to activate/deactivate
   - Inactive posts won't show on the Services page

### For Users

1. Visit the Services page (`/services`)
2. Scroll to the "Suivez-nous sur Instagram" section
3. Click on any image to open the Instagram post in a new tab
4. Hover over images to see the Instagram icon overlay

## File Structure

```
food-delivery-backend/
├── models/
│   └── InstagramPost.js
├── controllers/
│   └── instagramController.js
├── routes/
│   └── instagramRoutes.js
└── server.js (updated)

food-delivery-app/
├── app/
│   ├── admin/
│   │   └── instagram/
│   │       └── page.tsx
│   └── services/
│       └── page.tsx (updated)
├── components/
│   └── AdminLayout.tsx (updated)
└── locales/
    ├── ar.json (updated)
    └── fr.json (updated)
```

## Environment Variables

Make sure `NEXT_PUBLIC_API_URL` is set in your `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Validation

### Backend
- Image is required for new posts
- Instagram URL must match pattern: `https?://(www\.)?instagram\.com/`
- All fields are validated before saving

### Frontend
- Image required for new posts (optional for updates)
- Instagram URL required
- URL format validated

## Security

- All admin routes protected with authentication middleware
- Only admins can create/update/delete posts
- File upload handled securely with multer
- Old images deleted when updating/deleting posts

## Styling

- Consistent with existing admin panel design
- Dark mode support
- Responsive grid layout
- Smooth animations and transitions
- Loading and empty states

## Future Enhancements

- Bulk upload
- Image cropping/editing
- Analytics (click tracking)
- Scheduled posts
- Instagram API integration for automatic syncing
