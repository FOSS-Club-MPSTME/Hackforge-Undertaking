import { useEffect, useState } from 'react'
import {
  ABOUT,
  DRAFT_KEY,
  DRIVE_UPLOAD_URL,
  FLOW,
  SUBMIT_URL,
  UNDERTAKING_PDF_URL,
} from '../data/config'
import './UndertakingForm.css'

const EMPTY = {
  name: '',
  age: '',
  phone: '',
  email: '',
  college: '',
  teamName: '',
  isOC: '',
  uploaded: '',
}

// Accepts 10-digit Indian mobile numbers, with an optional +91 prefix.
const PHONE_PATTERN = /^(\+91)?[6-9]\d{9}$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Restore values saved before a refresh.
function loadDraft() {
  try {
    const saved = localStorage.getItem(DRAFT_KEY)
    return saved ? { ...EMPTY, ...JSON.parse(saved) } : EMPTY
  } catch {
    return EMPTY
  }
}

function validate(values) {
  const errors = {}

  if (!values.name.trim()) errors.name = 'Enter your full name.'

  const age = Number(values.age)
  if (!values.age || !Number.isInteger(age) || age < 1 || age > 99) {
    errors.age = 'Enter a valid age.'
  }

  const phone = values.phone.replace(/[\s-]/g, '')
  if (!PHONE_PATTERN.test(phone)) errors.phone = 'Enter a valid 10-digit mobile number.'

  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email address.'
  if (!values.college.trim()) errors.college = 'Enter your college name.'
  if (!values.teamName.trim()) errors.teamName = 'Enter your team name.'
  if (!values.isOC) errors.isOC = 'Select Yes or No.'

  if (values.uploaded !== 'yes') {
    errors.uploaded = 'Tick this after you have uploaded the scan to Drive.'
  }

  return errors
}

function TextInput({ label, name, error, className = '', ...rest }) {
  return (
    <div className={`field ${className}`}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        {...rest}
      />
      {error && (
        <span id={`${name}-error`} className="error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

export default function UndertakingForm() {
  const [values, setValues] = useState(loadDraft)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [serverMessage, setServerMessage] = useState('')

  // Save values on every change so a refresh doesn't lose them.
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(values))
    } catch {
      // Storage may be unavailable (private mode). The form still works without it.
    }
  }, [values])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleUploadedChange = (e) => {
    setValues((prev) => ({ ...prev, uploaded: e.target.checked ? 'yes' : '' }))
    if (errors.uploaded) setErrors((prev) => ({ ...prev, uploaded: undefined }))
  }

  const reset = () => {
    setValues(EMPTY)
    setErrors({})
    setStatus('idle')
    setServerMessage('')
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      // Ignore storage errors.
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    setServerMessage('')

    const payload = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()]),
    )

    try {
      // Apps Script does not send CORS headers, so the response can't be read.
      // The request is still delivered; check the Google Sheet to confirm.
      await fetch(SUBMIT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload),
      })
      setStatus('success')
      try {
        localStorage.removeItem(DRAFT_KEY)
      } catch {
        // Ignore storage errors.
      }
    } catch {
      setStatus('error')
      setServerMessage('Could not send your details. Check your connection and try again.')
    }
  }

  return (
    <main className="page">
      <header className="intro">
        <h1 className="title">
          <span>HACK</span>
          <span>FORGE</span>
          <span className="year">2026</span>
        </h1>
        <p className="subtext">FOSS Club MPSTME × CSI MPSTME presents</p>
      </header>

      <section className="info-box">
        {ABOUT.map((text, i) => (
          <p key={i} className="about-text">
            {text}
          </p>
        ))}

        <h2 className="flow-label">Event flow</h2>
        <ol className="flow">
          {FLOW.map((item) => (
            <li key={item.step} className="flow-step">
              <span className="flow-num">{item.step}</span>
              <div>
                <h3>{item.title}</h3>
                <p className="flow-when">{item.when}</p>

                {item.tracks && (
                  <ul className="tracks">
                    {item.tracks.map((track) => (
                      <li key={track.name}>
                        <strong>{track.name}:</strong> {track.line}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {status === 'success' ? (
        <section className="form-card" aria-live="polite">
          <h2>Undertaking received</h2>
          <p className="lead">
            Your details have been submitted.
          </p>
          <button type="button" className="ghost" onClick={reset}>
            Submit another
          </button>
        </section>
      ) : (
        <section className="form-card" aria-labelledby="form-title">
          <h2 id="form-title">Undertaking form</h2>
          <p className="lead">All fields are required.</p>

          <form className="uf" onSubmit={handleSubmit} noValidate>
            <div className="grid">
              <TextInput
                label="Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={errors.name}
                autoComplete="name"
                className="full"
              />

              <TextInput
                label="Age"
                name="age"
                type="number"
                inputMode="numeric"
                min="1"
                max="99"
                value={values.age}
                onChange={handleChange}
                error={errors.age}
              />

              <TextInput
                label="Phone"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
                error={errors.phone}
                autoComplete="tel"
                placeholder="+91 ----- -----"
              />

              <TextInput
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                autoComplete="email"
              />

              <TextInput
                label="College name"
                name="college"
                value={values.college}
                onChange={handleChange}
                error={errors.college}
                autoComplete="organization"
              />

              <TextInput
                label="Team name"
                name="teamName"
                value={values.teamName}
                onChange={handleChange}
                error={errors.teamName}
                className="full"
              />

              <fieldset className="field full choice-field">
                <legend>Are you OC?</legend>
                <div className="choice">
                  {[
                    ['yes', 'Yes'],
                    ['no', 'No'],
                  ].map(([value, text]) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="isOC"
                        value={value}
                        checked={values.isOC === value}
                        onChange={handleChange}
                      />
                      {text}
                    </label>
                  ))}
                </div>
                {errors.isOC && (
                  <span className="error" role="alert">
                    {errors.isOC}
                  </span>
                )}
              </fieldset>

              <fieldset className="field full">
                <legend>Upload the signed photo of the undertaking</legend>
                <p className="hint">
                  Scan or photograph the signed form and upload it to the Drive folder below.
                </p>
                <a
                  className="drive-link"
                  href={DRIVE_UPLOAD_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  UPLOAD TO GOOGLE DRIVE ↗
                </a>
                <a
                  className="pdf-link"
                  href={UNDERTAKING_PDF_URL}
                  target="_blank"
                  rel="noreferrer"
                  download
                >
                  DOWNLOAD THE UNDERTAKING FORM (PDF) ↗
                </a>

                <label className="confirm">
                  <input
                    type="checkbox"
                    name="uploaded"
                    checked={values.uploaded === 'yes'}
                    onChange={handleUploadedChange}
                  />
                  I have uploaded my signed undertaking to the Drive folder
                </label>
                {errors.uploaded && (
                  <span className="error" role="alert">
                    {errors.uploaded}
                  </span>
                )}
              </fieldset>
            </div>

            <button type="submit" className="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'SUBMITTING…' : 'SUBMIT'}{' '}
              <span aria-hidden="true">→</span>
            </button>

            {status === 'error' && (
              <p className="status error" role="alert">
                {serverMessage}
              </p>
            )}
          </form>
        </section>
      )}
    </main>
  )
}