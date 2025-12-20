import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';



const OrderConfirm = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!orderId) return;

        fetch(`/api/entities/collection/order/${orderId}/items?offset=0&limit=100&sort[id]=-1`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch order items');
                return res.json();
            })
            .then(data => {
                setItems(data.items);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [orderId]);

    if (loading) return <div>Loading order details...</div>;
    if (error) return <div>Error: {error}</div>;
    console.log(items);

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ color: '#28a745', fontSize: '3em', marginBottom: '20px' }}>
                ✓
            </div>
            <h1>Order Confirmed!</h1>
            <p style={{ fontSize: '1.2em', color: '#666' }}>
                Thank you for your purchase. Your Order ID is <strong>{orderId}</strong>.
            </p>

            <div style={{ marginTop: '40px', textAlign: 'left' }}>
                <h3>Order Summary</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #ddd' }}>
                            <th style={{ padding: '10px' }}>Item ID</th>
                            <th style={{ padding: '10px' }}>Product</th>
                            <th style={{ padding: '10px' }}>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item: any) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>{item.id}</td>
                                <td style={{ padding: '10px' }}>
                                    {/* Handle potentially unresolved relation or complex object */}
                                    {typeof item.name === 'object' ? item.name.name || item.name.id : item.name}
                                </td>
                                <td style={{ padding: '10px' }}>{item.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Link
                to="/"
                style={{
                    display: 'inline-block',
                    marginTop: '40px',
                    textDecoration: 'none',
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '5px'
                }}
            >
                Continue Shopping
            </Link>
        </div>
    );
};

export default OrderConfirm;
