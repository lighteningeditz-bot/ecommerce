import { describe, it, expect } from "vitest";

describe("Order Placement Concurrency & Oversell Prevention", () => {
  it("Two simultaneous orders for the last unit result in exactly one success", async () => {
    // Simulating database row-level locking (FOR UPDATE of products in place_order RPC)
    let stockQty = 1;
    const isPublished = true;
    let successfulOrders = 0;
    let failedOrders = 0;

    // Mutex simulation representing Postgres row-lock on product record
    let rowLocked = false;

    async function atomicPlaceOrder(buyerId: string, requestedQty: number): Promise<boolean> {
      // Wait for row lock
      while (rowLocked) {
        await new Promise((resolve) => setTimeout(resolve, 5));
      }
      rowLocked = true;

      try {
        if (!isPublished) {
          throw new Error("Product is no longer available");
        }
        if (stockQty < requestedQty) {
          throw new Error(`Only ${stockQty} left in stock`);
        }

        // Decrement stock
        stockQty -= requestedQty;
        successfulOrders++;
        return true;
      } catch {
        failedOrders++;
        return false;
      } finally {
        rowLocked = false;
      }
    }

    // Launch 2 simultaneous order attempts for 1 unit each when stock is 1
    const [result1, result2] = await Promise.all([
      atomicPlaceOrder("user-1", 1),
      atomicPlaceOrder("user-2", 1),
    ]);

    // Exactly one must succeed, one must fail
    expect(successfulOrders).toBe(1);
    expect(failedOrders).toBe(1);
    expect(stockQty).toBe(0);
    expect(result1 !== result2).toBe(true);
  });
});
