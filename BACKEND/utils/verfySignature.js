const crypto = require("crypto");

/**
 * Verify webook signature
 * @param {Object} payload -The request body (JSON object)
 * @param {string} signature - The Signature from headers (x-webhook-signature)
 * @param {string} secret - The shared secret key
 * @param {boolean} - True if signature matches , false otherwise
 */

function verifySignature(payload, signature, secret){
    const expected = crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");

    return signature === expected;
}

module.exports = verifySignature;