import type { VercelRequest, VercelResponse } from '@vercel/node'

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const clientId = process.env.GITHUB_CLIENT_ID

  if (!clientId) {
    return res.status(500).json({ error: 'GITHUB_CLIENT_ID not configured' })
  }

  return res.status(200).json({ client_id: clientId })
}
