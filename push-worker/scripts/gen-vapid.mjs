// Generates a VAPID key pair (P-256) in the base64url formats Web Push expects.
import { webcrypto as crypto } from 'node:crypto';
const b64u = (buf) => Buffer.from(buf).toString('base64url');
const kp = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
const pub = await crypto.subtle.exportKey('raw', kp.publicKey);
const jwk = await crypto.subtle.exportKey('jwk', kp.privateKey);
console.log('VAPID_PUBLIC_KEY=' + b64u(pub));
console.log('VAPID_PRIVATE_KEY=' + jwk.d);
console.log('\nPut VAPID_PUBLIC_KEY in app/.env as VITE_VAPID_PUBLIC_KEY, and set both as worker secrets.');
