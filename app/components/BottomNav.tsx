'use client'

import { Home, Users, UsersRound, Activity } from 'lucide-react'

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'friends', label: 'Friends', icon: Users },
    { id: 'groups', label: 'Groups', icon: UsersRound },
    { id: 'activity', label: 'Activity', icon: Activity },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 safe-bottom z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-lg mx-auto grid grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-3 px-2 transition-all duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-neutral-500 hover:text-neutral-700 active:text-primary'
              }`}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.5 : 2}
                className="transition-transform duration-200"
              />
              <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
