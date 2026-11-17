import { runBars } from './vendor/makefun-bars.ts';

const SYMBOL = 'CBBTC';
const WINDOW_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;
let peak = 0n;
let entered = false;
let stopped = false;

await runBars({
  onBatch(state, batch) {
    if (state.warmingUp) return [];
    // A missing next-open bar can reject entry; retry until a buy fills.
    // Never reset entry after a stop: there is deliberately no re-entry.
    if (!stopped && batch.fills.some((fill) => fill.symbol === SYMBOL
      && fill.side === 'buy' && fill.status === 'rejected')) entered = false;
    // hello starts at the first warm-up close, if a warm-up exists.
    const lastClose = state.hello.first_close_ms
      + state.warmupBars * MINUTE_MS + WINDOW_MS - MINUTE_MS;
    if (batch.t >= lastClose) return [];
    const bar = batch.bars.find((item) => item.symbol === SYMBOL);
    if (bar === undefined) return [];
    const close = BigInt(bar.c);
    const qty = state.positions.get(SYMBOL)?.qty ?? 0n;

    if (!entered) {
      if (state.cash < BigInt(state.hello.fees.min_notional_quote_units)) return [];
      peak = close;
      entered = true;
      return [{ side: 'buy', symbol: SYMBOL, notional_quote_units: state.cash * 99n / 100n,
        max_slippage_bps: 10_000 }];
    }
    if (close > peak) peak = close;
    // Integer comparison includes a drop of exactly 5%, without rounding.
    if (qty > 0n && (stopped || close * 100n <= peak * 95n)) {
      stopped = true;
      return [{ side: 'sell', symbol: SYMBOL, qty, max_slippage_bps: 10_000 }];
    }
    return [];
  },
});
