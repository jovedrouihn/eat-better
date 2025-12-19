import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface CartItem {
    productId: number;
    name: string;
    price: string;
    quantity: number;
    totalPrice: string;
}

const Cart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = localStorage.getItem('shopping_cart');
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    const clearCart = () => {
        localStorage.removeItem('shopping_cart');
        setCartItems([]);
    };

    const submitOrder = async () => {
        if (!name || !phone) {
            alert('Please enter Name and Phone Number');
            return;
        }

        try {
            // 1. Sign in as temp user
            const loginRes = await fetch('http://localhost:5265/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "usernameOrEmail": "temp@cms.com",
                    "password": "Temp1!"
                }),
                credentials: 'include' // Important to receive cookies
            });

            if (!loginRes.ok) throw new Error('Login failed');

            // 2. Create Order
            const orderRes = await fetch('http://localhost:5265/api/entities/order/insert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "name": name,
                    "phone": phone
                }),
                credentials: 'include' // Send cookies
            });

            if (!orderRes.ok) throw new Error('Failed to create order');
            const orderData = await orderRes.json();
            const orderId = orderData.id;

            // 3. Insert Order Items
            for (const item of cartItems) {
                const itemRes = await fetch(`http://localhost:5265/api/entities/collection/order/${orderId}/items/insert`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "name": { "id": item.productId },
                        "count": item.quantity,
                        "parentOrder": { "id": orderId }
                    }),
                    credentials: 'include'
                });

                if (!itemRes.ok) console.error(`Failed to add item ${item.name}`);
            }

            alert('Order submitted successfully!');
            clearCart();
            navigate(`/orderConfirm/${orderId}`);

        } catch (error) {
            console.error(error);
            alert('Error submitting order');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>
                    &larr; Back to Shopping
                </Link>
                <h1>My Cart</h1>
                {cartItems.length > 0 &&
                    <button
                        onClick={clearCart}
                        style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Clear Cart
                    </button>
                }
            </div>

            {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
                    <h2>Your cart is empty</h2>
                    <p>Go back to the homepage to browse products.</p>
                </div>
            ) : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>Product</th>
                                <th style={{ padding: '10px' }}>Price</th>
                                <th style={{ padding: '10px' }}>Quantity</th>
                                <th style={{ padding: '10px' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '10px' }}>{item.name}</td>
                                    <td style={{ padding: '10px' }}>${item.price}</td>
                                    <td style={{ padding: '10px' }}>{item.quantity}</td>
                                    <td style={{ padding: '10px' }}>${item.totalPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={{ marginTop: '40px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
                        <h2>Checkout</h2>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Name (姓名):</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                style={{ padding: '8px', width: '100%', maxWidth: '300px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px' }}>Mobile Number (手机号码):</label>
                            <input
                                type="text"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                style={{ padding: '8px', width: '100%', maxWidth: '300px' }}
                            />
                        </div>
                        <button
                            onClick={submitOrder}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '1.1em'
                            }}
                        >
                            Submit Order (提交订单)
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
