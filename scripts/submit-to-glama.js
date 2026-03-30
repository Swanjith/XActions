#!/usr/bin/env node
// Submit all nirholas MCP repos to glama.ai
// by nichxbt

import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

const MCP_REPOS = [
  {
    name: 'XActions',
    description: 'Complete X/Twitter automation toolkit with MCP server for AI agents — 60+ tools for scraping, posting, analytics, and automation without API fees.',
    githubRepositoryUrl: 'https://github.com/nirholas/XActions',
  },
  {
    name: 'universal-crypto-mcp',
    description: 'Universal MCP server for AI agents to interact with any blockchain via natural language — DeFi, wallets, tokens, swaps across 20+ chains.',
    githubRepositoryUrl: 'https://github.com/nirholas/universal-crypto-mcp',
  },
  {
    name: 'free-crypto-news',
    description: 'Free crypto news API with Claude MCP server included — real-time news aggregation for AI agents.',
    githubRepositoryUrl: 'https://github.com/nirholas/free-crypto-news',
  },
  {
    name: 'x402-deploy',
    description: 'Turn any API or MCP server into a paid service with x402 — HTTP-native crypto micropayments for AI agent tools.',
    githubRepositoryUrl: 'https://github.com/nirholas/x402-deploy',
  },
  {
    name: 'agenti',
    description: 'MCP server for AI agents with 380+ tools across 20+ blockchains — DeFi, trading, wallets, x402-enabled micropayments.',
    githubRepositoryUrl: 'https://github.com/nirholas/agenti',
  },
  {
    name: 'modelcontextprotocol.name',
    description: 'Open MCP gateway with 1,100+ tools for DeFi, crypto, bridging, and x402 payments — one server for all blockchain interactions.',
    githubRepositoryUrl: 'https://github.com/nirholas/modelcontextprotocol.name',
  },
  {
    name: 'github-to-mcp',
    description: 'Convert any GitHub repository into an MCP server automatically — instant tool generation for AI agents.',
    githubRepositoryUrl: 'https://github.com/nirholas/github-to-mcp',
  },
  {
    name: 'bnbchain-mcp',
    description: 'MCP server for BNB Chain — DeFi, DEX trading, smart contract interaction, and security tools for AI agents.',
    githubRepositoryUrl: 'https://github.com/nirholas/bnbchain-mcp',
  },
  {
    name: 'extract-llms-docs',
    description: 'Extract llms.txt documentation with MCP server, REST API, and batch processing — feed any site\'s AI docs to your agents.',
    githubRepositoryUrl: 'https://github.com/nirholas/extract-llms-docs',
  },
  {
    name: 'Binance-MCP',
    description: 'MCP server for Binance.com API — spot trading, staking, wallets, NFTs, and market data for AI agents.',
    githubRepositoryUrl: 'https://github.com/nirholas/Binance-MCP',
  },
  {
    name: 'Binance-US-MCP',
    description: 'MCP server for Binance.US API — spot trading, staking, and OTC for US-based AI agent trading workflows.',
    githubRepositoryUrl: 'https://github.com/nirholas/Binance-US-MCP',
  },
  {
    name: 'UCAI',
    description: 'Universal Contract AI Interface — converts any smart contract ABI to an MCP server for AI agents to interact with on-chain contracts.',
    githubRepositoryUrl: 'https://github.com/nirholas/UCAI',
  },
  {
    name: 'ethereum-wallet-toolkit',
    description: 'Python toolkit and MCP servers for Ethereum wallet generation, signing, and on-chain operations.',
    githubRepositoryUrl: 'https://github.com/nirholas/ethereum-wallet-toolkit',
  },
  {
    name: 'mcp-notify',
    description: 'Monitor the MCP Registry for new and updated servers — includes an MCP server so AI assistants can track the ecosystem.',
    githubRepositoryUrl: 'https://github.com/nirholas/mcp-notify',
  },
  {
    name: 'lyra-registry',
    description: 'API and MCP service cataloging 800+ crypto, DeFi, and blockchain tools — discovery layer for AI agent ecosystems.',
    githubRepositoryUrl: 'https://github.com/nirholas/lyra-registry',
  },
  {
    name: 'lyra-tool-discovery',
    description: 'AI agent that discovers MCP servers from GitHub and npm — includes MCP integration for autonomous tool discovery.',
    githubRepositoryUrl: 'https://github.com/nirholas/lyra-tool-discovery',
  },
  {
    name: 'pump-fun-sdk',
    description: 'Token creation SDK for Pump.fun on Solana with MCP server — AI agents can deploy and manage memecoins.',
    githubRepositoryUrl: 'https://github.com/nirholas/pump-fun-sdk',
  },
  {
    name: 'defi-agents',
    description: 'DeFi agent definitions JSON API and MCP server — structured tool definitions for AI agents interacting with DeFi protocols.',
    githubRepositoryUrl: 'https://github.com/nirholas/defi-agents',
  },
  {
    name: 'crypto-market-data',
    description: 'Live crypto and DeFi market data MCP server — real-time prices, volumes, and on-chain metrics for AI agents.',
    githubRepositoryUrl: 'https://github.com/nirholas/crypto-market-data',
  },
];

