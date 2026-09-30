import { AdminValidation } from "../modules/admin/admin.validation";
import { AuthValidation } from "../modules/auth/auth.validation";

describe("Validation Schemas", () => {
  describe("AuthValidation", () => {
    it("should validate valid login credentials", () => {
      const valid = {
        body: {
          email: "admin@example.com",
          password: "SecurePassword123!"
        }
      };

      const result = AuthValidation.loginValidationSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalid = {
        body: {
          email: "not-an-email",
          password: "password123"
        }
      };

      const result = AuthValidation.loginValidationSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("AdminValidation", () => {
    it("should validate correct reorder payload", () => {
      const valid = {
        body: {
          items: [
            { id: "item-1", order: 1 },
            { id: "item-2", order: 2 }
          ]
        }
      };

      const result = AdminValidation.reorderValidationSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should reject empty reorder items array", () => {
      const invalid = {
        body: {
          items: []
        }
      };

      const result = AdminValidation.reorderValidationSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should validate id param schema", () => {
      const valid = {
        params: {
          id: "proj_cuid1234"
        }
      };

      const result = AdminValidation.idParamValidationSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });
});
