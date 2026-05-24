import { execSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { exportJWK, exportPKCS8, generateKeyPair } from 'jose'

const keys = await generateKeyPair('RS256', { extractable: true })
const privateKey = await exportPKCS8(keys.privateKey)
const publicKey = await exportJWK(keys.publicKey)
const jwks = JSON.stringify({ keys: [{ use: 'sig', ...publicKey }] })
const privateKeyOneLine = privateKey.trimEnd().replace(/\n/g, ' ')

writeFileSync(
  'scripts/.env.auth',
  `JWT_PRIVATE_KEY="${privateKeyOneLine}"\nJWKS=${jwks}\nSITE_URL=http://localhost:5173\n`,
  'utf8',
)

execSync('npx convex env set --from-file scripts/.env.auth --force', {
  stdio: 'inherit',
  shell: true,
})

console.log('Auth env vars configured.')
