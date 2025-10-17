'use client'

import { useState } from 'react'
import { X, Calendar, DollarSign, Users, Tag, Camera } from 'lucide-react'
import { useApp } from '../context/AppContext'

interface AddExpenseModalProps {
  onClose: () => void
}

export default function AddExpenseModal({ onClose }: AddExpenseModalProps) {
  const { friends, groups, addTransaction } = useApp()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'General',
    splitType: 'equal',
    splitWith: [] as string[],
    paidBy: 'You',
    groupId: '',
  })

  const categories = [
    'General',
    'Food & Dining',
    'Groceries',
    'Transportation',
    'Entertainment',
    'Utilities',
    'Shopping',
    'Healthcare',
    'Travel',
    'Other',
  ]

  const handleSubmit = () => {
    if (!formData.description || !formData.amount || formData.splitWith.length === 0) {
      alert('Please fill in all required fields')
      return
    }

    addTransaction({
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
      category: formData.category,
      paidBy: formData.paidBy,
      splitWith: formData.splitWith,
      type: 'expense',
      groupId: formData.groupId || undefined,
    })

    onClose()
  }

  const toggleSplitWith = (name: string) => {
    setFormData({
      ...formData,
      splitWith: formData.splitWith.includes(name)
        ? formData.splitWith.filter(n => n !== name)
        : [...formData.splitWith, name],
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-800">Add Expense</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 active:bg-neutral-300 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="text-neutral-600" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-1 px-4 pt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-colors ${
                i <= step ? 'bg-primary' : 'bg-neutral-200'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Basic Details</h3>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Dinner at restaurant"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl outline-none focus:border-primary transition-colors"
                  aria-label="Expense description"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Amount *
                </label>
                <div className="relative">
                  <DollarSign size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl outline-none focus:border-primary transition-colors"
                    aria-label="Expense amount"
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Date
                </label>
                <div className="relative">
                  <Calendar size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl outline-none focus:border-primary transition-colors"
                    aria-label="Expense date"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Category
                </label>
                <div className="relative">
                  <Tag size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl outline-none focus:border-primary transition-colors appearance-none bg-white"
                    aria-label="Expense category"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Split With</h3>

              {/* Paid By */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Paid By
                </label>
                <select
                  value={formData.paidBy}
                  onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl outline-none focus:border-primary transition-colors appearance-none bg-white"
                  aria-label="Who paid"
                >
                  <option value="You">You</option>
                  {friends.map((friend) => (
                    <option key={friend.id} value={friend.name}>
                      {friend.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Group (Optional) */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Group (Optional)
                </label>
                <select
                  value={formData.groupId}
                  onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-200 rounded-xl outline-none focus:border-primary transition-colors appearance-none bg-white"
                  aria-label="Select group"
                >
                  <option value="">No group</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Friends */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Split with friends *
                </label>
                <div className="space-y-2">
                  {friends.map((friend) => (
                    <button
                      key={friend.id}
                      onClick={() => toggleSplitWith(friend.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                        formData.splitWith.includes(friend.name)
                          ? 'border-primary bg-primary/5'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm">
                          {friend.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-neutral-800">{friend.name}</span>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          formData.splitWith.includes(friend.name)
                            ? 'border-primary bg-primary'
                            : 'border-neutral-300'
                        }`}
                      >
                        {formData.splitWith.includes(friend.name) && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">Split Type</h3>

              {/* Split Type Options */}
              <div className="space-y-3">
                <button
                  onClick={() => setFormData({ ...formData, splitType: 'equal' })}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    formData.splitType === 'equal'
                      ? 'border-primary bg-primary/5'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="font-semibold text-neutral-800 mb-1">Equal Split</div>
                  <div className="text-sm text-neutral-500">
                    Split the amount equally among all participants
                  </div>
                </button>

                <button
                  onClick={() => setFormData({ ...formData, splitType: 'percentage' })}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    formData.splitType === 'percentage'
                      ? 'border-primary bg-primary/5'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="font-semibold text-neutral-800 mb-1">By Percentage</div>
                  <div className="text-sm text-neutral-500">
                    Specify percentage for each person
                  </div>
                </button>

                <button
                  onClick={() => setFormData({ ...formData, splitType: 'shares' })}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    formData.splitType === 'shares'
                      ? 'border-primary bg-primary/5'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="font-semibold text-neutral-800 mb-1">By Shares</div>
                  <div className="text-sm text-neutral-500">
                    Specify shares for each person
                  </div>
                </button>
              </div>

              {/* Image Attachment */}
              <div className="pt-4">
                <button className="w-full p-4 rounded-xl border-2 border-dashed border-neutral-300 hover:border-primary transition-colors flex items-center justify-center gap-2 text-neutral-600 hover:text-primary">
                  <Camera size={20} />
                  <span className="font-medium">Attach Receipt (Optional)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 space-y-2">
          <button
            onClick={() => (step === 3 ? handleSubmit() : setStep(step + 1))}
            className="w-full bg-primary text-white rounded-xl py-4 font-semibold text-lg hover:bg-primary-dark active:scale-98 transition-all"
          >
            {step === 3 ? 'Add Expense' : 'Next'}
          </button>
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="w-full bg-neutral-100 text-neutral-700 rounded-xl py-3 font-semibold hover:bg-neutral-200 active:scale-98 transition-all"
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
