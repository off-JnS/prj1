import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()

// Hostinger sets PORT via environment variable
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// ── Contact form proxy ────────────────────────────────────────────────────────
// Replaces proxy.php — forwards form submissions to submit-form.com
app.post('/proxy.php', async (req, res) => {
    try {
        const body = new URLSearchParams(req.body).toString()
        const upstream = await fetch('https://submit-form.com/ToyVBU170', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body,
        })
        res.status(upstream.status).send(await upstream.text())
    } catch {
        res.status(502).send('Upstream error')
    }
})

// ── Static files (Vite build output) ─────────────────────────────────────────
app.use(express.static(join(__dirname, 'dist')))

// ── Fallback: unmatched routes → index.html ───────────────────────────────────
app.get('*', (_req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`PRJ1 server listening on port ${PORT}`)
})
