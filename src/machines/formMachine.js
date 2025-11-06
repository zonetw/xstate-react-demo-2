import { setup, assign } from 'xstate';

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
};

export const formMachine = setup({
  types: {
    context: {},
    events: {},
  },
  guards: {
    isEmailValid: ({ event }) => validateEmail(event.payload),
    isPasswordValid: ({ event }) => validatePassword(event.payload),
    isFormValid: ({ context }) => {
      return (
        context.email &&
        context.password &&
        validateEmail(context.email) &&
        validatePassword(context.password) &&
        context.agreeToTerms
      );
    },
  },
  actions: {},
}).createMachine({
  id: 'form',
  initial: 'idle',
  context: {
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    errors: {},
    submitting: false,
  },
  states: {
    idle: {
      on: {
        FIELD_CHANGED: {
          target: 'editing',
          actions: assign(({ event }) => ({
            [event.payload.field]: event.payload.value,
          })),
        },
      },
    },
    editing: {
      on: {
        FIELD_CHANGED: {
          actions: assign(({ event }) => ({
            [event.payload.field]: event.payload.value,
          })),
        },
        VALIDATE_EMAIL: [
          {
            guard: ({ event }) => validateEmail(event.payload),
            actions: assign({
              errors: ({ context }) => {
                // eslint-disable-next-line no-unused-vars
                const { email, ...rest } = context.errors;
                return rest;
              },
            }),
          },
          {
            actions: assign({
              errors: ({ context }) => ({
                ...context.errors,
                email: 'Please enter a valid email address',
              }),
            }),
          },
        ],
        VALIDATE_PASSWORD: [
          {
            guard: ({ event }) => validatePassword(event.payload),
            actions: assign({
              errors: ({ context }) => {
                // eslint-disable-next-line no-unused-vars
                const { password, ...rest } = context.errors;
                return rest;
              },
            }),
          },
          {
            actions: assign({
              errors: ({ context }) => ({
                ...context.errors,
                password: 'Password must be at least 8 characters long and contain uppercase letters and numbers',
              }),
            }),
          },
        ],
        VALIDATE_CONFIRM_PASSWORD: {
          actions: assign(({ context, event }) => {
            if (context.password !== event.payload) {
              return {
                errors: {
                  ...context.errors,
                  confirmPassword: 'The two passwords do not match',
                },
              };
            }
            // eslint-disable-next-line no-unused-vars
            const { confirmPassword, ...rest } = context.errors;
            return { errors: rest };
          }),
        },
        AGREE_TO_TERMS: {
          actions: assign({
            agreeToTerms: ({ event }) => event.payload,
          }),
        },
        SUBMIT: [
          {
            guard: ({ context }) => {
              return (
                context.email &&
                context.password &&
                context.confirmPassword &&
                context.agreeToTerms &&
                validateEmail(context.email) &&
                validatePassword(context.password) &&
                context.password === context.confirmPassword &&
                Object.keys(context.errors).length === 0
              );
            },
            target: 'submitting',
          },
          {
            actions: assign({
              errors: ({ context }) => {
                const newErrors = {};
                if (!context.email || !validateEmail(context.email)) {
                  newErrors.email = 'Please enter a valid email address';
                }
                if (!context.password || !validatePassword(context.password)) {
                  newErrors.password = 'Password must be at least 8 characters long and contain uppercase letters and numbers';
                }
                if (context.password !== context.confirmPassword) {
                  newErrors.confirmPassword = 'The two passwords do not match';
                }
                if (!context.agreeToTerms) {
                  newErrors.terms = 'Please agree to the terms of service';
                }
                return newErrors;
              },
            }),
          },
        ],
        RESET: {
          target: 'idle',
          actions: assign({
            email: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: false,
            errors: {},
          }),
        },
      },
    },
    submitting: {
      after: {
        2000: {
          target: 'success',
        },
      },
    },
    success: {
      on: {
        RESET: {
          target: 'idle',
          actions: assign({
            email: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: false,
            errors: {},
          }),
        },
      },
    },
  },
});
