import bcrypt from 'bcryptjs'

const MAX_PASSWORD_LENGTH = 128
const MAX_ATTEMPTS = 7
const WINDOW_MS = 10 * 60 * 1000
const PROJECT_ENDPOINT = '/api/project-access'

const attemptStore = new Map()

function json(status, payload) {
    return new Response(JSON.stringify(payload), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
        },
    })
}

function getClientIp(request) {
    return (
        request.headers.get('CF-Connecting-IP') ||
        request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
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

function isAllowedRedirect(urlString, allowedHostsRaw = '') {
    let target

    try {
        target = new URL(urlString)
    } catch {
        return false
    }

    if (target.protocol !== 'https:') {
        return false
    }

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

async function fetchActiveProjectEntries(supabaseUrl, serviceRoleKey) {
    const endpoint = new URL('/rest/v1/project_access', supabaseUrl)
    endpoint.searchParams.set('select', 'password_hash,project_url,is_active')
    endpoint.searchParams.set('is_active', 'eq.true')
    endpoint.searchParams.set('limit', '200')

    const response = await fetch(endpoint.toString(), {
        method: 'GET',
        headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
        },
    })

    if (!response.ok) {
        throw new Error('Failed to read project access rows.')
    }

    const payload = await response.json()
    return Array.isArray(payload) ? payload : []
}

async function handleProjectAccess(request, env) {
    if (request.method !== 'POST') {
        return json(405, { success: false, message: 'Method not allowed.' })
    }

    const supabaseUrl = env.SUPABASE_URL
    const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
        return json(500, { success: false, message: 'Service unavailable.' })
    }

    const ip = getClientIp(request)
    if (isRateLimited(ip)) {
        return json(429, { success: false, message: 'Too many attempts. Try again later.' })
    }

    let password = ''
    try {
        const body = await request.json()
        password = String(body?.password || '').trim()
    } catch {
        recordAttempt(ip)
        return json(400, { success: false, message: 'Invalid request.' })
    }

    if (!password || password.length > MAX_PASSWORD_LENGTH) {
        recordAttempt(ip)
        return json(400, { success: false, message: 'Invalid request.' })
    }

    let rows = []
    try {
        rows = await fetchActiveProjectEntries(supabaseUrl, serviceRoleKey)
    } catch {
        return json(500, { success: false, message: 'Service unavailable.' })
    }

    for (const row of rows) {
        if (!row?.password_hash || !row?.project_url) {
            continue
        }

        const isMatch = await bcrypt.compare(password, row.password_hash)
        if (!isMatch) {
            continue
        }

        if (!isAllowedRedirect(row.project_url, env.ALLOWED_REDIRECT_HOSTS || '')) {
            return json(403, { success: false, message: 'Access denied.' })
        }

        resetAttempts(ip)
        return json(200, {
            success: true,
            url: row.project_url,
        })
    }

    recordAttempt(ip)
    return json(401, { success: false, message: 'Invalid credentials.' })
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url)

        if (url.pathname === PROJECT_ENDPOINT) {
            return handleProjectAccess(request, env)
        }

        if (env.ASSETS) {
            return env.ASSETS.fetch(request)
        }

        return new Response('Not found', { status: 404 })
    },
}
