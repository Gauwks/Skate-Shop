import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("products router", () => {
  let ctx: TrpcContext;
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    ctx = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("products.list", () => {
    it("should return an array of products", async () => {
      const result = await caller.products.list({});
      expect(Array.isArray(result)).toBe(true);
    }, { timeout: 10000 });

    it("should support search parameter", async () => {
      const result = await caller.products.list({ search: "shape" });
      expect(Array.isArray(result)).toBe(true);
    }, { timeout: 10000 });

    it("should support category filter", async () => {
      const result = await caller.products.list({ category: "shape" });
      expect(Array.isArray(result)).toBe(true);
    }, { timeout: 10000 });

    it("should support sorting by name", async () => {
      const result = await caller.products.list({ sortBy: "name", order: "asc" });
      expect(Array.isArray(result)).toBe(true);
    }, { timeout: 10000 });

    it("should support sorting by price", async () => {
      const result = await caller.products.list({ sortBy: "price", order: "desc" });
      expect(Array.isArray(result)).toBe(true);
    }, { timeout: 10000 });
  });

  describe("products.create", () => {
    it("should create a product with valid data", async () => {
      const result = await caller.products.create({
        name: "Test Shape",
        brand: "Test Brand",
        category: "shape",
        price: 15000,
        stock: 10,
        description: "Test product",
      });

      expect(result).toHaveProperty("id");
      expect(result.name).toBe("Test Shape");
      expect(result.brand).toBe("Test Brand");
      expect(result.category).toBe("shape");
      expect(result.price).toBe(15000);
      expect(result.stock).toBe(10);
    });

    it("should validate required fields", async () => {
      try {
        await caller.products.create({
          name: "",
          brand: "Test Brand",
          category: "shape",
          price: 15000,
          stock: 10,
        });
        expect.fail("Should throw validation error");
      } catch (error: any) {
        expect(error.message).toContain("obrigatório");
      }
    });

    it("should validate positive price", async () => {
      try {
        await caller.products.create({
          name: "Test",
          brand: "Test Brand",
          category: "shape",
          price: -100,
          stock: 10,
        });
        expect.fail("Should throw validation error");
      } catch (error: any) {
        expect(error.message).toContain("positivo");
      }
    });

    it("should validate non-negative stock", async () => {
      try {
        await caller.products.create({
          name: "Test",
          brand: "Test Brand",
          category: "shape",
          price: 15000,
          stock: -5,
        });
        expect.fail("Should throw validation error");
      } catch (error: any) {
        expect(error.message).toContain("negativo");
      }
    });
  });

  describe("products.getById", () => {
    it("should throw NOT_FOUND for non-existent product", async () => {
      try {
        await caller.products.getById(99999);
        expect.fail("Should throw NOT_FOUND error");
      } catch (error: any) {
        expect(error.code).toBe("NOT_FOUND");
      }
    });
  });

  describe("products.delete", () => {
    it("should throw NOT_FOUND when deleting non-existent product", async () => {
      try {
        await caller.products.delete(99999);
        expect.fail("Should throw NOT_FOUND error");
      } catch (error: any) {
        expect(error.code).toBe("NOT_FOUND");
      }
    });
  });
});
