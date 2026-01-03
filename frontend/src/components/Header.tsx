import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header style={{
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '20px 40px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link to="/" style={{
                    textDecoration: 'none',
                    color: 'white'
                }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: '2em',
                        fontWeight: 'bold',
                        letterSpacing: '1px'
                    }}>
                        🍽️ Eat Better!
                    </h1>
                </Link>

                <nav style={{
                    display: 'flex',
                    gap: '30px',
                    alignItems: 'center'
                }}>
                    <Link to="/" style={{
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '1.1em',
                        transition: 'color 0.3s'
                    }}>
                        Home
                    </Link>
                    <Link to="/cart" style={{
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '1.1em',
                        transition: 'color 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        🛒 Cart
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
