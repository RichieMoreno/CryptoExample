const express = require('express');
const app = express();
const crypto = require('crypto');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.post('/encrypt', (req, res) => {
  const encrypted = encryptAES(req.body.text);
    // res.send("HO");
  res.send({data: encrypted});
});

app.post('/decrypt', (req, res) => {
    const decrypt = decryptAES(req.body.key, req.body.iv, req.body.encrypted);
    res.send({data: decrypt});
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});

/**
 * Cifra una cadena de texto con el algoritmo aes256 a partir de una llave
 * @param {String} key llave de cifrado
 * @param {String} value valor a cifrar
 */
function encryptAES(value) {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(value);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {key: key.toString('hex'), iv: iv.toString('hex'), encrypted: encrypted.toString('hex')};
}

/**
 * Descifra una cadena de texto con el algoritmo aes256 a partir de una llave
 * @param {String} key llave de descifrado
 * @param {String} value valor a descifrar
 */
function decryptAES(key, iv, encrypted){
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(encrypted, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

/**
 * Cifra una cadena de texto de forma asímétrica utilizando la llave pública obtenída en el método #publicRSAKey
 * @param {String} value valor a cifrar
 */
function encryptRSA(value) {
    const buffer = Buffer.from(value);
    const encrypted = crypto.publicEncrypt(publicRSAKey(), buffer);
    return encrypted.toString("base64");
}

/**
 * Descifra una cadena de texto de forma asímétrica utilizando la llave privada obtenída en el método #privateRSAKey
 * @param {*} value
 */
function decryptRSA(value) {
    const buffer = Buffer.from(value, "base64");
    const decrypted = crypto.privateDecrypt(privateRSAKey(), buffer);
    return decrypted.toString("utf8");
}
