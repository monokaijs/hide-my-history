export async function encryptWithPassword(text: string, password: string) {
  const enc = new TextEncoder();
  const alg = {name: 'AES-GCM', length: 256};
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), {name: 'PBKDF2'}, false, ['deriveKey']);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.deriveKey({
    name: 'PBKDF2',
    salt: salt,
    iterations: 100000,
    hash: 'SHA-256'
  }, keyMaterial, alg, false, ['encrypt', 'decrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({name: 'AES-GCM', iv: iv}, key, enc.encode(text));
  const combined = new Uint8Array([...iv, ...salt, ...new Uint8Array(encrypted)]);

  return btoa(String.fromCharCode.apply(null, combined));
}

export async function decryptWithPassword(encryptedString: string, password: string) {
  const dec = new TextDecoder();
  const data = Uint8Array.from(atob(encryptedString), c => c.charCodeAt(0));
  const iv = data.slice(0, 12);
  const salt = data.slice(12, 28);
  const cipherText = data.slice(28);
  const enc = new TextEncoder();
  const alg = {name: 'AES-GCM', length: 256};
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), {name: 'PBKDF2'}, false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey({
    name: 'PBKDF2',
    salt: salt,
    iterations: 100000,
    hash: 'SHA-256'
  }, keyMaterial, alg, false, ['encrypt', 'decrypt']);
  const decrypted = await crypto.subtle.decrypt({name: 'AES-GCM', iv: iv}, key, cipherText);

  return dec.decode(decrypted);
}

async function generateRSAKeyPair() {
  return crypto.subtle.generateKey({
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: {name: "SHA-256"},
  }, true, ["encrypt", "decrypt"]);
}

async function exportKey(key: CryptoKey, type: any) {
  const exported = await crypto.subtle.exportKey(
    type,
    key
  );
  const exportedAsBase64 = btoa(String.fromCharCode.apply(null, new Uint8Array(exported as any)));
  return `-----BEGIN ${type === "spki" ? "PUBLIC" : "PRIVATE"} KEY-----\n${exportedAsBase64}\n-----END ${type === "spki" ? "PUBLIC" : "PRIVATE"} KEY-----`;
}

export async function generateKeyPair() {
  const {publicKey, privateKey} = await generateRSAKeyPair();
  return {
    publicKey: await exportKey(publicKey, "spki"),
    privateKey: await exportKey(privateKey, "pkcs8"),
  }
}

export async function generateKeyPairEncrypted(password: string) {
  const keyPair = await generateKeyPair();
  keyPair.privateKey = await encryptWithPassword(keyPair.privateKey, password);

  return keyPair;
}

export async function encryptDataWithPublicKey(publicKeyPem: string, data: string): Promise<string> {
  // Convert the PEM encoded public key to a format usable by the Web Crypto API
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = publicKeyPem.replace(pemHeader, '').replace(pemFooter, '').replace(/\s/g, '');
  const binaryDerString = atob(pemContents);
  const binaryDer = str2ab(binaryDerString);

  // Import the public key
  const cryptoKey = await crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );

  // Encrypt the data
  const encodedData = new TextEncoder().encode(data);
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    cryptoKey,
    encodedData
  );

  // Convert the encrypted data to Base64
  return arrayBufferToBase64(encryptedData);
}

export async function decryptDataWithPrivateKey(privateKeyPem: string, encryptedDataBase64: string): Promise<string> {
  // Convert the PEM encoded private key to a format usable by the Web Crypto API
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = privateKeyPem.replace(pemHeader, '').replace(pemFooter, '').replace(/\s/g, '');
  const binaryDerString = atob(pemContents);
  const binaryDer = str2ab(binaryDerString);

  // Import the private key
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["decrypt"]
  );

  // Convert the Base64 encoded encrypted data to an ArrayBuffer
  const encryptedData = base64ToArrayBuffer(encryptedDataBase64);

  // Decrypt the data
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    cryptoKey,
    encryptedData
  );

  // Convert the decrypted data to a string
  return new TextDecoder().decode(decryptedData);
}

// Utility function to convert Base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Utility function to convert a PEM encoded string to an ArrayBuffer
function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// Utility function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}