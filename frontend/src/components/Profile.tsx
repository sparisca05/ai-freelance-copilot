import { useState } from 'react'

export type UserProfile = {
  full_name: string
  headline: string
  years_experience: string
  primary_role: string
  skills: string[]
  bio: string
}

type ProfileProps = {
  email: string | null | undefined
  profile: UserProfile
  onSaveProfile: (nextProfile: UserProfile) => void
  onGoToDashboard: () => void
  onSignOut: () => void
}

function Profile({ email, profile, onSaveProfile, onGoToDashboard, onSignOut }: ProfileProps) {
  const [formData, setFormData] = useState<UserProfile>(profile)
  const [isEditing, setIsEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [newSkillInput, setNewSkillInput] = useState('')

  const updateField = (field: keyof UserProfile, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleEditToggle = () => {
    setMessage('')
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData(profile)
    setMessage('')
    setNewSkillInput('')
    setIsEditing(false)
  }

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim()
    if (!trimmed || formData.skills.includes(trimmed)) {
      return
    }
    setFormData((current) => ({
      ...current,
      skills: [...current.skills, trimmed],
    }))
    setNewSkillInput('')
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((current) => ({
      ...current,
      skills: current.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  const handleKeyDownSkillInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddSkill()
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSaveProfile(formData)
    setMessage('Profile updated successfully.')
    setIsEditing(false)
  }

  return (
    <main className="auth-page" style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <section className="card" style={{ maxWidth: '900px', width: '100%', padding: '1.5rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ margin: 0 }}>Profile</h1>
            <p className="subtle" style={{ marginBottom: 0 }}>
              {email}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'start' }}>
            <button
              type="button"
              onClick={onGoToDashboard}
              style={{
                width: 'auto',
                padding: '0.5rem 1rem',
                fontSize: '0.9rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#fff',
                cursor: 'pointer',
              }}
            >
              Dashboard
            </button>
            <button
              className="button"
              onClick={onSignOut}
              style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.9rem', marginTop: 0 }}
            >
              Sign out
            </button>
          </div>
        </header>

        {message ? <p className="status success">{message}</p> : null}

        <form onSubmit={handleSubmit} className="auth-form" style={{ gap: '1rem' }}>
          <section style={{ display: 'grid', gap: '0.75rem' }}>
            <h2 style={{ margin: 0, textAlign: 'left', fontSize: '1.2rem' }}>Personal Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label htmlFor="full_name">Full Name</label>
                <input
                  id="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(event) => updateField('full_name', event.target.value)}
                  disabled={!isEditing}
                  placeholder="Your full name"
                />
              </div>
            </div>
          </section>

          <section style={{ display: 'grid', gap: '0.75rem' }}>
            <h2 style={{ margin: 0, textAlign: 'left', fontSize: '1.2rem' }}>Professional Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label htmlFor="headline">Headline</label>
                <input
                  id="headline"
                  type="text"
                  value={formData.headline}
                  onChange={(event) => updateField('headline', event.target.value)}
                  disabled={!isEditing}
                  placeholder="Senior Full-Stack Developer"
                />
              </div>
              <div>
                <label htmlFor="primary_role">Primary Role</label>
                <input
                  id="primary_role"
                  type="text"
                  value={formData.primary_role}
                  onChange={(event) => updateField('primary_role', event.target.value)}
                  disabled={!isEditing}
                  placeholder="Frontend Engineer"
                />
              </div>
              <div>
                <label htmlFor="years_experience">Years of Experience</label>
                <input
                  id="years_experience"
                  type="text"
                  value={formData.years_experience}
                  onChange={(event) => updateField('years_experience', event.target.value)}
                  disabled={!isEditing}
                  placeholder="5"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="skillInput">Skills</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    id="skillInput"
                    type="text"
                    value={newSkillInput}
                    onChange={(event) => setNewSkillInput(event.target.value)}
                    onKeyDown={handleKeyDownSkillInput}
                    disabled={!isEditing}
                    placeholder="Type a skill and press Enter"
                    style={{
                      flex: 1,
                      border: '1px solid #c4c4c4',
                      borderRadius: '8px',
                      padding: '0.75rem',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    disabled={!isEditing || !newSkillInput.trim()}
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: isEditing && newSkillInput.trim() ? '#1f5eff' : '#ccc',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: isEditing && newSkillInput.trim() ? 'pointer' : 'not-allowed',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                    }}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {formData.skills.map((skill) => (
                    <div
                      key={skill}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: '#e8f0fe',
                        border: '1px solid #1f5eff',
                        borderRadius: '20px',
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.9rem',
                      }}
                    >
                      {skill}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#1f5eff',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            padding: '0',
                            lineHeight: '1',
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="bio">Professional Bio</label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(event) => updateField('bio', event.target.value)}
                disabled={!isEditing}
                rows={5}
                placeholder="Short summary of your experience and the value you bring to clients."
                style={{
                  border: '1px solid #c4c4c4',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  width: '100%',
                }}
              />
            </div>
          </section>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            {!isEditing ? (
              <button
                type="button"
                className="button"
                onClick={handleEditToggle}
                style={{ width: 'auto', marginTop: 0 }}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    width: 'auto',
                    padding: '0.75rem 1rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button className="button" type="submit" style={{ width: 'auto', marginTop: 0 }}>
                  Save Changes
                </button>
              </>
            )}
          </div>
        </form>
      </section>
    </main>
  )
}

export default Profile