import { useState, useEffect } from 'react'
import {
  Inbox, ListTodo, Activity, Box, Settings, Search,
  Plus, CheckCircle2, AlertCircle, Play, Layers,
  TerminalSquare, LayoutPanelLeft, Workflow, Hash, Zap
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'

// Initial task definitions
const INITIAL_TASKS = [
  { id: 'ZEN-402', title: 'Onboard new enterprise client: Acme Corp', status: 'triage', tags: ['Client', 'High PRI'], owner: null },
  { id: 'ZEN-401', title: 'Review Q3 financial reports', status: 'triage', tags: ['Finance'], owner: null },
  { id: 'ZEN-395', title: 'Update server SSL certificates', status: 'progress', tags: ['DevOps'], owner: 'sys' },
  { id: 'ZEN-394', title: 'Generate weekly marketing copy', status: 'progress', tags: ['AI Task'], owner: 'ai' },
  { id: 'ZEN-390', title: 'Process client invoice INV-2029', status: 'done', tags: ['Billing'], owner: 'sys' },
  { id: 'ZEN-389', title: 'Database schema migration', status: 'done', tags: ['Eng'], owner: 'sys' }
]

const CHART_DATA = [
  { val: 12 }, { val: 18 }, { val: 15 }, { val: 24 },
  { val: 28 }, { val: 22 }, { val: 35 }, { val: 40 }
]

export default function App() {
  const [activeRoute, setActiveRoute] = useState('board')
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [isSimulating, setIsSimulating] = useState(false)
  const [animatedTaskId, setAnimatedTaskId] = useState(null)

  // Simulation logic: An AI agent grabs a triage ticket and moves it to progress, then to done
  const runSimulation = () => {
    setIsSimulating(true)
    
    // Find a triage task
    const triageTask = tasks.find(t => t.status === 'triage')
    if (!triageTask) {
      alert("No tasks in Triage to simulate! Add a new task.")
      setIsSimulating(false)
      return
    }

    setAnimatedTaskId(triageTask.id)

    // Step 1: Assign to AI and move to Progress
    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === triageTask.id ? { ...t, status: 'progress', owner: 'ai' } : t))
      
      // Step 2: Complete the task
      setTimeout(() => {
        setTasks(prev => prev.map(t => t.id === triageTask.id ? { ...t, status: 'done' } : t))
        setAnimatedTaskId(null)
        setIsSimulating(false)
      }, 2500)
    }, 1500)
  }

  const handleAddNew = () => {
    const id = `ZEN-${Math.floor(Math.random() * 800 + 400)}`
    setTasks([{ id, title: 'Incoming system generated request', status: 'triage', tags: ['Auto'], owner: null }, ...tasks])
  }

  const renderBoard = () => {
    const triage = tasks.filter(t => t.status === 'triage')
    const progress = tasks.filter(t => t.status === 'progress')
    const done = tasks.filter(t => t.status === 'done')

    const renderCard = (task) => (
      <div key={task.id} className={`task-card ${animatedTaskId === task.id ? 'moving-card' : ''}`}>
        {animatedTaskId === task.id && <div className="card-bot-glow" />}
        <div className="t-id">{task.id}</div>
        <div className="t-title">{task.title}</div>
        <div className="t-footer">
          <div className="t-tags">
            {task.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
          </div>
          <div className="avatar-stack">
            {task.owner === 'ai' && <div className="user-avatar ai-avatar"><Zap size={10} color="#000" /></div>}
            {task.owner === 'sys' && <div className="user-avatar" style={{ background: '#238636' }}>SYS</div>}
            {!task.owner && <div className="user-avatar" style={{ borderStyle: 'dashed', background: 'transparent' }}>?</div>}
          </div>
        </div>
      </div>
    )

    return (
      <div className="view-area slide-in">
        <div className="view-toolbar">
          <div className="view-title">
            <LayoutPanelLeft size={20} color="#8b949e" /> Auto-Routing Board
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn-solid" onClick={runSimulation} disabled={isSimulating} style={{ opacity: isSimulating ? 0.5 : 1, background: 'linear-gradient(135deg, #1f6feb 0%, #bc8cff 100%)', color: 'white' }}>
              {isSimulating ? <Zap size={14} fill="currentColor" /> : <Play size={14} />} {isSimulating ? 'AI Processing...' : 'Simulate AI Worker'}
            </button>
            <button className="btn-solid" onClick={handleAddNew}><Plus size={14} /> New Issue</button>
          </div>
        </div>

        <div className="board-canvas">
          {/* Triage Column */}
          <div className="board-column">
            <div className="column-header">
              <AlertCircle size={14} color="#f85149" /> Triage Queue <span className="column-count">{triage.length}</span>
            </div>
            <div className="column-body">
              {triage.map(renderCard)}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="board-column">
            <div className="column-header">
              <Activity size={14} color="#58a6ff" /> Processing <span className="column-count">{progress.length}</span>
            </div>
            <div className="column-body">
              {progress.map(renderCard)}
            </div>
          </div>

          {/* Resolved Column */}
          <div className="board-column">
            <div className="column-header">
              <CheckCircle2 size={14} color="#3fb950" /> Resolved <span className="column-count">{done.length}</span>
            </div>
            <div className="column-body">
              {done.map(renderCard)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderPulse = () => (
    <div className="view-area slide-in">
      <div className="view-toolbar" style={{ paddingBottom: 32 }}>
        <div className="view-title">
          <Activity size={20} color="#8b949e" /> System Pulse
        </div>
      </div>
      
      <div className="dash-layout">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 24 }}>
          {/* Left Side: Charts */}
          <div>
            <div className="card">
              <div className="card-title"><TerminalSquare size={16} /> Autonomous Throughput (Last 8 hours)</div>
              <div style={{ height: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                     <Area type="monotone" dataKey="val" stroke="#bc8cff" fill="#bc8cff" fillOpacity={0.1} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 0 }}>
              <div className="card-title" style={{ marginBottom: 8 }}><Hash size={16} /> Worker Allocation</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Current allocation of background processes executing autonomous tickets.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>Billing & Invoice Parsing (AI)</span>
                    <span style={{ color: 'var(--text-muted)' }}>45% load</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-hover)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '45%', background: 'var(--accent-purple)' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                    <span style={{ fontWeight: 600 }}>Database Sync Workers</span>
                    <span style={{ color: 'var(--text-muted)' }}>20% load</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg-hover)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '20%', background: 'var(--accent-blue)' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Server Metrics */}
          <div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-hover)' }}>
                <div className="card-title" style={{ margin: 0 }}><Activity size={16} /> Fleet Status</div>
              </div>
              <div style={{ padding: 4 }}>
                <div className="sys-metric">
                  <span className="sm-label">Core Engine</span>
                  <span className="sm-val" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="status-dot s-green"></span> Online</span>
                </div>
                <div className="sys-metric">
                  <span className="sm-label">AI Inference</span>
                  <span className="sm-val" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span className="status-dot s-green"></span> 24ms</span>
                </div>
                <div className="sys-metric">
                  <span className="sm-label">API Gateway</span>
                  <span className="sm-val" style={{ color: 'var(--text-muted)' }}>Synched</span>
                </div>
                <div className="sys-metric">
                  <span className="sm-label">Worker Queue</span>
                  <span className="sm-val" style={{ color: 'var(--text-muted)' }}>0 Pending</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden', marginTop: 24 }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <div className="card-title" style={{ margin: 0 }}><Workflow size={16} /> Latest Runs</div>
              </div>
              <div style={{ padding: 12 }}>
                {[
                  { n: 'Generate Invoice', status: 'pass' },
                  { n: 'Daily Standup Bot', status: 'pass' },
                  { n: 'Process Payroll', status: 'fail' }
                ].map((run, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', fontSize: 13 }}>
                    <span style={{ color: 'var(--text-main)' }}>{run.n}</span>
                    <span style={{ color: run.status === 'pass' ? 'var(--accent-green)' : 'var(--accent-red)', fontFamily: 'JetBrains Mono' }}>
                      {run.status === 'pass' ? '0ms' : 'ERR'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="workspace-header">
          <div className="workspace-icon">Z</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Zentiys Internal</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Free Plan</div>
          </div>
        </div>
        
        <div className="nav-group-title">Your Views</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button className={`nav-item ${activeRoute === 'pulse' ? 'active' : ''}`} onClick={() => setActiveRoute('pulse')}>
            <Activity size={16} /> Pulse Dashboard
          </button>
          <button className="nav-item">
            <Inbox size={16} /> Inbox <span style={{ marginLeft: 'auto', background: 'var(--accent-blue)', color: 'var(--bg-app)', padding: '2px 6px', borderRadius: 10, fontSize: 10, fontWeight: 700 }}>3</span>
          </button>
          <button className={`nav-item ${activeRoute === 'board' ? 'active' : ''}`} onClick={() => setActiveRoute('board')}>
            <LayoutPanelLeft size={16} /> Auto-Dev Board
          </button>
        </nav>

        <div className="nav-group-title" style={{ marginTop: 24 }}>System</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button className="nav-item"><ListTodo size={16} /> Active Workers</button>
          <button className="nav-item"><Box size={16} /> Integrations</button>
          <button className="nav-item"><Settings size={16} /> Organization</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-nav">
          <div className="nav-breadcrumbs">
            <div className="workspace-icon" style={{ width: 16, height: 16, fontSize: 8 }}>Z</div>
            Zentiys / 
            <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>
              {activeRoute === 'board' ? 'Auto-Dev Board' : 'Pulse Dashboard'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
             <button style={{ background: 'transparent', border: '1px solid var(--border)', padding: '4px 8px', borderRadius: 4, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                <Search size={14} /> Search team... <span style={{ fontFamily: 'JetBrains Mono', padding: '0 4px', background: 'var(--bg-hover)', borderRadius: 3 }}>Ctrl K</span>
             </button>
          </div>
        </header>
        
        {activeRoute === 'board' && renderBoard()}
        {activeRoute === 'pulse' && renderPulse()}
      </main>
    </div>
  )
}
