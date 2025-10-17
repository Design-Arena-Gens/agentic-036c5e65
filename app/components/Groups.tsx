'use client'

import { useState } from 'react'
import { Plus, ChevronRight, ArrowLeft, Users } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Groups() {
  const { groups, transactions } = useApp()
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [showAddGroup, setShowAddGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault()
    if (newGroupName.trim()) {
      // addGroup({ name: newGroupName, balance: 0, members: ['You'] })
      setNewGroupName('')
      setShowAddGroup(false)
    }
  }

  if (selectedGroup) {
    const group = groups.find(g => g.id === selectedGroup)
    if (!group) return null

    const groupTransactions = transactions.filter(t => t.groupId === group.id)

    return (
      <div className="min-h-screen pb-4">
        {/* Header */}
        <div className="bg-primary text-white px-4 py-6 safe-top">
          <button
            onClick={() => setSelectedGroup(null)}
            className="flex items-center gap-2 mb-4 text-white/90 hover:text-white transition-colors"
            aria-label="Back to groups list"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl">
              {group.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{group.name}</h1>
              <p className="text-secondary-light text-sm">{group.members.length} members</p>
            </div>
          </div>
        </div>

        <div className="px-4 -mt-4">
          {/* Balance Card */}
          <div className="bg-white rounded-2xl shadow-medium p-5 mb-4">
            <p className="text-neutral-500 text-sm mb-1">Group Balance</p>
            <p className={`text-3xl font-bold ${group.balance >= 0 ? 'text-positive' : 'text-negative'}`}>
              {group.balance >= 0 ? '+' : ''}${group.balance.toFixed(2)}
            </p>
          </div>

          {/* Members */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-neutral-800 mb-3">Members</h2>
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              {group.members.map((member, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-4 ${
                    index !== group.members.length - 1 ? 'border-b border-neutral-100' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm">
                    {member.split(' ').map(n => n[0]).join('')}
                  </div>
                  <p className="font-semibold text-neutral-800">{member}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Group Expenses */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-neutral-800 mb-3">Group Expenses</h2>
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              {groupTransactions.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">
                  <p>No expenses yet</p>
                </div>
              ) : (
                groupTransactions.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className={`p-4 ${index !== groupTransactions.length - 1 ? 'border-b border-neutral-100' : ''}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-neutral-800">{transaction.description}</p>
                      <p className="font-bold text-neutral-800">${transaction.amount.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-neutral-500">
                        {transaction.paidBy === 'You' ? 'You paid' : `${transaction.paidBy} paid`}
                      </p>
                      <p className="text-xs text-neutral-500">{transaction.date}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-4">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-6 safe-top">
        <h1 className="text-2xl font-bold mb-1">Groups</h1>
        <p className="text-secondary-light text-sm">Organize shared expenses</p>
      </div>

      <div className="px-4 -mt-4">
        {/* Add Group Button */}
        <button
          onClick={() => setShowAddGroup(!showAddGroup)}
          className="w-full bg-secondary text-white rounded-2xl py-4 font-semibold text-lg shadow-medium flex items-center justify-center gap-2 hover:bg-secondary-dark active:scale-98 transition-all duration-200 mb-4"
          aria-label="Create new group"
        >
          <Plus size={24} />
          Create Group
        </button>

        {/* Add Group Form */}
        {showAddGroup && (
          <div className="bg-white rounded-2xl shadow-soft p-4 mb-4">
            <form onSubmit={handleAddGroup}>
              <input
                type="text"
                placeholder="Group name (e.g., Weekend Trip)"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl outline-none focus:border-primary transition-colors mb-3"
                aria-label="Group name"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white rounded-xl py-2 font-semibold hover:bg-primary-dark transition-colors"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddGroup(false)
                    setNewGroupName('')
                  }}
                  className="flex-1 bg-neutral-200 text-neutral-700 rounded-xl py-2 font-semibold hover:bg-neutral-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Groups List */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          {groups.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">
              <Users size={48} className="mx-auto mb-3 text-neutral-300" />
              <p>No groups yet</p>
              <p className="text-xs mt-1">Create a group to organize shared expenses</p>
            </div>
          ) : (
            groups.map((group, index) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`w-full flex items-center justify-between p-4 hover:bg-neutral-50 active:bg-neutral-100 transition-colors ${
                  index !== groups.length - 1 ? 'border-b border-neutral-100' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-semibold">
                    {group.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-neutral-800">{group.name}</p>
                    <p className="text-xs text-neutral-500">{group.members.length} members</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className={`font-bold ${group.balance >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {group.balance >= 0 ? '+' : ''}${group.balance.toFixed(2)}
                  </p>
                  <ChevronRight size={20} className="text-neutral-400" />
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
