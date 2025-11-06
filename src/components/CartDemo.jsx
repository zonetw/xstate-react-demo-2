import { useMachine } from '@xstate/react';
import { cartMachine } from '../machines/cartMachine';
import { getInspector } from '../utils/inspect';
import '../styles/cartDemo.css';

const SAMPLE_PRODUCTS = [
  { id: 1, name: 'Laptop', price: 5999, emoji: '💻' },
  { id: 2, name: 'Wireless Mouse', price: 199, emoji: '🖱️' },
  { id: 3, name: 'External Keyboard', price: 499, emoji: '⌨️' },
  { id: 4, name: 'Monitor', price: 2499, emoji: '🖥️' },
  { id: 5, name: 'Network Cable', price: 49, emoji: '🔌' },
];

export function CartDemo() {
  const [state, send] = useMachine(cartMachine, {
    inspect: getInspector(),
  });
  const { items, total, appliedDiscount, discountCode } = state.context;
  const finalPrice = total * (1 - appliedDiscount);

  return (
    <div className="cart-demo">
      <h2>🛒 Shopping Cart Demo - Complex State Management</h2>

      <div className="cart-demo-grid">
        <div className="products-section">
          <h3>📦 Product List</h3>
          <div className="products">
            {SAMPLE_PRODUCTS.map((product) => (
              <button
                key={product.id}
                className="product-btn"
                onClick={() =>
                  send({
                    type: 'ADD_ITEM',
                    payload: {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      emoji: product.emoji,
                    },
                  })
                }
              >
                <div>{product.emoji}</div>
                <div className="product-name">{product.name}</div>
                <div className="product-price">¥{product.price}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="cart-section">
          <h3>🛍️ Cart Contents</h3>
          {items.length === 0 ? (
            <div className="empty-cart">Cart is empty</div>
          ) : (
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <span className="item-emoji">{item.emoji}</span>
                    <div>
                      <div className="item-name">{item.name}</div>
                      <div className="item-price">¥{item.price}</div>
                    </div>
                  </div>
                  <div className="item-controls">
                    <button
                      onClick={() =>
                        send({
                          type: 'UPDATE_QUANTITY',
                          payload: {
                            itemId: item.id,
                            quantity: Math.max(1, item.quantity - 1),
                          },
                        })
                      }
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        send({
                          type: 'UPDATE_QUANTITY',
                          payload: { itemId: item.id, quantity: item.quantity + 1 },
                        })
                      }
                    >
                      +
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() =>
                        send({ type: 'REMOVE_ITEM', payload: item.id })
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="discount-section">
            <h4>🎟️ Discount Code</h4>
            <div className="discount-codes">
              {['SUMMER20', 'VIPFIRST', 'WELCOME10'].map((code) => (
                <button
                  key={code}
                  className={`discount-code-btn ${
                    discountCode === code ? 'active' : ''
                  }`}
                  onClick={() =>
                    send({ type: 'APPLY_DISCOUNT', payload: code })
                  }
                >
                  {code}
                </button>
              ))}
            </div>
            {discountCode && (
              <button
                className="remove-discount-btn"
                onClick={() => send({ type: 'REMOVE_DISCOUNT' })}
              >
                Remove Discount: {discountCode} ({(appliedDiscount * 100).toFixed(0)}% off)
              </button>
            )}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>¥{total.toFixed(2)}</span>
            </div>
            {appliedDiscount > 0 && (
              <div className="summary-row discount-row">
                <span>Discount:</span>
                <span>-¥{(total * appliedDiscount).toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total:</span>
              <span>¥{finalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="cart-actions">
            {state.value === 'success' ? (
              <>
                <div className="success-message">✅ Order submitted successfully!</div>
                <button
                  className="action-btn"
                  onClick={() => send({ type: 'RESTART' })}
                >
                  Continue Shopping
                </button>
              </>
            ) : (
              <>
                <button
                  className="action-btn danger"
                  onClick={() => send({ type: 'CLEAR_CART' })}
                  disabled={items.length === 0}
                >
                  Clear Cart
                </button>
                <button
                  className="action-btn primary"
                  onClick={() => send({ type: 'CHECKOUT' })}
                  disabled={items.length === 0 || state.value === 'processing'}
                >
                  {state.value === 'processing' ? 'Processing...' : 'Checkout'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="state-debug">
        <h4>📊 Current State: {state.value}</h4>
        <pre>{JSON.stringify(state.context, null, 2)}</pre>
      </div>
    </div>
  );
}
