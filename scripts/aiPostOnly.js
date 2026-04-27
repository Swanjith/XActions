#!/usr/bin/env node
// Copyright (c) 2024-2026 nich (@nichxbt). MIT License.
// AI post-only runner for XActions personas.

import {
  createBrowser,
  createPage,
  loginWithCookie,
} from '../src/scrapers/index.js';

import {
  createPost,
  generatePost,
} from '../src/algorithmBuilder.js';

import {
  loadPersona,
  savePersona,
} from '../src/personaEngine.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseCookieHeader(cookieHeader) {
  return cookieHeader
    .split(';')
    .map((pair) => {
      const [name, ...valueParts] = pair.trim().split('=');
      return {
        name,
        value: valueParts.join('='),
        domain: '.x.com',
        path: '/',
        secure: true,
      };
    })
    .filter((cookie) => cookie.name && cookie.value);
}

async function login(page, authToken) {
  const cookieHeader = process.env.XACTIONS_COOKIE_HEADER;

  if (cookieHeader) {
    await page.setCookie(...parseCookieHeader(cookieHeader));
    await page.goto('https://x.com/home', { waitUntil: 'networkidle2' });
  } else {
    await loginWithCookie(page, authToken);
  }

  if (page.url().includes('/i/flow/login')) {
    throw new Error('X redirected to login. Refresh XACTIONS_SESSION_COOKIE or provide XACTIONS_COOKIE_HEADER.');
  }

  await page.goto('https://x.com/compose/tweet', { waitUntil: 'networkidle2', timeout: 30000 });
  if (page.url().includes('/i/flow/login')) {
    throw new Error('X compose redirected to login. Refresh XACTIONS_SESSION_COOKIE or provide XACTIONS_COOKIE_HEADER.');
  }

  const hasComposer = await page.$('[data-testid^="tweetTextarea_"]');
  if (!hasComposer) {
    throw new Error('Could not find X compose box after login.');
  }
}

function readArg(name, fallback = null) {
  const prefix = `--${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);

  const index = process.argv.indexOf(`--${name}`);
  if (index !== -1 && process.argv[index + 1]) return process.argv[index + 1];

  return fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function usage() {
  console.log(`
Usage:
  node scripts/aiPostOnly.js --persona <persona_id> [options]

Options:
  --dry-run              Generate content but do not post
  --once                 Post once, then exit
  --interval-min <n>     Minutes between posts in loop mode (default: 180)
  --headless             Run browser headless (default)
  --no-headless          Show browser window

Required environment:
  OPENROUTER_API_KEY       OpenRouter key for AI generation
  XACTIONS_SESSION_COOKIE  X auth_token cookie for posting
`);
}

async function postOnce({ personaId, dryRun, headless }) {
  const persona = loadPersona(personaId);

  console.log(`🤖 Persona: ${persona.name} (${persona.preset})`);
  console.log(`🎯 Topics: ${persona.niche.topics.join(', ')}`);

  if (dryRun) {
    const text = await generatePost(persona);
    if (!text) {
      console.log('❌ AI did not generate content. Check OPENROUTER_API_KEY.');
      return false;
    }

    console.log('\n🧪 DRY RUN - generated post:\n');
    console.log(text);
    console.log(`\n${text.length}/${persona.voice.maxPostLength || 280} chars`);
    return true;
  }

  const authToken = process.env.XACTIONS_SESSION_COOKIE;
  if (!authToken) {
    throw new Error('XACTIONS_SESSION_COOKIE is required for real posting');
  }

  let browser;
  try {
    browser = await createBrowser({ headless: headless ? 'new' : false });
    const page = await createPage(browser);
    await login(page, authToken);
    console.log('✅ Logged in to X');

    const posted = await createPost(page, persona);
    if (posted) {
      persona.state.totalPosts = (persona.state.totalPosts || 0) + 1;
      persona.state.lastPostAt = new Date().toISOString();
      savePersona(persona);
      console.log('✅ AI post published');
      return true;
    }

    console.log('❌ Post was not published');
    return false;
  } finally {
    try {
      await browser?.close();
    } catch {
      // ignore browser cleanup errors
    }
  }
}

async function main() {
  const personaId = readArg('persona');
  const dryRun = hasFlag('dry-run');
  const once = hasFlag('once');
  const headless = !hasFlag('no-headless');
  const intervalMin = Number(readArg('interval-min', '180'));

  if (!personaId || hasFlag('help')) {
    usage();
    process.exit(hasFlag('help') ? 0 : 1);
  }

  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is required');
  }

  if (dryRun || once) {
    await postOnce({ personaId, dryRun, headless });
    return;
  }

  console.log(`🔁 Starting AI post-only loop. Interval: ${intervalMin} minutes`);
  while (true) {
    await postOnce({ personaId, dryRun: false, headless });
    await sleep(intervalMin * 60 * 1000);
  }
}

main().catch((error) => {
  console.error(`❌ ${error.message}`);
  process.exit(1);
});
