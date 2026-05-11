import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Plus, Save, Trash2, Edit2, X, Eye, EyeOff } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('fitness_lab_token')}`,
  }
}

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-6 py-3 text-sm font-medium ${
        type === 'success' ? 'bg-accent text-black' : 'bg-red-700 text-white'
      }`}
    >
      {msg}
    </div>
  )
}

function ProgramsTab({ toast }) {
  const [classes, setClasses] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [adding, setAdding] = useState(false)
  const [newForm, setNewForm] = useState({ name: '', description: '', schedule: '', image_url: '' })

  useEffect(() => { loadClasses() }, [])

  async function loadClasses() {
    const res = await fetch(`${API}/api/classes`)
    setClasses(await res.json())
  }

  function startEdit(cls) { setEditing(cls.id); setForm({ ...cls }) }
  function cancelEdit() { setEditing(null); setForm({}) }

  async function saveEdit(id) {
    const res = await fetch(`${API}/api/classes/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(form) })
    if (res.ok) { toast('Class updated', 'success'); setEditing(null); loadClasses() }
    else toast('Update failed', 'error')
  }

  async function deleteClass(id) {
    if (!window.confirm('Delete this class?')) return
    const res = await fetch(`${API}/api/classes/${id}`, { method: 'DELETE', headers: authHeaders() })
    if (res.ok) { toast('Class deleted', 'success'); loadClasses() }
    else toast('Delete failed', 'error')
  }

  async function addNew() {
    const res = await fetch(`${API}/api/classes`, { method: 'POST', headers: authHeaders(), body: JSON.stringify(newForm) })
    if (res.ok) { toast('Class added', 'success'); setAdding(false); setNewForm({ name: '', description: '', schedule: '', image_url: '' }); loadClasses() }
    else toast('Add failed', 'error')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-heading text-2xl">Programs</h2>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 bg-accent text-black text-xs font-bold uppercase tracking-widest px-4 py-2">
          <Plus size={14} /> Add Program
        </button>
      </div>

      {adding && (
        <div
          className="p-6 mb-6"
          style={{ background: 'rgba(230,255,0,0.03)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(230,255,0,0.2)' }}
        >
          <h3 className="text-white font-medium mb-4">New Program</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {['name', 'description', 'schedule', 'image_url'].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.replace('_', ' ')}
                value={newForm[field]}
                onChange={(e) => setNewForm({ ...newForm, [field]: e.target.value })}
                className="bg-black border border-border text-white text-sm px-3 py-2 focus:outline-none focus:border-accent"
              />
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={addNew} className="bg-accent text-black text-xs font-bold uppercase px-5 py-2">Save</button>
            <button onClick={() => setAdding(false)} className="border border-border text-muted text-xs uppercase px-5 py-2">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {classes.map((cls) => (
          <div key={cls.id} className="p-5" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {editing === cls.id ? (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {['name', 'description', 'schedule', 'image_url'].map((field) => (
                    <input
                      key={field}
                      type="text"
                      value={form[field] || ''}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      placeholder={field.replace('_', ' ')}
                      className="bg-black border border-border text-white text-sm px-3 py-2 focus:outline-none focus:border-accent"
                    />
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => saveEdit(cls.id)} className="flex items-center gap-1 bg-accent text-black text-xs font-bold uppercase px-4 py-2"><Save size={12} /> Save</button>
                  <button onClick={cancelEdit} className="flex items-center gap-1 border border-border text-muted text-xs uppercase px-4 py-2"><X size={12} /> Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-medium">{cls.name}</p>
                  <p className="text-muted text-sm mt-1">{cls.schedule}</p>
                  <p className="text-muted text-xs mt-1 truncate max-w-md">{cls.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => startEdit(cls)} className="text-muted hover:text-accent transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => deleteClass(cls.id)} className="text-muted hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function PricingTab({ toast }) {
  const [pricing, setPricing] = useState([])
  const [edits, setEdits] = useState({})

  useEffect(() => { loadPricing() }, [])

  async function loadPricing() {
    const res = await fetch(`${API}/api/pricing`)
    const data = await res.json()
    setPricing(data)
    const init = {}
    data.forEach((p) => { init[p.id] = { ...p } })
    setEdits(init)
  }

  async function savePricing(id) {
    const res = await fetch(`${API}/api/pricing/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(edits[id]) })
    if (res.ok) toast('Pricing updated', 'success')
    else toast('Update failed', 'error')
  }

  return (
    <div>
      <h2 className="section-heading text-2xl mb-6">Pricing Manager</h2>
      <div className="flex flex-col gap-4">
        {pricing.map((pkg) => (
          <div key={pkg.id} className="p-6" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white font-medium">{pkg.name}</p>
                {pkg.best_price && <span className="text-xs" style={{ color: '#E6FF00' }}>Best Price</span>}
              </div>
              <button onClick={() => savePricing(pkg.id)} className="flex items-center gap-1 bg-accent text-black text-xs font-bold uppercase px-4 py-2">
                <Save size={12} /> Save
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['monthly', 'quarterly', 'half_yearly', 'yearly'].map((field) => (
                <div key={field}>
                  <label className="section-label text-xs mb-1 block">{field.replace('_', ' ')}</label>
                  <input
                    type="text"
                    value={edits[pkg.id]?.[field] || ''}
                    onChange={(e) => setEdits({ ...edits, [pkg.id]: { ...edits[pkg.id], [field]: e.target.value } })}
                    className="w-full bg-black border border-border text-white text-sm px-3 py-2 focus:outline-none focus:border-accent"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AccountTab({ toast }) {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' })
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.new_password !== form.confirm_password) { toast('Passwords do not match', 'error'); return }
    setLoading(true)
    const res = await fetch(`${API}/api/auth/change-password`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) { toast('Password updated successfully', 'success'); setForm({ current_password: '', new_password: '', confirm_password: '' }) }
    else toast(data.detail || 'Update failed', 'error')
    setLoading(false)
  }

  return (
    <div className="max-w-md">
      <h2 className="section-heading text-2xl mb-6">Account Settings</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {[
          { key: 'current_password', label: 'Current Password' },
          { key: 'new_password', label: 'New Password' },
          { key: 'confirm_password', label: 'Confirm New Password' },
        ].map(({ key, label }) => (
          <div key={key} className="relative">
            <label className="section-label block mb-1">{label}</label>
            <input
              type={showPw ? 'text' : 'password'}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              required
              className="w-full bg-black border border-border text-white text-sm px-4 py-3 pr-10 focus:outline-none focus:border-accent"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 bottom-3 text-muted hover:text-white">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-black font-bold text-sm uppercase tracking-widest py-3 mt-2 hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Updating…' : 'UPDATE PASSWORD'}
        </button>
      </form>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('programs')
  const [toastMsg, setToastMsg] = useState(null)

  function showToast(msg, type) { setToastMsg({ msg, type }) }

  function logout() {
    localStorage.removeItem('fitness_lab_token')
    navigate('/owner-login')
  }

  const TABS = [
    { id: 'programs', label: 'Programs Manager' },
    { id: 'pricing', label: 'Pricing Manager' },
    { id: 'account', label: 'Account Settings' },
  ]

  return (
    <div className="min-h-screen bg-black">
      <div
        className="px-6 py-4 flex items-center justify-between sticky top-0 z-10"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <span className="font-heading font-extrabold text-lg uppercase">
          THE FITNESS <span style={{ color: '#E6FF00' }}>LAB</span> — Dashboard
        </span>
        <button onClick={logout} className="flex items-center gap-2 text-muted text-sm hover:text-red-400 transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div
        className="px-6 flex gap-0"
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-6 py-4 text-xs uppercase tracking-widest font-medium border-b-2 transition-all duration-200 ${
              tab === t.id ? 'border-accent text-white' : 'border-transparent text-muted hover:text-white'
            }`}
            style={tab === t.id ? { background: 'rgba(230,255,0,0.05)' } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6 max-w-5xl mx-auto">
        {tab === 'programs' && <ProgramsTab toast={showToast} />}
        {tab === 'pricing' && <PricingTab toast={showToast} />}
        {tab === 'account' && <AccountTab toast={showToast} />}
      </div>

      {toastMsg && <Toast msg={toastMsg.msg} type={toastMsg.type} onClose={() => setToastMsg(null)} />}
    </div>
  )
}
