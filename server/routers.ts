import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSales,
  createSale,
  getDashboardMetrics,
} from "./db";

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  brand: z.string().min(1, "Marca é obrigatória"),
  category: z.enum(["shape", "truck", "roda", "rolamento", "lixa", "completo"]),
  price: z.number().int().positive("Preço deve ser positivo"),
  stock: z.number().int().nonnegative("Estoque não pode ser negativo"),
  description: z.string().optional(),
});

const saleSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive("Quantidade deve ser positiva"),
  clientName: z.string().min(1, "Nome do cliente é obrigatório"),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  products: router({
    list: publicProcedure
      .input(
        z.object({
          search: z.string().optional(),
          category: z.string().optional(),
          sortBy: z.enum(["name", "price"]).optional(),
          order: z.enum(["asc", "desc"]).optional(),
        })
      )
      .query(async ({ input }) => {
        return getProducts({
          search: input.search,
          category: input.category,
          sortBy: input.sortBy || "name",
          order: input.order || "asc",
        });
      }),

    getById: publicProcedure
      .input(z.number().int().positive())
      .query(async ({ input }) => {
        const product = await getProductById(input);
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Produto não encontrado",
          });
        }
        return product;
      }),

    create: protectedProcedure
      .input(productSchema)
      .mutation(async ({ input }) => {
        return createProduct({
          name: input.name,
          brand: input.brand,
          category: input.category,
          price: input.price,
          stock: input.stock,
          description: input.description || null,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          data: productSchema.partial(),
        })
      )
      .mutation(async ({ input }) => {
        const product = await getProductById(input.id);
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Produto não encontrado",
          });
        }
        return updateProduct(input.id, input.data);
      }),

    delete: protectedProcedure
      .input(z.number().int().positive())
      .mutation(async ({ input }) => {
        const product = await getProductById(input);
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Produto não encontrado",
          });
        }
        return deleteProduct(input);
      }),
  }),

  sales: router({
    list: publicProcedure.query(async () => {
      const salesData = await getSales();
      const enrichedSales = await Promise.all(
        salesData.map(async (sale) => {
          const product = await getProductById(sale.productId);
          return {
            ...sale,
            product,
          };
        })
      );
      return enrichedSales;
    }),

    create: protectedProcedure
      .input(saleSchema)
      .mutation(async ({ input }) => {
        const product = await getProductById(input.productId);
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Produto não encontrado",
          });
        }

        if (product.stock < input.quantity) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Estoque insuficiente",
          });
        }

        const totalValue = product.price * input.quantity;

        await createSale({
          productId: input.productId,
          quantity: input.quantity,
          clientName: input.clientName,
          totalValue,
        });

        await updateProduct(input.productId, {
          stock: product.stock - input.quantity,
        });

        return { success: true, totalValue };
      }),
  }),

  dashboard: router({
    metrics: publicProcedure.query(async () => {
      return getDashboardMetrics();
    }),
  }),
});

export type AppRouter = typeof appRouter;
