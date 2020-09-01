const express = require('express');
const app = express();
const crypto = require('crypto');
const NodeRSA = require('node-rsa');

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => {
  res.send('Welcom to AES and RSA, encryption examples');
});

app.post('/encrypt', (req, res) => {
  const encrypted = encryptAES(req.body.text);
  res.send({data: encrypted});
});

app.post('/decrypt', (req, res) => {
    const decrypt = decryptAES(req.body.key, req.body.iv, req.body.encrypted);
    res.send({data: decrypt});
});

app.post('/encrypt-rsa', (req, res) => {
    const key = new NodeRSA({b: 256});
    key.generateKeyPair();
    const privateDer = key.exportKey('private');
    console.log("privateDer ", privateDer);
  const encrypted = key.encrypt(req.body.text, 'base64');
  res.send({data: encrypted, key: privateDer});
});

app.post('/decrypt-rsa', (req, res) => {
    const key = new NodeRSA(req.body.key,'private');
    const decrypt = key.decrypt(req.body.encrypted, 'utf8');
    res.send({data: decrypt});
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});

function encryptAES(value) {
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(value);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return {key: key.toString('hex'), iv: iv.toString('hex'), encrypted: encrypted.toString('hex')};
}

function decryptAES(key, iv, encrypted){
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(encrypted, 'hex'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
