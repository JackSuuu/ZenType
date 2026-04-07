import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  // Debug: list all env var keys containing GITHUB (values hidden)
  const githubKeys = Object.keys(process.env).filter((k) => k.includes('GITHUB'))
  const clientId = process.env.GITHUB_CLIENT_ID

  if (!clientId) {
    return res.status(500).json({
      error: 'GITHUB_CLIENT_ID not configured',
      available_github_keys: githubKeys,
      node_env: process.env.NODE_ENV,
    })
  }

  return res.status(200).json({ client_id: clientId })
}
