'use client'

import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Friends from './components/Friends'
import Groups from './components/Groups'
import Activity from './components/Activity'
import BottomNav from './components/BottomNav'
import AddExpenseModal from './components/AddExpenseModal'
import { AppProvider } from './context/AppContext'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAddExpense, setShowAddExpense] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onAddExpense={() => setShowAddExpense(true)} />
      case 'friends':
        return <Friends />
      case 'groups':
        return <Groups />
      case 'activity':
        return <Activity />
      default:
        return <Dashboard onAddExpense={() => setShowAddExpense(true)} />
    }
  }

  return (
    <AppProvider>
      <main className="min-h-screen pb-20 safe-bottom">
        <div className="max-w-lg mx-auto">
          {renderContent()}
        </div>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        {showAddExpense && (
          <AddExpenseModal onClose={() => setShowAddExpense(false)} />
        )}
      </main>
    </AppProvider>
  )
}
