import { useMachine } from '@xstate/react';
import { formMachine } from '../machines/formMachine';
import { getInspector } from '../utils/inspect';
import '../styles/formDemo.css';

export function FormDemo() {
  const [state, send] = useMachine(formMachine, {
    inspect: getInspector(),
  });
  const { email, password, confirmPassword, agreeToTerms, errors } =
    state.context;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    send({
      type: 'FIELD_CHANGED',
      payload: {
        field: name,
        value: inputValue,
      },
    });

    // Validate after field blur
    if (type === 'email') {
      setTimeout(
        () => send({ type: 'VALIDATE_EMAIL', payload: value }),
        300
      );
    }
    if (name === 'password') {
      setTimeout(
        () => send({ type: 'VALIDATE_PASSWORD', payload: value }),
        300
      );
    }
    if (name === 'confirmPassword') {
      setTimeout(
        () => send({ type: 'VALIDATE_CONFIRM_PASSWORD', payload: value }),
        300
      );
    }
    if(name === 'agreeToTerms'){
      send({ type: 'AGREE_TO_TERMS', payload: checked });
    }
  };

  return (
    <div className="form-demo">
      <h2>📝 Form Validation Demo - Business Logic Handling</h2>

      {state.value === 'success' ? (
        <div className="form-success">
          <div className="success-icon">✅</div>
          <h3>Registration Successful!</h3>
          <p>Welcome to join us, {email}</p>
          <button
            className="reset-btn"
            onClick={() => send({ type: 'RESET' })}
          >
            Register Another Account
          </button>
        </div>
      ) : (
        <form
          className="form-container"
          onSubmit={(e) => {
            e.preventDefault();
            send({ type: 'SUBMIT' });
          }}
        >
          <div className="form-group">
            <label htmlFor="email">📧 Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="example@domain.com"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
            <span className="hint">
              ✓ Valid email format required (e.g., user@example.com)
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="password">🔐 Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="At least 8 characters, including uppercase letters and numbers"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
            <span className="hint">
              ✓ Minimum 8 characters + at least 1 uppercase letter + at least 1 number (e.g., MyPass123)
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">🔐 Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="agreeToTerms"
              name="agreeToTerms"
              checked={agreeToTerms}
              onChange={handleChange}
            />
            <label htmlFor="agreeToTerms">
              I agree to <a href="#terms">Terms of Service</a> and{' '}
              <a href="#privacy">Privacy Policy</a>
            </label>
            {errors.terms && (
              <span className="error-message">{errors.terms}</span>
            )}
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={state.value === 'submitting'}
          >
            {state.value === 'submitting'
              ? 'Submitting...'
              : 'Register Now'}
          </button>

          {state.value === 'editing' && Object.keys(errors).length > 0 && (
            <div className="validation-alert">
              <span>⚠️ Please fix the following errors and try again</span>
              <div className="error-list">
                {Object.entries(errors).map(([key, message]) => (
                  <div key={key} className="error-message">
                    {message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      )}

      <div className="state-debug">
        <h4>📊 Current State: {state.value}</h4>
        <div className="debug-content">
          <div className="debug-section">
            <h5>Form Data:</h5>
            <pre>
              {JSON.stringify(
                {
                  email,
                  password: password ? '••••••••' : '',
                  confirmPassword: confirmPassword ? '••••••••' : '',
                  agreeToTerms,
                },
                null,
                2
              )}
            </pre>
          </div>
          <div className="debug-section">
            <h5>Error Messages:</h5>
            <pre>{JSON.stringify(errors, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
