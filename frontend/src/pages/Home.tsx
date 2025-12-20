import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Product {
    id: number;
    name: string;
    salePrice: string;
    __record_id: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

const Home = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetching from the backend API
        fetch('/api/queries/products')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then((data: Product[]) => {
                setProducts(data);
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
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>All Products</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {products.map(product => (
                    <div key={product.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
                        <p style={{ margin: '0 0 10px 0', color: '#666' }}>Price: ${product.salePrice}</p>
                        <Link
                            to={`/${product.id}`}
                            style={{
                                display: 'inline-block',
                                padding: '8px 16px',
                                backgroundColor: '#007bff',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '4px'
                            }}
                        >
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
