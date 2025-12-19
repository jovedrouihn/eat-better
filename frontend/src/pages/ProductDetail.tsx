import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

interface Product {
    id: number;
    name: string;
    salePrice: string;
    __record_id: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    const handleBuy = () => {
        if (!product) return;

        const cartItem = {
            productId: product.id,
            name: product.name,
            price: product.salePrice,
            quantity: quantity,
            totalPrice: (parseFloat(product.salePrice) * quantity).toFixed(2)
        };

        const existingCartJson = localStorage.getItem('shopping_cart');
        let cart = existingCartJson ? JSON.parse(existingCartJson) : [];

        // Check if item already exists in cart, update quantity if so, or just push new item? 
        // For simplicity, let's just push a new entry or update if we want to be fancy.
        // Let's just append for now as per "list all purchased items" might imply history, 
        // but "shopping cart" implies aggregation. Let's aggregate by ID.

        const existingItemIndex = cart.findIndex((item: any) => item.productId === product.id);
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
            cart[existingItemIndex].totalPrice = (parseFloat(product.salePrice) * cart[existingItemIndex].quantity).toFixed(2);
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem('shopping_cart', JSON.stringify(cart));
        alert('Added to cart!');
        navigate('/cart');
    };

    useEffect(() => {
        // Fetching all products and filtering to find the specific one.
        // Ideally, we should use a specific endpoint like /api/products/{id} if available.
        fetch('http://localhost:5265/api/queries/products')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data: Product[]) => {
                // params.id is a string, product.id might be number. Use loose equality or conversion.
                const found = data.find(p => p.id == Number(id));
                if (found) {
                    setProduct(found);
                } else {
                    setError('Product not found in the list');
                }
                setLoading(false);
            })
            .catch(err => {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#007bff', marginBottom: '20px', display: 'inline-block' }}>
                &larr; Back to Products
            </Link>
            <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h1 style={{ marginTop: 0 }}>{product.name}</h1>
                <div style={{ fontSize: '1.2em', color: '#444', marginBottom: '20px' }}>
                    Price: <strong>${product.salePrice}</strong>
                </div>
                <div style={{ color: '#888', fontSize: '0.9em' }}>
                    <p>Internal ID: {product.id}</p>
                    <p>Record ID: {product.__record_id}</p>
                </div>

                <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="quantity" style={{ marginRight: '10px' }}>Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            style={{ padding: '5px', width: '60px' }}
                        />
                    </div>
                    <button
                        onClick={handleBuy}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '1em'
                        }}
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
