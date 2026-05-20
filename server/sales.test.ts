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

describe("sales router", () => {
  let ctx: TrpcContext;
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    ctx = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  describe("sales.list", () => {
    it("should return an array of sales", async () => {
      const result = await caller.sales.list();
      expect(Array.isArray(result)).toBe(true);
    }, { timeout: 10000 });

    it("should include product information in sales", async () => {
      const result = await caller.sales.list();
      if (result.length > 0) {
        expect(result[0]).toHaveProperty("product");
        expect(result[0]).toHaveProperty("quantity");
        expect(result[0]).toHaveProperty("clientName");
        expect(result[0]).toHaveProperty("totalValue");
      }
    }, { timeout: 10000 });
  });

  describe("sales.create", () => {
    it("should validate required fields", async () => {
      try {
        await caller.sales.create({
          productId: 1,
          quantity: 0,
          clientName: "Test Client",
        });
        expect.fail("Should throw validation error");
      } catch (error: any) {
        expect(error.message).toContain("positiva");
      }
    });

    it("should validate positive quantity", async () => {
      try {
        await caller.sales.create({
          productId: 1,
          quantity: -5,
          clientName: "Test Client",
        });
        expect.fail("Should throw validation error");
      } catch (error: any) {
        expect(error.message).toContain("positiva");
      }
    });

    it("should validate client name is required", async () => {
      try {
        await caller.sales.create({
          productId: 1,
          quantity: 1,
          clientName: "",
        });
        expect.fail("Should throw validation error");
      } catch (error: any) {
        expect(error.message).toContain("obrigatório");
      }
    });

    it("should throw NOT_FOUND for non-existent product", async () => {
      try {
        await caller.sales.create({
          productId: 99999,
          quantity: 1,
          clientName: "Test Client",
        });
        expect.fail("Should throw NOT_FOUND error");
      } catch (error: any) {
        expect(error.code).toBe("NOT_FOUND");
      }
    });

    it("should throw error when stock is insufficient or product not found", async () => {
      try {
        await caller.sales.create({
          productId: 1,
          quantity: 999999,
          clientName: "Test Client",
        });
        expect.fail("Should throw error");
      } catch (error: any) {
        // Pode ser NOT_FOUND se o produto não existe ou BAD_REQUEST se estoque insuficiente
        expect(["BAD_REQUEST", "NOT_FOUND"]).toContain(error.code);
      }
    });
  });

  describe("dashboard.metrics", () => {
    it("should return dashboard metrics", async () => {
      const result = await caller.dashboard.metrics();
      expect(result).toHaveProperty("totalProducts");
      expect(result).toHaveProperty("totalSales");
      expect(result).toHaveProperty("totalRevenue");
      expect(typeof result.totalProducts).toBe("number");
      expect(typeof result.totalSales).toBe("number");
      expect(typeof result.totalRevenue).toBe("number");
    }, { timeout: 10000 });

    it("should have non-negative metrics", async () => {
      const result = await caller.dashboard.metrics();
      expect(result.totalProducts).toBeGreaterThanOrEqual(0);
      expect(result.totalSales).toBeGreaterThanOrEqual(0);
      expect(result.totalRevenue).toBeGreaterThanOrEqual(0);
    }, { timeout: 10000 });
  });
});
