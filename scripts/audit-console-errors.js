#!/usr/bin/env node
// Audit all dashboard pages for browser console errors
// Usage: node scripts/audit-console-errors.js [--fix] [--port 3001]
// by nichxbt

import puppeteer from 'puppeteer';
import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DASHBOARD_DIR = join(__dirname, '..', 'dashboard');

// Parse args
const args = process.argv.slice(2);
const port = args.includes('--port') ? args[args.indexOf('--port') + 1] : '3001';
const BASE_URL = `http://localhost:${port}`;
const verbose = args.includes('--verbose');

async function discoverPages() {
  const pages = [];

  // Top-level HTML files
  const topLevel = await readdir(DASHBOARD_DIR);
  for (const file of topLevel) {
    if (file.endsWith('.html')) {
      const route = file === 'index.html' ? '/' : `/${file}`;
      pages.push(route);
    }
  }

  // Recursively find HTML in subdirectories
  async function walkDir(dir, prefix) {
    const entries = await readdir(join(DASHBOARD_DIR, dir), { withFileTypes: true });
    for (const entry of entries) {
      const relPath = `${dir}/${entry.name}`;
      if (entry.isDirectory()) {
        await walkDir(relPath, prefix);
      } else if (entry.name.endsWith('.html')) {
        pages.push(`/${relPath}`);
      }
    }
  }

  for (const entry of topLevel) {
    try {
      const stat = await readdir(join(DASHBOARD_DIR, entry), { withFileTypes: true });
      if (stat) await walkDir(entry, '');
    } catch {
      // Not a directory
    }
  }

  return [...new Set(pages)].sort();
}

async function auditPages() {
  console.log(`\n⚡ XActions Console Error Audit`);
  console.log(`  Base URL: ${BASE_URL}\n`);

  // Check if server is running
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (e) {
    console.error(`❌ Cannot reach ${BASE_URL} — start the server first: npm run dev`);
    process.exit(1);
  }

  const pages = await discoverPages();
  console.log(`📄 Found ${pages.length} pages to audit\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const results = {
    errors: [],
    warnings: [],
    networkErrors: [],
  };

  let pagesWithIssues = 0;
  let pagesClean = 0;

  for (const route of pages) {
    const url = `${BASE_URL}${route}`;
    const page = await browser.newPage();
    const pageIssues = { errors: [], warnings: [], networkErrors: [] };

    // Capture console messages
    page.on('console', (msg) => {
      const type = msg.type();
      const text = msg.text();

      // Skip noisy but harmless messages
      if (text.includes('SES Removing unpermitted intrinsics')) return;
      if (text.includes('Download error or resource')) return;

      if (type === 'error') {
        pageIssues.errors.push(text);
      } else if (type === 'warning') {
        pageIssues.warnings.push(text);
      }
    });

    // Capture failed network requests
    page.on('requestfailed', (req) => {
      const failure = req.failure();
      pageIssues.networkErrors.push({
        url: req.url(),
        reason: failure ? failure.errorText : 'unknown',
      });
    });

    // Capture HTTP errors (4xx, 5xx)
    page.on('response', (res) => {
      const status = res.status();
      const resUrl = res.url();
      if (status >= 400 && !resUrl.includes('favicon')) {
        pageIssues.networkErrors.push({
          url: resUrl,
          reason: `HTTP ${status}`,
        });
      }
    });

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
      // Wait a bit for any deferred JS
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      pageIssues.errors.push(`Navigation failed: ${e.message}`);
    }

    await page.close();

    const hasIssues =
      pageIssues.errors.length || pageIssues.warnings.length || pageIssues.networkErrors.length;

    if (hasIssues) {
      pagesWithIssues++;
      console.log(`❌ ${route}`);

      for (const err of pageIssues.errors) {
        console.log(`   🔴 ERROR: ${err}`);
        results.errors.push({ page: route, message: err });
      }
      for (const warn of pageIssues.warnings) {
        console.log(`   🟡 WARN:  ${warn}`);
        results.warnings.push({ page: route, message: warn });
      }
      for (const net of pageIssues.networkErrors) {
        console.log(`   🟠 NET:   ${net.reason} → ${net.url}`);
        results.networkErrors.push({ page: route, ...net });
      }
    } else {
      pagesClean++;
      if (verbose) console.log(`✅ ${route}`);
    }
  }

  await browser.close();

  // Summary
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`📊 Audit Summary`);
  console.log(`   Pages scanned:      ${pages.length}`);
  console.log(`   Clean:              ${pagesClean}`);
  console.log(`   With issues:        ${pagesWithIssues}`);
  console.log(`   Console errors:     ${results.errors.length}`);
  console.log(`   Console warnings:   ${results.warnings.length}`);
  console.log(`   Network errors:     ${results.networkErrors.length}`);
  console.log(`${'─'.repeat(60)}\n`);

  // Deduplicated error report
  if (results.errors.length || results.networkErrors.length) {
    console.log(`🔍 Unique Issues:\n`);

    const uniqueErrors = [...new Set(results.errors.map((e) => e.message))];
    if (uniqueErrors.length) {
      console.log(`  Console Errors (${uniqueErrors.length} unique):`);
      for (const err of uniqueErrors) {
        const count = results.errors.filter((e) => e.message === err).length;
        console.log(`    [${count}x] ${err}`);
      }
    }

    const uniqueNetErrors = [
      ...new Set(results.networkErrors.map((e) => `${e.reason} → ${e.url}`)),
    ];
    if (uniqueNetErrors.length) {
      console.log(`\n  Network Errors (${uniqueNetErrors.length} unique):`);
      for (const err of uniqueNetErrors) {
        const count = results.networkErrors.filter((e) => `${e.reason} → ${e.url}` === err).length;
        console.log(`    [${count}x] ${err}`);
      }
    }
  }

  // Write JSON report
  const reportPath = join(__dirname, '..', 'audit-report.json');
  const { writeFile } = await import('fs/promises');
  await writeFile(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        baseUrl: BASE_URL,
        pagesScanned: pages.length,
        pagesClean,
        pagesWithIssues,
        errors: results.errors,
        warnings: results.warnings,
        networkErrors: results.networkErrors,
      },
      null,
      2
    )
  );
  console.log(`\n📁 Full report saved to audit-report.json`);

  process.exit(pagesWithIssues > 0 ? 1 : 0);
}

auditPages().catch((err) => {
  console.error('❌ Audit failed:', err.message);
  process.exit(1);
});
