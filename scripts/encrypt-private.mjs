// Encrypts the private notes page so it can live in a public repo.
//   PRIVATE_PASSWORD='...' node scripts/encrypt-private.mjs <plain.html> [out.json]
// AES-256-GCM, key from PBKDF2-SHA256 (600k iterations). The browser decrypts with WebCrypto in app/my-prep/PrivateGate.tsx.
// Never commit the plain HTML or the password.
import { readFileSync, writeFileSync } from 'node:fs';
import { randomBytes, pbkdf2Sync, createCipheriv } from 'node:crypto';

const [, , plainPath, outPath = new URL('../app/my-prep/private.enc.json', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')] = process.argv;
const password = process.env.PRIVATE_PASSWORD;
if (!plainPath || !password) {
  console.error('usage: PRIVATE_PASSWORD=... node scripts/encrypt-private.mjs <plain.html> [out.json]');
  process.exit(1);
}
if (password.length < 16) {
  console.error('Use a password of at least 16 characters: the ciphertext is public, so strength is your only protection.');
  process.exit(1);
}
const iter = 600000;
const salt = randomBytes(16), iv = randomBytes(12);
const key = pbkdf2Sync(password, salt, iter, 32, 'sha256');
const cipher = createCipheriv('aes-256-gcm', key, iv);
const ct = Buffer.concat([cipher.update(readFileSync(plainPath, 'utf8'), 'utf8'), cipher.final(), cipher.getAuthTag()]);
writeFileSync(outPath, JSON.stringify({ v: 1, iter, salt: salt.toString('base64'), iv: iv.toString('base64'), ct: ct.toString('base64') }));
console.log('encrypted ->', outPath, '(' + ct.length + ' bytes)');