const DELAY_MS = 3000; // be polite between submissions
const GLAMA_BASE = 'https://glama.ai';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function waitForLogin(page) {
  console.log('\n🌐 Opening glama.ai — please log in with your account...');
  await page.goto(`${GLAMA_BASE}/mcp/servers`, { waitUntil: 'networkidle2' });

  // Wait until the user is logged in (look for avatar/profile element or absence of login button)
  console.log('⏳ Waiting for you to log in... (press Enter here once logged in, or wait for auto-detect)');

  await Promise.race([
    // Auto-detect: wait for a logged-in indicator
    page.waitForFunction(() => {
      const loginBtn = document.querySelector('a[href*="/login"], button[data-testid="login"]');
      return !loginBtn;
    }, { timeout: 120000 }),
    // Manual: wait for Enter key in terminal
    new Promise(resolve => {
      process.stdin.setRawMode?.(true);
      process.stdin.resume();
      process.stdin.once('data', () => {
        process.stdin.setRawMode?.(false);
        process.stdin.pause();
        resolve();
      });
    }),
  ]).catch(() => {
    console.log('⚠️  Login auto-detect timed out — proceeding anyway.');
  });

  console.log('✅ Proceeding with submissions.\n');
}

async function submitRepo(page, repo, index, total) {
  console.log(`\n[${index + 1}/${total}] Submitting: ${repo.name}`);
  console.log(`  → ${repo.githubRepositoryUrl}`);

  try {
    const response = await page.evaluate(async ({ base, repo }) => {
      const res = await fetch(`${base}/api/mcp/servers/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: repo.name,
          description: repo.description,
          githubRepositoryUrl: repo.githubRepositoryUrl,
        }),
        credentials: 'include',
      });

      const text = await res.text();
      let json = null;
      try { json = JSON.parse(text); } catch {}

      return { status: res.status, ok: res.ok, text, json };
    }, { base: GLAMA_BASE, repo });

    if (response.ok) {
      console.log(`  ✅ Submitted successfully (${response.status})`);
    } else if (response.status === 409 || response.text?.toLowerCase().includes('already')) {
      console.log(`  ⚠️  Already exists / duplicate (${response.status})`);
    } else if (response.status === 401 || response.status === 403) {
      console.log(`  ❌ Auth error (${response.status}) — are you logged in?`);
    } else {
      console.log(`  ❌ Failed (${response.status}): ${response.text?.slice(0, 200)}`);
    }

    return response;
  } catch (err) {
    console.log(`  ❌ Error: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Glama.ai MCP Repo Submitter');
  console.log(`📦 ${MCP_REPOS.length} repos queued for submission\n`);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  const [page] = await browser.pages();

  try {
    await waitForLogin(page);

    const results = { success: [], duplicate: [], failed: [] };

    for (let i = 0; i < MCP_REPOS.length; i++) {
      const repo = MCP_REPOS[i];
      const response = await submitRepo(page, repo, i, MCP_REPOS.length);

      if (response?.ok) {
        results.success.push(repo.name);
      } else if (response?.status === 409 || response?.text?.toLowerCase().includes('already')) {
        results.duplicate.push(repo.name);
      } else {
        results.failed.push(repo.name);
      }

      if (i < MCP_REPOS.length - 1) {
        await sleep(DELAY_MS);
      }
    }

    console.log('\n' + '─'.repeat(50));
    console.log('📊 Submission Summary');
    console.log('─'.repeat(50));
    console.log(`✅ Submitted:   ${results.success.length}`);
    console.log(`⚠️  Duplicates:  ${results.duplicate.length}`);
    console.log(`❌ Failed:      ${results.failed.length}`);

    if (results.success.length > 0) {
      console.log('\n✅ Successfully submitted:');
      results.success.forEach(n => console.log(`   • ${n}`));
    }
    if (results.duplicate.length > 0) {
      console.log('\n⚠️  Already listed:');
      results.duplicate.forEach(n => console.log(`   • ${n}`));
    }
    if (results.failed.length > 0) {
      console.log('\n❌ Failed:');
      results.failed.forEach(n => console.log(`   • ${n}`));
    }

    console.log('\n🎉 Done! Check https://glama.ai/mcp/servers for your listings.');
    console.log('   (Note: new submissions go through a review queue before appearing publicly)\n');
  } finally {
    await sleep(5000);
    await browser.close();
  }
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
