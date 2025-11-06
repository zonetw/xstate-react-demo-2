import { setup, assign } from 'xstate';

export const cartMachine = setup({
  types: {
    context: {},
    events: {},
  },
  actions: {},
  guards: {},
}).createMachine({
  id: 'cart',
  initial: 'empty',
  context: {
    items: [],
    total: 0,
    discountCode: '',
    appliedDiscount: 0,
  },
  states: {
    empty: {
      on: {
        ADD_ITEM: {
          target: 'active',
          actions: assign({
            items: ({ context, event }) => [
              ...context.items,
              { id: Date.now(), ...event.payload, quantity: 1 },
            ],
            total: ({ context, event }) => context.total + event.payload.price,
          }),
        },
      },
    },
    active: {
      on: {
        ADD_ITEM: {
          actions: assign({
            items: ({ context, event }) => {
              const existingItem = context.items.find(
                (item) => item.id === event.payload.id
              );
              if (existingItem) {
                return context.items.map((item) =>
                  item.id === event.payload.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                );
              }
              return [
                ...context.items,
                { id: Date.now(), ...event.payload, quantity: 1 },
              ];
            },
            total: ({ context, event }) => context.total + event.payload.price,
          }),
        },
        REMOVE_ITEM: {
          actions: assign({
            items: ({ context, event }) =>
              context.items.filter((item) => item.id !== event.payload),
            total: ({ context, event }) => {
              const item = context.items.find((i) => i.id === event.payload);
              return context.total - (item?.price || 0);
            },
          }),
        },
        UPDATE_QUANTITY: {
          actions: assign({
            items: ({ context, event }) =>
              context.items.map((item) =>
                item.id === event.payload.itemId
                  ? { ...item, quantity: event.payload.quantity }
                  : item
              ),
            total: ({ context, event }) => {
              const item = context.items.find((i) => i.id === event.payload.itemId);
              const oldTotal = item ? item.price * item.quantity : 0;
              const newTotal = item ? item.price * event.payload.quantity : 0;
              return context.total - oldTotal + newTotal;
            },
          }),
        },
        APPLY_DISCOUNT: {
          target: 'withDiscount',
          actions: assign({
            discountCode: ({ event }) => event.payload,
            appliedDiscount: ({ event }) => {
              const discounts = {
                SUMMER20: 0.2,
                VIPFIRST: 0.3,
                WELCOME10: 0.1,
              };
              return discounts[event.payload] || 0;
            },
          }),
        },
        CHECKOUT: {
          target: 'processing',
        },
        CLEAR_CART: {
          target: 'empty',
          actions: assign({
            items: [],
            total: 0,
            discountCode: '',
            appliedDiscount: 0,
          }),
        },
      },
    },
    withDiscount: {
      on: {
        ADD_ITEM: {
          target: 'active',
          actions: assign({
            items: ({ context, event }) => [
              ...context.items,
              { id: Date.now(), ...event.payload, quantity: 1 },
            ],
            total: ({ context, event }) => context.total + event.payload.price,
            discountCode: '',
            appliedDiscount: 0,
          }),
        },
        REMOVE_DISCOUNT: {
          target: 'active',
          actions: assign({
            discountCode: '',
            appliedDiscount: 0,
          }),
        },
        CHECKOUT: {
          target: 'processing',
        },
      },
    },
    processing: {
      after: {
        2000: {
          target: 'success',
        },
      },
    },
    success: {
      on: {
        RESTART: {
          target: 'empty',
          actions: assign({
            items: [],
            total: 0,
            discountCode: '',
            appliedDiscount: 0,
          }),
        },
      },
    },
  },
});
