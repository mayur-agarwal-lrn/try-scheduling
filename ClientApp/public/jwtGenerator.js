// This is just an example to generate JWT token in the browser
// Do not use this in production
function generateJwtToken(payload, secret) {
  const header = {
    alg: "HS256",
    typ: "JWT",
    kid: "your-key-id", // Add Key ID
  };

  function base64url(source) {
    return btoa(JSON.stringify(source))
      .replace(/=+$/, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  }

  const encodedHeader = base64url(header);
  console.log("Encoded Header:", encodedHeader);

  const encodedPayload = base64url(payload);
  console.log("Encoded Payload:", encodedPayload);

  const signature = CryptoJS.HmacSHA256(
    encodedHeader + "." + encodedPayload,
    secret
  )
    .toString(CryptoJS.enc.Base64)
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  console.log("Signature:", signature);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

const payload = {
  sub: "12345", // User ID
  name: "John Doe", // User Name
  iat: Math.floor(Date.now() / 1000), // Issued At
  exp: Math.floor(Date.now() / 1000) + 3600, // Expires in 1 hour
  permissions: [
    "schedule:create",
    "schedule:read",
    "schedule:update",
    "schedule:delete",
  ], // Flatten permissions
};

const secret = "your-256-bit-secret";
const token = generateJwtToken(payload, secret);
console.log("Generated JWT Token:", token);

sessionStorage.setItem("qmSchedulingJwtToken", token);
