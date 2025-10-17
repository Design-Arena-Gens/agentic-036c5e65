'use client'

import { DollarSign, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Activity() {
  const { transactions } = useApp()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = formatDate(transaction.date)
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(transaction)
    return acc
  }, {} as Record<string, typeof transactions>)

  return (
    <div className="min-h-screen pb-4">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-6 safe-top">
        <h1 className="text-2xl font-bold mb-1">Activity</h1>
        <p className="text-secondary-light text-sm">Your transaction history</p>
      </div>

      <div className="px-4 -mt-4">
        {/* Transactions by Date */}
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className="bg-white rounded-2xl shadow-soft p-8 text-center text-neutral-500">
            <DollarSign size={48} className="mx-auto mb-3 text-neutral-300" />
            <p>No activity yet</p>
            <p className="text-xs mt-1">Start adding expenses to see your activity</p>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
            <div key={date} className="mb-4">
              <h2 className="text-sm font-bold text-neutral-500 mb-2 px-1">{date}</h2>
              <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                {dateTransactions.map((transaction, index) => {
                  const isPayment = transaction.type === 'payment'
                  const youPaid = transaction.paidBy === 'You'
                  const splitAmount = transaction.amount / (transaction.splitWith.length + 1)

                  return (
                    <div
                      key={transaction.id}
                      className={`p-4 ${index !== dateTransactions.length - 1 ? 'border-b border-neutral-100' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isPayment
                              ? 'bg-secondary/20'
                              : youPaid
                              ? 'bg-positive/20'
                              : 'bg-negative/20'
                          }`}
                        >
                          {isPayment ? (
                            <DollarSign size={20} className="text-secondary" />
                          ) : youPaid ? (
                            <ArrowUpRight size={20} className="text-positive" />
                          ) : (
                            <ArrowDownLeft size={20} className="text-negative" />
                          )}
                        </div>

                        {/* Transaction Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-neutral-800 truncate">
                                {transaction.description}
                              </p>
                              <p className="text-xs text-neutral-500 mt-0.5">
                                {isPayment
                                  ? `${transaction.paidBy} paid ${transaction.splitWith[0]}`
                                  : `${transaction.paidBy} paid • Split with ${transaction.splitWith.join(', ')}`}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-neutral-800">
                                ${transaction.amount.toFixed(2)}
                              </p>
                              {!isPayment && (
                                <p
                                  className={`text-xs mt-0.5 ${
                                    youPaid ? 'text-positive' : 'text-negative'
                                  }`}
                                >
                                  {youPaid ? 'You get' : 'You owe'} ${splitAmount.toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Category Badge */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-lg bg-neutral-100 text-xs text-neutral-600 font-medium">
                              {transaction.category}
                            </span>
                            {transaction.groupId && (
                              <span className="inline-flex items-center px-2 py-1 rounded-lg bg-primary/10 text-xs text-primary font-medium">
                                Group
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
