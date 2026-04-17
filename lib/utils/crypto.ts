import crypto from "crypto";

const SECRET = process.env.PLATE_SECRET as string;
const algorithm = "aes-256-cbc";

export function encrypt(text: string) {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
        algorithm,
        Buffer.from(SECRET, 'base64'),
        iv
    );

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    console.log(Buffer.from(SECRET, 'base64'))

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string) {
    const [ivHex, encryptedHex] = text.split(":");

    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(
        algorithm,
        Buffer.from(SECRET, "base64"), // 🔥 corrigido aqui
        iv
    );

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}