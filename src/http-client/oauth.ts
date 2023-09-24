import crypto from "node:crypto";
import OAuth from "oauth-1.0a";

export function createOAuth(key: string, secret: string) {
  const hash_function_sha1 = (base_string: string, key: string) => {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  };

  return new OAuth({
    consumer: { key, secret },
    signature_method: "HMAC-SHA1",
    hash_function: hash_function_sha1,
  });
}
