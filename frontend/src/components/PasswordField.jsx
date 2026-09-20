import { useState } from 'react'

function PasswordField({
  id,
  label,
  value,
  onChange,
  disabled = false,
  autoComplete = 'current-password',
  placeholder = 'Password',
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <div className="password-field">
        <input
          id={id}
          className="field__input"
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="password-field__toggle"
          onClick={() => setVisible((prev) => !prev)}
          disabled={disabled}
          aria-pressed={visible}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  )
}

export default PasswordField
