'use client'

import { Plus, TrendingUp, TrendingDown } from 'lucide-react'
import { useApp } from '../context/AppContext'

interface DashboardProps {
  onAddExpense: () => void
}

export default function Dashboard({ onAddExpense }: DashboardProps) {
  const { friends, groups } = useApp()

  const totalOwed = friends.filter(f => f.balance > 0).reduce((sum, f) => sum + f.balance, 0)
  const totalOwing = Math.abs(friends.filter(f => f.balance < 0).reduce((sum, f) => sum + f.balance, 0))
  const totalBalance = totalOwed - totalOwing

  return (
    <div className="min-h-screen pb-4">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-6 safe-top">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-secondary-light text-sm">Your expense overview</p>
      </div>

      {/* Balance Summary */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-medium p-5 mb-4">
          <div className="text-center mb-6">
            <p className="text-neutral-500 text-sm mb-1">Total Balance</p>
            <p className={`text-4xl font-bold ${totalBalance >= 0 ? 'text-positive' : 'text-negative'}`}>
              ${Math.abs(totalBalance).toFixed(2)}
            </p>
            <p className="text-neutral-400 text-xs mt-1">
              {totalBalance >= 0 ? 'You are owed' : 'You owe'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-positive/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-positive rounded-full p-1.5">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <p className="text-xs text-neutral-600 font-medium">You are owed</p>
              </div>
              <p className="text-2xl font-bold text-positive">${totalOwed.toFixed(2)}</p>
            </div>

            <div className="bg-negative/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-negative rounded-full p-1.5">
                  <TrendingDown size={16} className="text-white" />
                </div>
                <p className="text-xs text-neutral-600 font-medium">You owe</p>
              </div>
              <p className="text-2xl font-bold text-negative">${totalOwing.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Add Expense Button */}
        <button
          onClick={onAddExpense}
          className="w-full bg-primary text-white rounded-2xl py-4 font-semibold text-lg shadow-medium flex items-center justify-center gap-2 hover:bg-primary-dark active:scale-98 transition-all duration-200 mb-6"
          aria-label="Add new expense"
        >
          <Plus size={24} />
          Add Expense
        </button>

        {/* Recent Activity */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-neutral-800 mb-3">Your Friends</h2>
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            {friends.slice(0, 5).map((friend, index) => (
              <div
                key={friend.id}
                className={`flex items-center justify-between p-4 ${
                  index !== friends.length - 1 && index !== 4 ? 'border-b border-neutral-100' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                    {friend.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-800">{friend.name}</p>
                    <p className="text-xs text-neutral-500">
                      {friend.balance === 0 ? 'Settled up' : friend.balance > 0 ? 'Owes you' : 'You owe'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${friend.balance >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {friend.balance >= 0 ? '+' : ''}${friend.balance.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Groups Summary */}
        <div>
          <h2 className="text-lg font-bold text-neutral-800 mb-3">Your Groups</h2>
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            {groups.map((group, index) => (
              <div
                key={group.id}
                className={`flex items-center justify-between p-4 ${
                  index !== groups.length - 1 ? 'border-b border-neutral-100' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-semibold">
                    {group.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-800">{group.name}</p>
                    <p className="text-xs text-neutral-500">{group.members.length} members</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${group.balance >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {group.balance >= 0 ? '+' : ''}${group.balance.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
