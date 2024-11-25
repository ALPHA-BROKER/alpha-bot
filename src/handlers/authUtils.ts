import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function generateToken(
  payload: object,
  expiration: string = "10m"
) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiration)
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  return jwtVerify(token, SECRET);
}
