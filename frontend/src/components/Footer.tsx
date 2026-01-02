const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer style={{
            backgroundColor: '#34495e',
            color: 'white',
            padding: '30px 40px',
            marginTop: 'auto',
            boxShadow: '0 -2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                textAlign: 'center'
            }}>
                <h2 style={{
                    margin: '0 0 15px 0',
                    fontSize: '1.5em',
                    fontWeight: 'bold'
                }}>
                    🍽️ Eat Better!
                </h2>
                <p style={{
                    margin: '10px 0',
                    fontSize: '0.95em',
                    color: '#bdc3c7'
                }}>
                    Your journey to healthier eating starts here
                </p>
                <div style={{
                    marginTop: '20px',
                    paddingTop: '20px',
                    borderTop: '1px solid #4a5f7f',
                    fontSize: '0.9em',
                    color: '#95a5a6'
                }}>
                    © {currentYear} Eat Better! All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
