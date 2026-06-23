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

const PROGRAM_IMAGE_MAP = {
  'Personal Training': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
  'Body Transformation': 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
  'Weight Loss': 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80',
  'Weight Gain': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  'Cardio': 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&q=80',
  'Strength': 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80',
  'HIIT': 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80',
  'Circuit Training': 'https://images.unsplash.com/photo-1571388208497-71bedc66e932?w=800&q=80',
  'Kick Boxing': 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80',
  'Hyrox Training': 'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?w=800&q=80',
  'Yodha Training': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
  'Hybrid Gym': 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80',
  'Group Workouts': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
}
const DEFAULT_PROGRAM_IMAGE = 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80'

function ProgramsTab({ toast }) {
  const [classes, setClasses] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [adding, setAdding] = useState(false)
  const [newForm, setNewForm] = useState({ name: '', description: '', schedule: '' })

  useEffect(() => { loadClasses() }, [])

  async function loadClasses() {
    try {
      const res = await fetch(`${API}/api/classes`)
      const data = await res.json()
      setClasses(Array.isArray(data) ? data : [])
    } catch {}
  }

  function startEdit(cls) { setEditing(cls.id); setForm({ name: cls.name, description: cls.description, schedule: cls.schedule }) }
  function cancelEdit() { setEditing(null); setForm({}) }

  async function saveEdit(id) {
    const res = await fetch(`${API}/api/classes/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(form) })
    if (res.ok) { toast('Program updated', 'success'); setEditing(null); loadClasses() }
    else toast('Update failed', 'error')
  }

  async function deleteClass(id) {
    if (!window.confirm('Delete this program? This will remove it from the public site.')) return
    const res = await fetch(`${API}/api/classes/${id}`, { method: 'DELETE', headers: authHeaders() })
    if (res.ok) { toast('Program deleted', 'success'); loadClasses() }
    else toast('Delete failed', 'error')
  }

  async function addNew() {
    const res = await fetch(`${API}/api/classes`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ ...newForm, image_url: '' }) })
    if (res.ok) { toast('Program added', 'success'); setAdding(false); setNewForm({ name: '', description: '', schedule: '' }); loadClasses() }
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
          <div className="flex flex-col gap-3 mb-4">
            <input type="text" placeholder="Name" value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} className="bg-black border border-border text-white text-sm px-3 py-2 focus:outline-none focus:border-accent" />
            <textarea placeholder="Description" value={newForm.description} onChange={(e) => setNewForm({ ...newForm, description: e.target.value })} rows={3} className="bg-black border border-border text-white text-sm px-3 py-2 focus:outline-none focus:border-accent resize-none" />
            <input type="text" placeholder="Schedule (e.g. Mon, Wed, Fri – 7:00 AM)" value={newForm.schedule} onChange={(e) => setNewForm({ ...newForm, schedule: e.target.value })} className="bg-black border border-border text-white text-sm px-3 py-2 focus:outline-none focus:border-accent" />
          </div>
          <p className="text-muted text-xs mb-4">Image is automatically assigned from the design system based on the program name.</p>
          <div className="flex gap-3">
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
                <div className="flex flex-col gap-3 mb-4">
                  <input type="text" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="bg-black border border-border text-white text-sm px-3 py-2 focus:outline-none focus:border-accent" />
                  <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={4} className="bg-black border border-border text-white text-sm px-3 py-2 focus:outline-none focus:border-accent resize-none" />
                  <input type="text" value={form.schedule || ''} onChange={(e) => setForm({ ...form, schedule: e.target.value })} placeholder="Schedule" className="bg-black border border-border text-white text-sm px-3 py-2 focus:outline-none focus:border-accent" />
                </div>
                <p className="text-muted text-xs mb-3">Image is fixed in the design — only name, description, and schedule are editable.</p>
                <div className="flex gap-3">
                  <button onClick={() => saveEdit(cls.id)} className="flex items-center gap-1 bg-accent text-black text-xs font-bold uppercase px-4 py-2"><Save size={12} /> Save</button>
                  <button onClick={cancelEdit} className="flex items-center gap-1 border border-border text-muted text-xs uppercase px-4 py-2"><X size={12} /> Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-16 h-16"
                  style={{ backgroundImage: `url(${PROGRAM_IMAGE_MAP[cls.name] || DEFAULT_PROGRAM_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium">{cls.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#E6FF00' }}>{cls.schedule}</p>
                  <p className="text-muted text-xs mt-1 line-clamp-2">{cls.description}</p>
                </div>
                <div className="flex gap-2 ml-2 flex-shrink-0">
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
    try {
      const res = await fetch(`${API}/api/pricing`)
      const data = await res.json()
      if (!Array.isArray(data)) return
      setPricing(data)
      const init = {}
      data.forEach((p) => { init[p.id] = { ...p } })
      setEdits(init)
    } catch {}
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
