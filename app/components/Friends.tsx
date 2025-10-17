'use client'

import { useState } from 'react'
import { Search, Plus, ChevronRight, ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Friends() {
  const { friends, transactions, settleUp } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [newFriendName, setNewFriendName] = useState('')

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault()
    if (newFriendName.trim()) {
      // addFriend({ name: newFriendName, balance: 0 })
      setNewFriendName('')
      setShowAddFriend(false)
    }
  }

  if (selectedFriend) {
    const friend = friends.find(f => f.id === selectedFriend)
    if (!friend) return null

    const friendTransactions = transactions.filter(
      t => t.splitWith.includes(friend.name) || t.paidBy === friend.name
    )

    return (
      <div className="min-h-screen pb-4">
        {/* Header */}
        <div className="bg-primary text-white px-4 py-6 safe-top">
          <button
            onClick={() => setSelectedFriend(null)}
            className="flex items-center gap-2 mb-4 text-white/90 hover:text-white transition-colors"
            aria-label="Back to friends list"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl">
              {friend.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{friend.name}</h1>
              <p className={`text-lg ${friend.balance >= 0 ? 'text-positive' : 'text-negative'}`}>
                {friend.balance === 0 ? 'Settled up' : `${friend.balance > 0 ? 'Owes you' : 'You owe'} $${Math.abs(friend.balance).toFixed(2)}`}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 -mt-4">
          {/* Actions */}
          {friend.balance !== 0 && (
            <button
              onClick={() => {
                settleUp(friend.id)
                setSelectedFriend(null)
              }}
              className="w-full bg-white text-primary rounded-2xl py-4 font-semibold text-lg shadow-medium hover:shadow-soft active:scale-98 transition-all duration-200 mb-4"
            >
              Settle Up
            </button>
          )}

          {/* Transaction History */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-neutral-800 mb-3">Transaction History</h2>
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              {friendTransactions.length === 0 ? (
                <div className="p-8 text-center text-neutral-500">
                  <p>No transactions yet</p>
                </div>
              ) : (
                friendTransactions.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className={`p-4 ${index !== friendTransactions.length - 1 ? 'border-b border-neutral-100' : ''}`}
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
        <h1 className="text-2xl font-bold mb-1">Friends</h1>
        <p className="text-secondary-light text-sm">Manage your contacts</p>
      </div>

      <div className="px-4 -mt-4">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-medium p-3 mb-4 flex items-center gap-3">
          <Search size={20} className="text-neutral-400" />
          <input
            type="search"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-neutral-800 placeholder:text-neutral-400"
            aria-label="Search friends"
          />
        </div>

        {/* Add Friend Button */}
        <button
          onClick={() => setShowAddFriend(!showAddFriend)}
          className="w-full bg-secondary text-white rounded-2xl py-4 font-semibold text-lg shadow-medium flex items-center justify-center gap-2 hover:bg-secondary-dark active:scale-98 transition-all duration-200 mb-4"
          aria-label="Add new friend"
        >
          <Plus size={24} />
          Add Friend
        </button>

        {/* Add Friend Form */}
        {showAddFriend && (
          <div className="bg-white rounded-2xl shadow-soft p-4 mb-4">
            <form onSubmit={handleAddFriend}>
              <input
                type="text"
                placeholder="Friend's name"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl outline-none focus:border-primary transition-colors mb-3"
                aria-label="Friend's name"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white rounded-xl py-2 font-semibold hover:bg-primary-dark transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddFriend(false)
                    setNewFriendName('')
                  }}
                  className="flex-1 bg-neutral-200 text-neutral-700 rounded-xl py-2 font-semibold hover:bg-neutral-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Friends List */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          {filteredFriends.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">
              <p>No friends found</p>
            </div>
          ) : (
            filteredFriends.map((friend, index) => (
              <button
                key={friend.id}
                onClick={() => setSelectedFriend(friend.id)}
                className={`w-full flex items-center justify-between p-4 hover:bg-neutral-50 active:bg-neutral-100 transition-colors ${
                  index !== filteredFriends.length - 1 ? 'border-b border-neutral-100' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                    {friend.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-neutral-800">{friend.name}</p>
                    <p className="text-xs text-neutral-500">
                      {friend.balance === 0 ? 'Settled up' : friend.balance > 0 ? 'Owes you' : 'You owe'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className={`font-bold ${friend.balance >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {friend.balance >= 0 ? '+' : ''}${friend.balance.toFixed(2)}
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
