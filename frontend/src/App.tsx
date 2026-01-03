import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import OrderConfirm from './pages/OrderConfirm';
import Layout from './components/Layout';
import './App.css';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orderConfirm/:orderId" element={<OrderConfirm />} />
        <Route path="/:id" element={<ProductDetail />} />
      </Routes>
    </Layout>
  );
}

export default App;
