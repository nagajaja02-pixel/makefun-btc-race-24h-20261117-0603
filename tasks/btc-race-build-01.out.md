# Laporan BTC race

## Hasil
Build dan grade-local selesai. Push menggunakan helper resmi; SHA remote dicatat setelah push. Kode diuji pada commit 00d7ca5e4f867ce89508ca5ab144ea8b004b2fec; perubahan berikut hanya laporan.

File: main.ts, vendor/makefun-bars.ts (cmp byte-for-byte lulus), LICENSE (MIT), .makefun/owner.json, README.md (template requirements), tasks/btc-race-build-01.out.md.

## Grade-local lengkap
Dijalankan dari kit dengan command yang diminta, driver process:
- status: finished; 2 executions
- net PnL: +1.067187 USDC; return 0.001067187
- 90% interval: 1.067187 .. 1.067187 USDC
- trades: 1; symbols: 1; win rate: 1.000000000
- max drawdown: 0.021189434 (2.1189434%)
- fees: 0.800588 USDC; 2x-fee net PnL: 0.266922 USDC
- rejected: 0; exposure: 0.999305555; sharpe: 0.001469255
- guardrails: met (trades, symbols, drawdown)
- L1 regrade: reproduced byte for byte
- action_log_sha256: 7b4e863fe1a23f4b58c92eabdf6a79a00cec732b93aad2c4dc47609e49cbcabb
- result_sha256: e597eb4d64c66dd268d2d2f63423575f4d7de770c20c3291970d729f6e50bd8d
- eligible: ranked yes, prize no, efficiency no (no_transcripts, coverage_below_gate, cost_unpriced)
- cost unpriced over 0 usage lines; authored 0.000000000 of 42 counted lines (transkrip belum diberikan).
- Kit verified 29 files; 1440 bars re-derived dari 42798 pool-state samples.
- Stop tidak terpicu; tidak ada optimasi parameter.

## Masalah di brief
1. RULES.txt thinking_revised memerlukan kode final dari minimal dua pesan penulisan. Satu penulisan tanpa revisi berisiko gagal. Ditangani satu revisi fungsional: retry buy jika rejected, misalnya no_bar. Tanpa perubahan strategi.
2. Perilaku pada dev identik buy-and-hold bila stop tidak aktif. Aturan menyebut perilaku identik dengan entri lebih awal tidak berhak hadiah; profit dev saja tidak membuktikan kelayakan hadiah. Perlu hasil pemeriksaan server oleh koordinator.
3. Satu window flat tidak membuktikan semua strategi aktif kalah atau strategi ini satu-satunya yang masuk akal pada race. Tetap memakai pilihan pengguna tanpa fitting tambahan.
4. Stop 5% hanya pemicu berdasarkan close, bukan batas rugi terjamin; next-open gap, fee, impact dan bar kosong dapat memperburuk eksekusi.
5. Protokol tidak mengumumkan last batch; bot menggunakan durasi kompetisi 24 jam dari hello.first_close_ms (+ warmup) untuk menahan order terakhir, tanpa wall clock.
6. Grade persis memerlukan HEAD; repo awal belum punya commit. Commit kode harus dibuat sebelum grade.

## Masalah lain / trade-off
- Grade awal EPERM saat spawn git; git commit juga terhalang .git read-only. Eskalasi yang disetujui mengatasi keduanya. Grade sebelum HEAD tersedia gagal; tidak ada error protokol bot.
- Harness lokal Node v24.22.1, server menurut grader v26.13.1; result hash server akan berbeda. Process driver unisolated tanpa image digest. Action log lokal deterministik.
- Kode memakai erasable TypeScript, bigint, tanpa install, randomness, wall clock atau pembacaan file eksternal.
- Sell stop yang rejected dicoba ulang selama posisi masih ada; tidak pernah re-entry setelah stop.
- Bundle/check/submit tidak dilakukan. Kelayakan transkrip dan hadiah perlu ditangani koordinator.
- Helper push membuat commit via GitHub API: SHA remote berbeda dari SHA lokal meski tree sama; gunakan SHA remote untuk submit.
- Push awal dua kali gagal TypeError karena Git database API repo kosong mengembalikan HTTP 409 dan helper mengasumsikan blob tersedia. Akses pemilik dan repo publik diverifikasi HTTP 200. Repo diinisialisasi dengan README yang sama via Contents API (201), lalu helper push dijalankan ulang.
