import bcrypt from 'bcryptjs'

const password = process.argv[2]

if (!password) {
    console.error('Usage: npm run hash:project-password -- "YOUR_PASSWORD"')
    process.exit(1)
}

if (password.length > 128) {
    console.error('Password is too long. Use 128 characters or fewer.')
    process.exit(1)
}

const saltRounds = 12
const hash = await bcrypt.hash(password, saltRounds)
console.log(hash)
