import { logger } from "./logger";

class CircuitBreaker {
  private failureCount = 0;
  private readonly threshold = 5;
  private readonly cooldownMs = 60_000;
  private nextAttemptTime = 0;

  public isOpen(): boolean {
    if (this.failureCount >= this.threshold) {
      if (Date.now() < this.nextAttemptTime) {
        return true;
      }
      // Half-open: attempt recovery
      return false;
    }
    return false;
  }

  public recordSuccess(): void {
    if (this.failureCount > 0) {
      logger.info({ msg: "Circuit breaker reset to CLOSED after successful call" });
      this.failureCount = 0;
      this.nextAttemptTime = 0;
    }
  }

  public recordFailure(err?: unknown): void {
    this.failureCount++;
    logger.warn({
      msg: "Circuit breaker recorded failure",
      consecutiveFailures: this.failureCount,
      err: String(err),
    });

    if (this.failureCount >= this.threshold) {
      this.nextAttemptTime = Date.now() + this.cooldownMs;
      logger.error({
        msg: "Circuit breaker OPENED for 60s due to consecutive AI provider errors",
        cooldownMs: this.cooldownMs,
      });
    }
  }

  public getStatus() {
    return {
      isOpen: this.isOpen(),
      failureCount: this.failureCount,
      cooldownRemainingMs: Math.max(0, this.nextAttemptTime - Date.now()),
    };
  }
}

export const aiCircuitBreaker = new CircuitBreaker();
