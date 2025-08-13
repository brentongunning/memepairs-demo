'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Purchase, Swap } from '@/lib/tokenPair';

interface ActivityFeedProps {
  purchases: Purchase[];
  swaps: Swap[];
  isGraduated: boolean;
}

export default function ActivityFeed({ purchases, swaps, isGraduated }: ActivityFeedProps) {
  // Combine and sort activities by timestamp
  const activities = [
    ...purchases.map(p => ({ ...p, type: 'purchase' as const })),
    ...swaps.map(s => ({ ...s, type: 'swap' as const })),
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);

  const formatTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div className="glass-card p-6 rounded-2xl h-full">
      <h3 className="text-xl font-bold mb-4">Activity Feed</h3>
      
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-3 bg-dark-bg rounded-lg border border-white/5"
            >
              {activity.type === 'purchase' ? (
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-semibold text-purple-400">
                      {(activity as Purchase).buyer}
                    </div>
                    <div className="text-xs text-gray-400">
                      Bought ${(activity as Purchase).amount.toFixed(2)}
                    </div>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs text-chiefs-red">
                        Chiefs: {((activity as Purchase).chiefsAllocation / (activity as Purchase).amount * 100).toFixed(0)}%
                      </span>
                      <span className="text-xs text-eagles-green">
                        Eagles: {((activity as Purchase).eaglesAllocation / (activity as Purchase).amount * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTime(activity.timestamp)}
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-semibold text-neon-teal">
                      {(activity as Swap).isBot ? '🤖 Bot' : '👤 User'} Swap
                    </div>
                    <div className="text-xs text-gray-400">
                      {(activity as Swap).amount.toLocaleString()} {(activity as Swap).from}
                    </div>
                    <div className="text-xs text-gray-500">
                      → {(activity as Swap).from === 'chiefs' ? 'Eagles' : 'Chiefs'}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatTime(activity.timestamp)}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {activities.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No activity yet
          </div>
        )}
      </div>
    </div>
  );
}