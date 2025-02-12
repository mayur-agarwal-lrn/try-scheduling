// This is just an example to generate JWT token in the browser
// Do not use this in production
function generateJwtToken(payload, secret) {
  const header = {
    alg: "HS256",
    typ: "JWT",
    kid: "your-key-id", // Add Key ID
  };

  // Function to encode data in base64url format
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

  // Generate the signature using the secret
  const signature = CryptoJS.HmacSHA256(
    encodedHeader + "." + encodedPayload,
    secret
  )
    .toString(CryptoJS.enc.Base64)
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  console.log("Signature:", signature);

  // Return the complete JWT token
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Example payload
const payload = {
  sub: "12345", // User ID
  name: "John Doe", // User Name
  iat: Math.floor(Date.now() / 1000), // Issued At
  exp: Math.floor(Date.now() / 1000) + 60, // Expires in 1 minute
  tenantId: "myTenant123", // tenantId in the payload
  permissions: [
    "schedule:read",
    "schedule:create",
    "schedule:update",
    "schedule:delete",
  ],
};

// Secret key for signing the token
const secret = "your-256-bit-secret";
const token = generateJwtToken(payload, secret);
console.log("Generated JWT Token:", token);

// Store the token in session storage
sessionStorage.setItem("qmSchedulingJwtToken", token);
