import { useState } from 'react';
import { CartDemo } from '../components/CartDemo';
import { FormDemo } from '../components/FormDemo';
import '../styles/demoPage.css';

export function DemoPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="demo-page">
      <header className="demo-header">
        <div className="header-content">
          <h1>🎯 XState Demo Hall</h1>
          <p>Demonstrating how XState elegantly handles complex business logic</p>
        </div>
      </header>

      <nav className="demo-nav">
        <button
          className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📖 Overview
        </button>
        <button
          className={`nav-btn ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          🛒 Shopping Cart Demo
        </button>
        <button
          className={`nav-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          📝 Form Validation
        </button>
        <button
          className={`nav-btn ${activeTab === 'guide' ? 'active' : ''}`}
          onClick={() => setActiveTab('guide')}
        >
          📚 Learning Guide
        </button>
      </nav>

      <main className="demo-content">
        {activeTab === 'overview' && (
          <section className="tab-content">
            <div className="overview">
              <h2>Why Choose XState?</h2>

              <div className="benefits-grid">
                <div className="benefit-card">
                  <div className="benefit-icon">🏗️</div>
                  <h3>Complex State Management</h3>
                  <p>
                    Using finite state machine (FSM) theory, declaratively define application states and transition rules, eliminating ghost states
                  </p>
                </div>

                <div className="benefit-card">
                  <div className="benefit-icon">🔍</div>
                  <h3>Visual Debugging</h3>
                  <p>
                    Visualize state machine execution in real-time with @statelyai/inspect, easily locate bugs, and improve development efficiency
                  </p>
                </div>

                <div className="benefit-card">
                  <div className="benefit-icon">⚙️</div>
                  <h3>Clear Business Logic</h3>
                  <p>
                    Encode complex business logic directly in state machines, with state transitions, conditional logic, and side effects clearly visible
                  </p>
                </div>

                <div className="benefit-card">
                  <div className="benefit-icon">🧪</div>
                  <h3>Easy to Test</h3>
                  <p>
                    State machines are independent of UI frameworks, making unit testing easy and ensuring business logic correctness
                  </p>
                </div>

                <div className="benefit-card">
                  <div className="benefit-icon">📱</div>
                  <h3>Framework Agnostic</h3>
                  <p>
                    Core logic is decoupled from React/Vue/Angular frameworks, allowing state machine code to be reused across projects
                  </p>
                </div>

                <div className="benefit-card">
                  <div className="benefit-icon">🎯</div>
                  <h3>Type Safe</h3>
                  <p>
                    Full TypeScript support with automatic type inference for events and context, preventing type errors
                  </p>
                </div>
              </div>

              <div className="key-features">
                <h3>🎁 Core Features Demo</h3>
                <ul>
                  <li>
                    <strong>State Machine Definition:</strong>
                    Declaratively define state transitions using <code>setup().createMachine()</code> API
                  </li>
                  <li>
                    <strong>Context Management:</strong>
                    Update state machine context data using <code>assign()</code>
                  </li>
                  <li>
                    <strong>Event System:</strong>
                    Type-safe event definitions and handling with support for event payloads
                  </li>
                  <li>
                    <strong>Conditional Guards:</strong>
                    Implement conditional transitions using <code>guard</code>
                  </li>
                  <li>
                    <strong>Async Handling:</strong>
                    Support <code>after</code> delayed transitions for easy async operations
                  </li>
                  <li>
                    <strong>Side Effects:</strong>
                    Execute side effects like API calls and logging through <code>actions</code>
                  </li>
                </ul>
              </div>

              <div className="cta-section">
                <h3>🚀 Start Experiencing Now</h3>
                <p>Click the tabs above to switch to demos and experience XState&apos;s powerful features firsthand!</p>
                <div className="cta-buttons">
                  <button
                    className="cta-btn secondary"
                    onClick={() => setActiveTab('cart')}
                  >
                    View Shopping Cart Demo
                  </button>
                   <button
                    className="cta-btn primary"
                    onClick={() => setActiveTab('form')}
                  >
                    View Form Demo →
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'cart' && (
          <section className="tab-content">
            <CartDemo />
          </section>
        )}

        {activeTab === 'form' && (
          <section className="tab-content">
            <FormDemo />
          </section>
        )}

        {activeTab === 'guide' && (
          <section className="tab-content">
            <div className="learning-guide">
              <h2>📚 XState Learning Guide</h2>

              <div className="guide-section">
                <h3>1️⃣ Basic Concepts</h3>
                <div className="guide-content">
                  <p>
                    <strong>Finite State Machine (FSM):</strong>
                    A system that is always in one of a finite number of states at any given moment, and can only transition between states through defined events.
                  </p>
                  <p>
                    <strong>Three Core Elements:</strong>
                  </p>
                  <ul>
                    <li>
                      <code>states</code>: Define all possible states (empty, active, processing, success)
                    </li>
                    <li>
                      <code>context</code>: Store the state machine&apos;s data (shopping cart items, form data, etc.)
                    </li>
                    <li>
                      <code>events</code>: Events that trigger state transitions (ADD_ITEM, SUBMIT, etc.)
                    </li>
                  </ul>
                </div>
              </div>

              <div className="guide-section">
                <h3>2️⃣ Shopping Cart Demo Analysis</h3>
                <div className="guide-content">
                  <p>
                    <strong>State Flow:</strong> empty → active/withDiscount → processing → success
                  </p>
                  <p>
                    <strong>Key Logic:</strong>
                  </p>
                  <ul>
                    <li>Adding an item in the empty state automatically transitions to active</li>
                    <li>Applying a discount code switches to the withDiscount state</li>
                    <li>Clicking checkout enters a 2-second processing state (simulating payment)</li>
                    <li>After processing completes, automatically transitions to success state to display confirmation</li>
                  </ul>
                  <p>
                    <strong>Advantages:</strong>
                    All shopping logic is fully defined in the state machine, independent of React component state, making it easy to test and maintain.
                  </p>
                </div>
              </div>

              <div className="guide-section">
                <h3>3️⃣ Form Validation Demo Analysis</h3>
                <div className="guide-content">
                  <p>
                    <strong>State Flow:</strong> idle → editing → submitting → success
                  </p>
                  <p>
                    <strong>Validation Rules Defined in State Machine:</strong>
                  </p>
                  <ul>
                    <li>
                      <code>validateEmail</code>: Check email format
                    </li>
                    <li>
                      <code>validatePassword</code>: Check password strength (8 characters + uppercase + number)
                    </li>
                    <li>Remove error messages when field validation passes, add errors when validation fails</li>
                  </ul>
                  <p>
                    <strong>Advantages:</strong>
                    Form validation logic is completely decoupled from UI components, allowing the same validation rules to be used across multiple frontend frameworks.
                  </p>
                </div>
              </div>

              <div className="guide-section">
                <h3>5️⃣ Visualization and Debugging</h3>
                <div className="guide-content">
                  <p>
                    <strong>What @statelyai/inspect does:</strong>
                  </p>
                  <ul>
                    <li>
                      Display current state and state transition process in real-time
                    </li>
                    <li>
                      Record all event dispatches and context changes
                    </li>
                    <li>
                      Support time-travel debugging (replay state change history)
                    </li>
                    <li>
                      Automatically generate state machine diagrams
                    </li>
                  </ul>
                  <p>
                    <strong>How to Enable:</strong>
                    Check the &quot;Enable Live Visualization&quot; checkbox above, then open
                    <a href="https://stately.ai/viz" target="_blank" rel="noopener noreferrer">
                      stately.ai/viz
                    </a>
                    in your browser to see the state machine execution in real-time.
                  </p>
                </div>
              </div>

              <div className="guide-section">
                <h3>6️⃣ Best Practices</h3>
                <div className="guide-content">
                  <ul>
                    <li>
                      <strong>Keep State Machines Pure:</strong>
                      Avoid executing side effects in state machines, use actions to handle them
                    </li>
                    <li>
                      <strong>Leverage the Type System:</strong>
                      Define TypeScript types to ensure type safety for events and context
                    </li>
                    <li>
                      <strong>Test State Transitions:</strong>
                      Write unit tests for each state and transition
                    </li>
                    <li>
                      <strong>Visualize State Machines:</strong>
                      Use Stately Studio or @statelyai/inspect to debug complex flows
                    </li>
                    <li>
                      <strong>Reuse State Machines:</strong>
                      Extract business logic into the machines directory for cross-project reuse
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="demo-footer">
        <p>
          🎓 For more information, visit
          <a href="https://stately.ai/docs/xstate" target="_blank" rel="noopener noreferrer">
            {' '}XState Official Documentation
          </a>
        </p>
      </footer>
    </div>
  );
}
