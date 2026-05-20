import { eq, desc, like, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, sales, Product, Sale, InsertProduct, InsertSale } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getProducts({
  search,
  category,
  sortBy = "name",
  order = "asc",
}: {
  search?: string;
  category?: string;
  sortBy?: "name" | "price";
  order?: "asc" | "desc";
} = {}): Promise<Product[]> {
  const db = await getDb();
  if (!db) return [];

  let query: any = db.select().from(products);

  const conditions = [];
  if (search) {
    conditions.push(like(products.name, `%${search}%`));
  }
  if (category) {
    conditions.push(eq(products.category, category as any));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions));
  }

  const sortColumn = sortBy === "price" ? products.price : products.name;
  const direction = order === "desc" ? desc(sortColumn) : sortColumn;

  return query.orderBy(direction);
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(data: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(products).values(data);
  // Retornar o produto criado com os dados inseridos
  const created = await db.select().from(products).where(eq(products.name, data.name)).orderBy(desc(products.id)).limit(1);
  return created[0];
}

export async function updateProduct(id: number, data: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(products).where(eq(products.id, id));
}

export async function getSales() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(sales).orderBy(desc(sales.createdAt));
}

export async function createSale(data: InsertSale) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(sales).values(data);
}

export async function getDashboardMetrics() {
  const db = await getDb();
  if (!db) return { totalProducts: 0, totalSales: 0, totalRevenue: 0 };

  const [productsResult, salesResult] = await Promise.all([
    db.select().from(products),
    db.select().from(sales),
  ]);

  const totalRevenue = salesResult.reduce((acc, sale) => acc + sale.totalValue, 0);

  return {
    totalProducts: productsResult.length,
    totalSales: salesResult.length,
    totalRevenue,
  };
}
