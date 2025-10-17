'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface Friend {
  id: string
  name: string
  balance: number
  avatar?: string
}

export interface Group {
  id: string
  name: string
  balance: number
  members: string[]
}

export interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  paidBy: string
  splitWith: string[]
  category: string
  type: 'expense' | 'payment'
  groupId?: string
}

interface AppContextType {
  friends: Friend[]
  groups: Group[]
  transactions: Transaction[]
  addFriend: (friend: Omit<Friend, 'id'>) => void
  addGroup: (group: Omit<Group, 'id'>) => void
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  updateFriendBalance: (friendId: string, amount: number) => void
  settleUp: (friendId: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const initialFriends: Friend[] = [
  { id: '1', name: 'Sarah Chen', balance: 45.50 },
  { id: '2', name: 'Mike Johnson', balance: -32.00 },
  { id: '3', name: 'Emily Davis', balance: 18.75 },
  { id: '4', name: 'Alex Brown', balance: -12.30 },
  { id: '5', name: 'Jessica Lee', balance: 0 },
]

const initialGroups: Group[] = [
  { id: '1', name: 'Roommates', balance: 125.50, members: ['Sarah Chen', 'Mike Johnson', 'You'] },
  { id: '2', name: 'Weekend Trip', balance: -45.00, members: ['Emily Davis', 'Alex Brown', 'You'] },
  { id: '3', name: 'Office Lunch', balance: 22.50, members: ['Jessica Lee', 'Sarah Chen', 'You'] },
]

const initialTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Grocery shopping',
    amount: 89.50,
    date: '2025-10-15',
    paidBy: 'You',
    splitWith: ['Sarah Chen', 'Mike Johnson'],
    category: 'Groceries',
    type: 'expense',
  },
  {
    id: '2',
    description: 'Dinner at Italian Restaurant',
    amount: 120.00,
    date: '2025-10-14',
    paidBy: 'Emily Davis',
    splitWith: ['You', 'Alex Brown'],
    category: 'Food & Dining',
    type: 'expense',
  },
  {
    id: '3',
    description: 'Payment settled',
    amount: 50.00,
    date: '2025-10-13',
    paidBy: 'You',
    splitWith: ['Mike Johnson'],
    category: 'Payment',
    type: 'payment',
  },
  {
    id: '4',
    description: 'Electricity bill',
    amount: 85.00,
    date: '2025-10-12',
    paidBy: 'Sarah Chen',
    splitWith: ['You', 'Mike Johnson'],
    category: 'Utilities',
    type: 'expense',
    groupId: '1',
  },
]

export function AppProvider({ children }: { children: ReactNode }) {
  const [friends, setFriends] = useState<Friend[]>(initialFriends)
  const [groups, setGroups] = useState<Group[]>(initialGroups)
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)

  const addFriend = (friend: Omit<Friend, 'id'>) => {
    const newFriend = { ...friend, id: Date.now().toString() }
    setFriends([...friends, newFriend])
  }

  const addGroup = (group: Omit<Group, 'id'>) => {
    const newGroup = { ...group, id: Date.now().toString() }
    setGroups([...groups, newGroup])
  }

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: Date.now().toString() }
    setTransactions([newTransaction, ...transactions])

    // Update friend balances
    const splitAmount = transaction.amount / (transaction.splitWith.length + 1)
    transaction.splitWith.forEach(friendName => {
      const friend = friends.find(f => f.name === friendName)
      if (friend) {
        if (transaction.paidBy === 'You') {
          updateFriendBalance(friend.id, splitAmount)
        } else if (friendName === 'You') {
          const payer = friends.find(f => f.name === transaction.paidBy)
          if (payer) {
            updateFriendBalance(payer.id, -splitAmount)
          }
        }
      }
    })
  }

  const updateFriendBalance = (friendId: string, amount: number) => {
    setFriends(friends.map(f =>
      f.id === friendId ? { ...f, balance: f.balance + amount } : f
    ))
  }

  const settleUp = (friendId: string) => {
    const friend = friends.find(f => f.id === friendId)
    if (friend && friend.balance !== 0) {
      const transaction: Omit<Transaction, 'id'> = {
        description: 'Settlement',
        amount: Math.abs(friend.balance),
        date: new Date().toISOString().split('T')[0],
        paidBy: friend.balance > 0 ? friend.name : 'You',
        splitWith: [friend.balance > 0 ? 'You' : friend.name],
        category: 'Payment',
        type: 'payment',
      }
      addTransaction(transaction)
      updateFriendBalance(friendId, -friend.balance)
    }
  }

  return (
    <AppContext.Provider
      value={{
        friends,
        groups,
        transactions,
        addFriend,
        addGroup,
        addTransaction,
        updateFriendBalance,
        settleUp,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
