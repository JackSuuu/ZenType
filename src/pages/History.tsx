import React from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useHistoryStore } from '../stores/historyStore'

function formatDate(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-lg text-xs font-mono"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
      >
        {payload.map((p: any) => (
          <div key={p.dataKey} style={{ color: p.color }}>
            {p.dataKey}: {Math.round(p.value)}
          </div>
        ))}
      </div>
    )
  }
  return null
}

export const History: React.FC = () => {
  const { results, clearHistory, getBestWpm, getAverageWpm } = useHistoryStore()

  const bestWpm = getBestWpm()
  const avgWpm = getAverageWpm(10)

  // Chart data: last 30 results in chronological order
  const chartData = [...results]
    .slice(0, 30)
    .reverse()
    .map((r, i) => ({
      index: i + 1,
      wpm: r.wpm,
      acc: r.accuracy,
    }))

  if (results.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="font-serif text-4xl mb-4" style={{ color: 'var(--subtext)', opacity: 0.3 }}>
          無
        </div>
        <div className="font-mono text-sm" style={{ color: 'var(--subtext)' }}>
          no tests completed yet
        </div>
        <div className="font-serif text-xs mt-2" style={{ color: 'var(--subtext)', opacity: 0.5 }}>
          complete a test to see your history
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl" style={{ color: 'var(--text)' }}>
              history
              <span className="ml-3 font-serif text-sm" style={{ color: 'var(--secondary)', opacity: 0.8 }}>
                履歴
              </span>
            </h1>
            <div className="font-mono text-xs mt-1" style={{ color: 'var(--subtext)' }}>
              {results.length} tests recorded
            </div>
          </div>
          <button
            onClick={clearHistory}
            className="zen-btn text-xs"
            style={{ color: 'var(--error)', borderColor: 'var(--error)', opacity: 0.7 }}
          >
            clear all
          </button>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'best wpm', labelJp: '最高', value: bestWpm },
            { label: 'avg wpm', labelJp: '平均', value: avgWpm },
            { label: 'tests', labelJp: 'テスト', value: results.length },
            { label: 'avg accuracy', labelJp: '正確率', value: `${Math.round(results.slice(0,10).reduce((s,r)=>s+r.accuracy,0)/Math.min(10,results.length))}%` },
          ].map((stat) => (
            <div key={stat.label} className="zen-surface rounded-xl p-4 text-center">
              <div className="font-mono font-bold text-2xl" style={{ color: 'var(--primary)' }}>
                {stat.value}
              </div>
              <div className="font-mono text-xs mt-1" style={{ color: 'var(--subtext)' }}>
                {stat.label}
              </div>
              <div className="font-serif text-xs" style={{ color: 'var(--secondary)', opacity: 0.6 }}>
                {stat.labelJp}
              </div>
            </div>
          ))}
        </div>

        {/* Progress chart */}
        {chartData.length > 2 && (
          <div className="zen-surface rounded-xl p-5 mb-6">
            <div className="text-xs font-mono mb-3" style={{ color: 'var(--subtext)' }}>
              wpm over last {chartData.length} tests
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="index" tick={{ fontSize: 10, fill: 'var(--subtext)', fontFamily: 'Space Mono' }}
                  axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--subtext)', fontFamily: 'Space Mono' }}
                  axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="wpm" stroke="var(--primary)" strokeWidth={2}
                  dot={{ fill: 'var(--primary)', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Results table */}
        <div className="zen-surface rounded-xl overflow-hidden">
            <table className="w-full text-sm font-mono">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['wpm', 'raw', 'acc', 'mode', 'language', 'date'].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-medium tracking-wider"
                    style={{ color: 'var(--subtext)' }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.slice(0, 50).map((result, i) => (
                <motion.tr
                  key={result.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="transition-colors duration-150"
                  style={{ borderBottom: '1px solid var(--border)', opacity: i === 0 ? 1 : 0.85 }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--overlay-sm)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td className="px-4 py-2.5 font-bold" style={{ color: 'var(--primary)' }}>
                    {result.wpm}
                  </td>
                  <td className="px-4 py-2.5" style={{ color: 'var(--subtext)' }}>
                    {result.rawWpm}
                  </td>
                  <td className="px-4 py-2.5" style={{
                    color: result.accuracy >= 98 ? 'var(--correct)' :
                           result.accuracy >= 90 ? 'var(--text)' : 'var(--error)'
                  }}>
                    {result.accuracy}%
                  </td>
                  <td className="px-4 py-2.5" style={{ color: 'var(--subtext)' }}>
                    {result.mode === 'time' ? `${result.timeLimit}s` :
                     result.mode === 'words' ? `${result.wordCount}w` :
                     result.mode}
                  </td>
                  <td className="px-4 py-2.5" style={{ color: 'var(--subtext)' }}>
                    {result.language}
                  </td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--subtext)', opacity: 0.6 }}>
                    {formatDate(result.timestamp)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default History
