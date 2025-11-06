# 🎯 XState Demo Project Guide

Welcome to the XState Demo Project! This project demonstrates how to elegantly handle complex frontend business logic using XState.

## 📦 Project Features

This demo project includes three core feature demonstrations:

### 1️⃣ **Complex State Management** - Shopping Cart Demo
Demonstrates how XState handles application scenarios with multiple states and complex transition logic.

**Key Features:**
- 📦 Product management (add, remove, update quantity)
- 💰 Price calculation and discount application
- 🔄 State transitions (empty cart → active cart → processing → success)
- ✅ Fully declarative business logic

**Code Location:** [src/machines/cartMachine.js](src/machines/cartMachine.js)

### 2️⃣ **Business Logic Processing** - Form Validation Demo
Demonstrates how to centrally handle complex form validation logic within a state machine.

**Key Features:**
- 📧 Email format validation
- 🔐 Password strength validation (8 characters + uppercase letter + number)
- ✔️ Password consistency check
- 🎯 Real-time feedback and error messages
- 🧪 State machine independent of UI framework

**Code Location:** [src/machines/formMachine.js](src/machines/formMachine.js)

### 3️⃣ **Real-time Visualization** - @statelyai/inspect Integration
Integrates @statelyai/inspect to visualize state machine execution in real-time.

**Main Advantages:**
- 🔍 Real-time viewing of state transitions
- 📊 Automatic generation of state machine diagrams
- ⏮️ Support for time-travel debugging
- 🎯 Quick problem identification

**How to Enable:**
1. Check "Enable Real-time Visualization" on the demo page
2. Visit https://stately.ai/viz to view real-time data
3. Perform operations on the page and watch the state machine run in real-time

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will start at `http://localhost:5173`

### 3. Explore the Demo
- **Overview Tab**: Understand the core advantages of XState
- **Shopping Cart Demo**: Experience complex state management
- **Form Validation**: Feel the clear expression of business logic
- **Learning Guide**: Dive deep into implementation details

## 📁 Project Structure

```
src/
├── machines/
│   ├── cartMachine.js      # Shopping cart state machine
│   └── formMachine.js      # Form validation state machine
├── components/
│   ├── CartDemo.jsx        # Shopping cart demo component
│   └── FormDemo.jsx        # Form demo component
├── pages/
│   └── DemoPage.jsx        # Main demo page
├── styles/
│   ├── cartDemo.css        # Shopping cart styles
│   ├── formDemo.css        # Form styles
│   └── demoPage.css        # Page styles
├── App.jsx                 # Application entry
└── index.css               # Global styles
```

## 🔑 Core Concepts

### Three Elements of State Machines

#### 1. **States**
Define all possible states of the application

**Shopping Cart Example:**
```javascript
states: {
  empty: {},      // Cart is empty
  active: {},     // Cart has items
  withDiscount: {},  // Discount applied
  processing: {},    // Processing (payment)
  success: {}     // Payment successful
}
```

#### 2. **Context**
Store state machine data, similar to React's state

**Shopping Cart Example:**
```javascript
context: {
  items: [],           // Product list
  total: 0,           // Total price
  discountCode: '',   // Discount code
  appliedDiscount: 0  // Discount percentage
}
```

#### 3. **Events**
Events that trigger state transitions

**Shopping Cart Example:**
```javascript
// Event examples
ADD_ITEM        // Add item
REMOVE_ITEM     // Remove item
APPLY_DISCOUNT  // Apply discount
CHECKOUT        // Checkout
```

## 🎓 Learning Resources

### Official Documentation
- [XState Official Documentation](https://stately.ai/docs/xstate)
- [Stately Studio](https://stately.ai/studio)
- [@statelyai/inspect Documentation](https://github.com/statelyai/inspect)

### Core APIs

#### `setup().createMachine()`
Main entry point for creating state machines:

```javascript
import { setup, assign } from 'xstate';

export const myMachine = setup({
  types: {
    context: {},  // Context type
    events: {},   // Event type
  },
  guards: {},    // Conditional guards
  actions: {},   // Side effect handling
}).createMachine({
  id: 'my-machine',
  initial: 'idle',
  context: { /* ... */ },
  states: { /* ... */ }
});
```

#### `assign()` - Update Context
Update state machine data:

```javascript
actions: assign({
  items: ({ context, event }) => [
    ...context.items,
    event.payload
  ]
})
```

#### Conditional Guards `guard`
Check conditions before state transitions:

```javascript
SUBMIT: [
  {
    guard: ({ context }) => isFormValid(context),
    target: 'submitting'
  },
  {
    // Fallback transition when condition is not met
    actions: assign({ errors: {...} })
  }
]
```

#### Delayed Transitions `after`
Delayed state transitions, suitable for asynchronous operations:

```javascript
processing: {
  after: {
    2000: {  // Automatically transition after 2 seconds
      target: 'success'
    }
  }
}
```

## 💡 Best Practices

### ✅ Things You Should Do
1. **Keep State Machines Pure**
   - Avoid executing side effects in state machines
   - Handle API calls, logging, etc. in actions

2. **Make Full Use of Type System**
   ```javascript
   setup({
     types: {
       context: {} as { items: CartItem[] },
       events: {} as
         | { type: 'ADD_ITEM'; payload: CartItem }
         | { type: 'REMOVE_ITEM'; payload: string }
     }
   })
   ```

3. **Test State Transitions**
   ```javascript
   // State machines are independent of UI frameworks, easy to unit test
   it('should add item to cart', () => {
     const state = cartMachine.initialState;
     const nextState = state.nextEvents; // Check available events
   });
   ```

### ❌ Things to Avoid
1. Executing side effects in state machines
2. Over-complicating state machines
3. Ignoring mutual exclusivity of states
4. Using too many nested states

## 🔍 Debugging Tips

### 1. Enable @statelyai/inspect
```javascript
import { inspect } from '@statelyai/inspect';

inspect({
  url: 'https://stately.ai/viz',
  autoStart: true,
});
```

### 2. Check State in Browser Console
```javascript
// In React component
const [state, send] = useMachine(myMachine);
console.log(state);       // View current state
console.log(state.context); // View context data
```

### 3. Use Stately Studio
Visit https://stately.ai/studio to create and visualize complex state machines

## 📊 Frequently Asked Questions

### Q: What's the difference between XState and Redux?
**A:**
- XState: Based on finite state machines, state transitions explicitly declared, naturally supports visualization
- Redux: Based on single store, implicitly manages state transitions through reducers

### Q: When should I use XState?
**A:**
- ✅ Complex business logic flows
- ✅ Need state transition visualization
- ✅ Want declarative state management
- ✅ Need to reuse business logic across frameworks

### Q: Can it be used together with React Context?
**A:** Absolutely! XState is completely independent of state management solutions and can work with Context API, Redux, Zustand, etc.

## 🎯 Next Steps

1. **Deepen Understanding**: Study the state machine implementations under [src/machines/](src/machines/)
2. **Try Modifications**: Add new states or events, observe changes in visualization
3. **Practical Application**: Apply similar patterns in your projects
4. **Contribute Feedback**: Share your learning experiences and improvement suggestions

---

**Happy Learning!** 🎉

If you have questions or suggestions, feel free to submit an Issue or PR!
