import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMainPageVisible, setIsMainPageVisible] = useState(true);
  const [cart, setCart] = useState({});

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));

    axios.get('https://fakestoreapi.com/products/categories')
      .then(response => setCategories(['All', ...response.data]))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const scrollToSection = (section) => {
    document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
    setActiveSection(section);
    setIsMainPageVisible(section === 'home');
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    scrollToSection('home');
  };

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const updatedCart = { ...prevCart };
      if (updatedCart[product.id]) {
        updatedCart[product.id].quantity += (1/2);
      } else {
        updatedCart[product.id] = { ...product, quantity: 1 };
      }
      return updatedCart;
    });
  };

  const handleBuyNow = (product) => {
    handleAddToCart(product);
    scrollToSection('cart');
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prevCart => {
      const updatedCart = { ...prevCart };
      if (updatedCart[productId]) {
        updatedCart[productId].quantity -= (1/2);
        if (updatedCart[productId].quantity <= 0) {
          delete updatedCart[productId];
        }
      }
      return updatedCart;
    });
  };

  const handleCheckout = () => {
    scrollToSection('billing');
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="App">
      <header>
        <div className="logo">
          <img src="logo1.png" alt="Logo" />
        </div>
        <div className="app-name">
          Kharido.pk
        </div>
        <nav>
          <ul>
            <li><a href="#home" onClick={() => scrollToSection('home')}>Home</a></li>
            <li><a href="#categories" onClick={() => scrollToSection('categories')}>Categories</a></li>
            <li><a href="#cart" onClick={() => scrollToSection('cart')}>Cart ({Object.keys(cart).length})</a></li>
            <li><a href="#contact" onClick={() => scrollToSection('contact')}>Contact Us</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <section id="home" className={`home ${activeSection === 'home' && isMainPageVisible ? 'active' : 'hidden'}`}>
          <img width="100%" src="Background1.png" alt="Background" />
          <h2>Our Products</h2>
          <div className="container">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.title} className="product-image" />
                <div className="product-title">{product.title}</div>
                <div className="product-price">{product.price} Rs</div>
                <div className="product-description">{product.description}</div>
                <button onClick={() => handleAddToCart(product)} className="add-to-cart">Add to Cart</button>
                <button onClick={() => handleBuyNow(product)} className="buy-now">Buy Now</button>
              </div>
            ))}
          </div>
        </section>
        <section id="categories" className={`categories box ${activeSection === 'categories' ? 'active' : 'hidden'}`}>
          <h2>Our Categories</h2>
          <div className="category-container">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>
        <section id="cart" className={`cart box ${activeSection === 'cart' ? 'active' : 'hidden'}`}>
          <h2>Your Cart</h2>
          {Object.keys(cart).length === 0 ? (
            <p>No items in your cart.</p>
          ) : (
            <div className="cart-items">
              {Object.values(cart).map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.title} className="cart-item-image" />
                  <div className="cart-item-details">
                    <div className="cart-item-title">{item.title}</div>
                    <div className="cart-item-price">{item.price} Rs</div>
                    <div className="cart-item-quantity">Quantity: {item.quantity}</div>
                    <button 
                      onClick={() => handleRemoveFromCart(item.id)} 
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {Object.keys(cart).length > 0 && (
            <div className="cart-summary">
              <h3>Bill Summary</h3>
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price (Rs)</th>
                    <th>Total Price (Rs)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(cart).map(item => (
                    <tr key={item.id}>
                      <td>{item.title}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price}</td>
                      <td>{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3"><strong>Total Amount:</strong></td>
                    <td><strong>{Object.values(cart).reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)} Rs</strong></td>
                  </tr>
                </tfoot>
              </table>
              <button className="checkout-button" onClick={handleCheckout}>Checkout</button>
            </div>
          )}
        </section>
        <section id="billing" className={`billing box ${activeSection === 'billing' ? 'active' : 'hidden'}`}>
          <h2>Billing Information</h2>
          <form onSubmit={handleFormSubmit}>
            <label htmlFor="billing-name">Name:</label>
            <input type="text" id="billing-name" name="billing-name" required />
            <label htmlFor="billing-address">Address:</label>
            <input type="text" id="billing-address" name="billing-address" required />
            <label htmlFor="billing-city">City:</label>
            <input type="text" id="billing-city" name="billing-city" required />
            <label htmlFor="billing-state">State:</label>
            <input type="text" id="billing-state" name="billing-state" required />
            <label htmlFor="billing-zip">ZIP Code:</label>
            <input type="text" id="billing-zip" name="billing-zip" required />
            <label htmlFor="billing-payment">Payment Method:</label>
            <select id="billing-payment" name="billing-payment" required>
              <option value="credit-card">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
            <button type="submit">Complete Purchase</button>
          </form>
        </section>
        <section id="contact" className={`contact box ${activeSection === 'contact' ? 'active' : 'hidden'}`}>
          <h2>Contact Us</h2>
          <form onSubmit={handleFormSubmit}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" required></textarea>
            <button type="submit">Send</button>
          </form>
        </section>
      </main>
      <footer>
        <div className="footer">
          <div className="footer-container">
            <div className="footer-column">
              <h3>Kharido.pk</h3>
              <p>At Kharido.pk, we are passionate about providing exceptional products and an unparalleled shopping experience.</p>
            </div>
            <div className="footer-column">
              <h3>LINKS</h3>
              <p><a href="#home">Home</a></p>
              <p><a href="#categories">Categories</a></p>
              <p><a href="#cart">Cart</a></p>
              <p><a href="#contact">Contact Us</a></p>
            </div>
            <div className="footer-column">
              <h3>SOCIAL</h3>
              <p><a href="#facebook">Facebook</a></p>
              <p><a href="#instagram">Instagram</a></p>
              <p><a href="#twitter">Twitter</a></p>
              <p><a href="#linkedin">LinkedIn</a></p>
            </div>
          </div>
          <div className="footer-bottom">
            © 2023 Copyright: All Right Reserved Kharido.pk
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;