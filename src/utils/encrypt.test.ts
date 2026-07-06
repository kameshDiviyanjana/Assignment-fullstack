import { describe, it, expect } from "@jest/globals";
import { encrypt, decrypt } from "./encrypt";

describe("Encryption/Decryption utility", () => {
  it("should encrypt and decrypt text successfully", () => {
    const originalText = "hello-world-secret-123";
    const encrypted = encrypt(originalText);
    expect(encrypted).toBeDefined();
    expect(encrypted).toContain(":");

    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(originalText);
  });

  it("should throw an error for invalid encrypted text format", () => {
    expect(() => {
      decrypt("invalidformat");
    }).toThrow("Invalid encrypted text format");
  });
});
