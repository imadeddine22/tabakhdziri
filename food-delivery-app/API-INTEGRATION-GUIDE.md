# Backend API Integration Guide 🔌

## API Client Setup

The API client (`lib/api.js`) has been created with automatic token management.

### Environment Configuration

Add to your `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Usage Examples

### 1. User Registration

```javascript
import { authAPI, saveAuthData } from '@/lib/api';

const handleRegister = async (formData) => {
    try {
        const response = await authAPI.register({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone
        });
        
        // Save token and user data
        saveAuthData(response.data.token, response.data.user);
        
        // Redirect to home or dashboard
        window.location.href = '/';
    } catch (error) {
        console.error('Registration error:', error.response?.data?.message);
        alert(error.response?.data?.message || 'Registration failed');
    }
};
```

### 2. User Login

```javascript
import { authAPI, saveAuthData } from '@/lib/api';

const handleLogin = async (email, password) => {
    try {
        const response = await authAPI.login(email, password);
        
        // Save token and user data
        saveAuthData(response.data.token, response.data.user);
        
        // Redirect to home
        window.location.href = '/';
    } catch (error) {
        console.error('Login error:', error.response?.data?.message);
        alert(error.response?.data?.message || 'Login failed');
    }
};
```

### 3. Create Order (Protected - Requires Login)

Update your cart checkout handler:

```javascript
import { ordersAPI, isAuthenticated } from '@/lib/api';

const handleCheckout = async () => {
    // Check if user is logged in
    if (!isAuthenticated()) {
        alert('Please login to place an order');
        window.location.href = '/login';
        return;
    }

    try {
        const orderData = {
            customerInfo: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                email: formData.email
            },
            items: cart.map(item => ({
                dishId: item.id,
                name: item.name,
                nameFr: item.nameFr,
                nameAr: item.nameAr,
                quantity: item.quantity,
                price: item.price,
                image: item.image
            })),
            eventDetails: {
                wilaya: formData.wilaya,
                location: formData.location,
                date: formData.eventDate,
                time: formData.eventTime
            },
            totalAmount: calculateTotal(),
            notes: formData.notes
        };

        const response = await ordersAPI.create(orderData);
        
        alert('Order placed successfully! Check your email for confirmation.');
        clearCart();
        window.location.href = '/orders';
    } catch (error) {
        console.error('Order error:', error.response?.data?.message);
        alert(error.response?.data?.message || 'Failed to place order');
    }
};
```

### 4. Get User Orders

```javascript
import { ordersAPI } from '@/lib/api';

const fetchOrders = async () => {
    try {
        const response = await ordersAPI.getMyOrders();
        setOrders(response.data);
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
};
```

### 5. Logout

```javascript
import { authAPI } from '@/lib/api';

const handleLogout = () => {
    authAPI.logout(); // Clears localStorage and redirects
};
```

### 6. Check Authentication Status

```javascript
import { isAuthenticated, getCurrentUser } from '@/lib/api';

// In your component
const user = getCurrentUser();
const loggedIn = isAuthenticated();

if (loggedIn) {
    console.log('User:', user.name, user.email);
}
```

## Integration with Existing Cart Page

Update `app/cart/page.tsx` handleCheckout function:

```javascript
const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check authentication FIRST
    if (!isAuthenticated()) {
        alert(language === 'ar' 
            ? 'يرجى تسجيل الدخول لتقديم الطلب' 
            : 'Veuillez vous connecter pour passer commande'
        );
        window.location.href = '/login';
        return;
    }

    // Validate form...
    if (!formData.firstName || !formData.lastName || !formData.phone) {
        alert(language === 'ar' 
            ? 'يرجى ملء جميع الحقول المطلوبة' 
            : 'Veuillez remplir tous les champs requis'
        );
        return;
    }

    // Create order via API
    try {
        const orderData = {
            customerInfo: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                email: getCurrentUser()?.email || ''
            },
            items: cart.map(item => ({
                dishId: item.id,
                name: item.name,
                nameFr: item.nameFr,
                nameAr: item.nameAr,
                quantity: item.quantity,
                price: item.price,
                image: item.image
            })),
            eventDetails: {
                wilaya: formData.wilaya,
                location: formData.location,
                date: formData.eventDate,
                time: formData.eventTime
            },
            totalAmount: calculateTotal(),
            notes: ''
        };

        const response = await ordersAPI.create(orderData);
        
        alert(language === 'ar' 
            ? 'تم تقديم الطلب بنجاح! تحقق من بريدك الإلكتروني للتأكيد.' 
            : 'Commande passée avec succès! Vérifiez votre email pour confirmation.'
        );
        
        clearCart();
        window.location.href = '/';
    } catch (error) {
        console.error('Order error:', error);
        alert(language === 'ar' 
            ? 'فشل في تقديم الطلب. يرجى المحاولة مرة أخرى.' 
            : 'Échec de la commande. Veuillez réessayer.'
        );
    }
};
```

## Header Integration

Add login/logout buttons to Header:

```javascript
import { isAuthenticated, getCurrentUser, authAPI } from '@/lib/api';

// In Header component
const user = getCurrentUser();
const loggedIn = isAuthenticated();

{loggedIn ? (
    <div className="flex items-center gap-4">
        <span>Welcome, {user.name}</span>
        <button onClick={() => authAPI.logout()}>Logout</button>
    </div>
) : (
    <div className="flex items-center gap-4">
        <Link href="/login">Login</Link>
        <Link href="/register">Sign Up</Link>
    </div>
)}
```

## Next Steps

1. ✅ Backend created and dependencies installed
2. ✅ API client created (`lib/api.js`)
3. 📝 Create `/app/login/page.tsx`
4. 📝 Create `/app/register/page.tsx`
5. 🔄 Update cart checkout to use API
6. 🔄 Update header to show login/logout
7. 📝 Create `/app/orders/page.tsx` to view user orders

---

**Backend is ready! Start it with:**
```bash
cd food-delivery-backend
npm run dev
```
