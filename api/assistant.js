// The webhook and its authentication secret stay on the server.
export default async function handler(req, res) {
  res.setHeader('Cache-Control','no-store')
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'})
  const token = /^Bearer (.+)$/.exec(req.headers.authorization || '')?.[1]
  if (!token) return res.status(401).json({error:'Please sign in again.'})
  const body = req.body
  if (!body || typeof body.question !== 'string' || !body.question.trim() || body.question.length>1000 || !body.context || JSON.stringify(body).length>40000) return res.status(400).json({error:'Please send a shorter question.'})
  try {
    const lookup = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyClUlfeU8qovcZKqg_gwkV1IFOoBQJFsOE', {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({idToken:token}), signal:AbortSignal.timeout(8000)
    })
    const identity = await lookup.json()
    if (!lookup.ok || !identity.users?.[0]?.localId) return res.status(401).json({error:'Your session expired. Please sign in again.'})
    const url = process.env.N8N_DLT_WEBHOOK_URL
    const secret = process.env.N8N_DLT_WEBHOOK_SECRET
    if (!url || !secret) return res.status(503).json({error:'AI connection is not configured yet. Your tracker is still available.'})
    if (new URL(url).protocol !== 'https:') throw new Error('Invalid configuration')
    const response = await fetch(url, {
      method:'POST', redirect:'error', headers:{'Content-Type':'application/json','X-DLT-Secret':secret},
      body:JSON.stringify({question:body.question.trim(), context:body.context}), signal:AbortSignal.timeout(20000)
    })
    if (!response.ok) throw new Error('Workflow unavailable')
    const result = await response.json()
    if (typeof result.reply !== 'string' || !result.reply.trim() || result.reply.length>12000) throw new Error('Invalid workflow response')
    return res.status(200).json({reply:result.reply})
  } catch {
    return res.status(502).json({error:'The assistant could not respond. Please try again shortly.'})
  }
}
