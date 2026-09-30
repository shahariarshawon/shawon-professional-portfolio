import { JwtUtils } from "../utils/jwt";
import { PasswordUtils } from "../utils/password";

describe("Auth Utilities", () => {
  describe("PasswordUtils", () => {
    it("should securely hash a password and verify correctly", async () => {
      const password = "SuperSecretPassword123!";
      const hash = await PasswordUtils.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toEqual(password);

      const isValid = await PasswordUtils.comparePassword(password, hash);
      expect(isValid).toBe(true);

      const isInvalid = await PasswordUtils.comparePassword("WrongPassword", hash);
      expect(isInvalid).toBe(false);
    });
  });

  describe("JwtUtils", () => {
    it("should generate and verify valid JWT token payload", () => {
      const payload = {
        adminId: "admin_test_123",
        email: "shawon@example.com",
        role: "ADMIN" as const
      };

      const token = JwtUtils.createToken(payload);
      expect(typeof token).toBe("string");

      const decoded = JwtUtils.verifyToken(token);
      expect(decoded.adminId).toEqual(payload.adminId);
      expect(decoded.email).toEqual(payload.email);
      expect(decoded.role).toEqual(payload.role);
    });
  });
});
