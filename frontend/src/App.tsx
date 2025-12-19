import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import OrderConfirm from './pages/OrderConfirm';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orderConfirm/:orderId" element={<OrderConfirm />} />
      <Route path="/:id" element={<ProductDetail />} />
    </Routes>
  );
}

export default App;
