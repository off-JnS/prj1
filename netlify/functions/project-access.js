import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

const MAX_PASSWORD_LENGTH = 128
const MAX_ATTEMPTS = 7
const WINDOW_MS = 10 * 60 * 1000

const attemptStore = new Map()

function json(statusCode, body) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
        },
        body: JSON.stringify(body),
    }
}

function getClientIp(event) {
    return (
        event.headers['x-nf-client-connection-ip'] ||
        event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        'unknown'
    )
}

function isRateLimited(ip) {
    const now = Date.now()
    const existing = attemptStore.get(ip)

    if (!existing || now > existing.expiresAt) {
        return false
    }

    return existing.count >= MAX_ATTEMPTS
}

function recordAttempt(ip) {
    const now = Date.now()
    const existing = attemptStore.get(ip)

    if (!existing || now > existing.expiresAt) {
        attemptStore.set(ip, {
            count: 1,
            expiresAt: now + WINDOW_MS,
        })
        return
    }

    existing.count += 1
    attemptStore.set(ip, existing)
}

function resetAttempts(ip) {
    attemptStore.delete(ip)
}

function isAllowedRedirect(urlString) {
    let target

    try {
        target = new URL(urlString)
    } catch {
        return false
    }

    if (target.protocol !== 'https:') {
        return false
    }

    const allowedHostsRaw = process.env.ALLOWED_REDIRECT_HOSTS || ''
    if (!allowedHostsRaw.trim()) {
        return true
    }

    const allowedHosts = allowedHostsRaw
        .split(',')
        .map((host) => host.trim().toLowerCase())
        .filter(Boolean)

    if (allowedHosts.length === 0) {
        return true
    }

    return allowedHosts.includes(target.hostname.toLowerCase())
}

export async function handler(event) {
    if (event.httpMethod !== 'POST') {
        return json(405, { success: false, message: 'Method not allowed.' })
    }

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        return json(500, { success: false, message: 'Service unavailable.' })
    }

    const ip = getClientIp(event)
    if (isRateLimited(ip)) {
        return json(429, { success: false, message: 'Too many attempts. Try again later.' })
    }

    let password = ''
    try {
        const parsedBody = JSON.parse(event.body || '{}')
        password = String(parsedBody.password || '').trim()
    } catch {
        recordAttempt(ip)
        return json(400, { success: false, message: 'Invalid request.' })
    }

    if (!password || password.length > MAX_PASSWORD_LENGTH) {
        recordAttempt(ip)
        return json(400, { success: false, message: 'Invalid request.' })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    })

    const { data, error } = await supabase
        .from('project_access')
        .select('password_hash, project_url, is_active')
        .eq('is_active', true)
        .limit(200)

    if (error || !Array.isArray(data)) {
        return json(500, { success: false, message: 'Service unavailable.' })
    }

    for (const row of data) {
        if (!row?.password_hash || !row?.project_url) {
            continue
        }

        const isMatch = await bcrypt.compare(password, row.password_hash)
        if (!isMatch) {
            continue
        }

        if (!isAllowedRedirect(row.project_url)) {
            return json(403, { success: false, message: 'Access denied.' })
        }

        resetAttempts(ip)
        return json(200, {
            success: true,
            url: row.project_url,
        })
    }

    recordAttempt(ip)
    return json(401, {
        success: false,
        message: 'Invalid credentials.',
    })
}
