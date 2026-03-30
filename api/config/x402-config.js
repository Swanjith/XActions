/**
 * x402 Micropayment Configuration (Optional)
 * 
 * Optional pay-per-request pricing for self-hosted remote AI API.
 * All local features (browser scripts, CLI, MCP server) are 100% free.
 * x402 is only relevant if you self-host the XActions API and want to
 * monetize remote AI agent access. Most users can ignore this file.
 * 
 * @see https://x402.org for protocol documentation
 */

// Determine environment
const isProduction = process.env.NODE_ENV === 'production';

// Payment receiving address (override with X402_PAY_TO_ADDRESS env var)
export const PAY_TO_ADDRESS = process.env.X402_PAY_TO_ADDRESS || '0x4027FdaC1a5216e264A00a5928b8366aE59cE888';

// Facilitator URL (testnet for development, mainnet for production)
export const FACILITATOR_URL = process.env.X402_FACILITATOR_URL || 'https://x402.org/facilitator';

// Network configuration (legacy - for backwards compatibility)
// Development: eip155:84532 (Base Sepolia testnet)
// Production: eip155:8453 (Base mainnet)
export const NETWORK = process.env.X402_NETWORK || (isProduction ? 'eip155:8453' : 'eip155:84532');

// Track if config has been validated
let configValidated = false;

// Supported networks configuration (multi-network support)
export const SUPPORTED_NETWORKS = {
  // ── Production mainnets ──────────────────────────────────────
  'eip155:8453': {
    name: 'Base',
    recommended: true,
    gasCost: 'low',
  },
  'eip155:42161': {
    name: 'Arbitrum One',
    gasCost: 'low',
  },
  'eip155:10': {
    name: 'Optimism',
    gasCost: 'low',
  },
  'eip155:137': {
    name: 'Polygon',
    gasCost: 'low',
  },
  'eip155:1': {
    name: 'Ethereum',
    gasCost: 'high',
  },
  'eip155:43114': {
    name: 'Avalanche C-Chain',
    gasCost: 'low',
  },
  'eip155:56': {
    name: 'BNB Smart Chain',
    gasCost: 'low',
  },
  'eip155:42220': {
    name: 'Celo',
    gasCost: 'low',
  },
  'eip155:324': {
    name: 'zkSync Era',
    gasCost: 'low',
  },
  'eip155:59144': {
    name: 'Linea',
    gasCost: 'low',
  },
  'eip155:534352': {
    name: 'Scroll',
    gasCost: 'low',
  },
  // ── Testnets ─────────────────────────────────────────────────
  'eip155:84532': {
    name: 'Base Sepolia',
    testnet: true,
    gasCost: 'low',
  },
  'eip155:11155111': {
    name: 'Ethereum Sepolia',
    testnet: true,
    gasCost: 'low',
  },
  'eip155:421614': {
    name: 'Arbitrum Sepolia',
    testnet: true,
    gasCost: 'low',
  },
};

// Token contract addresses per network
// Each entry maps a token symbol to its contract address on that chain.
export const SUPPORTED_TOKENS = {
  // ── Base ──────────────────────────────────────────────────────
  'eip155:8453': {
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    USDT: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
    DAI:  '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    WETH: '0x4200000000000000000000000000000000000006',
  },
  // ── Arbitrum One ──────────────────────────────────────────────
  'eip155:42161': {
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    DAI:  '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
  },
  // ── Optimism ─────────────────────────────────────────────────
  'eip155:10': {
    USDC: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
    USDT: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    DAI:  '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    WETH: '0x4200000000000000000000000000000000000006',
  },
  // ── Polygon ──────────────────────────────────────────────────
  'eip155:137': {
    USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    DAI:  '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  },
  // ── Ethereum ─────────────────────────────────────────────────
  'eip155:1': {
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    DAI:  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  },
  // ── Avalanche C-Chain ────────────────────────────────────────
  'eip155:43114': {
    USDC: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    USDT: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7',
    DAI:  '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
    WETH: '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB',
  },
  // ── BNB Smart Chain ──────────────────────────────────────────
  'eip155:56': {
    USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    USDT: '0x55d398326f99059fF775485246999027B3197955',
    DAI:  '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    WETH: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  },
  // ── Celo ─────────────────────────────────────────────────────
  'eip155:42220': {
    USDC: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C',
    USDT: '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e',
    DAI:  '0xE4fE50cdD716beF95DB2e66aAA5ea1FfF1e037af',
  },
  // ── zkSync Era ───────────────────────────────────────────────
  'eip155:324': {
    USDC: '0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4',
    USDT: '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C',
    WETH: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
  },
  // ── Linea ────────────────────────────────────────────────────
  'eip155:59144': {
    USDC: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff',
    USDT: '0xA219439258ca9da29E9Cc4cE5596924745e12B93',
    DAI:  '0x4AF15ec2A0BD43Db75dd04E62FAA3B8EF36b00d5',
    WETH: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f',
  },
  // ── Scroll ───────────────────────────────────────────────────
  'eip155:534352': {
    USDC: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4',
    USDT: '0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df',
    DAI:  '0xcA77eB3fEFe3725Dc33bccB54eDEFc3D9f764f97',
    WETH: '0x5300000000000000000000000000000000000004',
  },
  // ── Testnets ─────────────────────────────────────────────────
  'eip155:84532': {
    USDC: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  },
  'eip155:11155111': {
    USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
  },
  'eip155:421614': {
    USDC: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
  },
};

/**
 * Get list of accepted networks for payments
 * @param {boolean} includeTestnet - Whether to include testnet networks
 * @returns {Array} Array of network configurations with token addresses
 */
export function getAcceptedNetworks(includeTestnet = false) {
  return Object.entries(SUPPORTED_NETWORKS)
    .filter(([_, config]) => includeTestnet || !config.testnet)
    .map(([network, config]) => ({
      network,
      ...config,
      tokens: SUPPORTED_TOKENS[network] || {},
      // Legacy compat — keep usdc as top-level field
      usdc: SUPPORTED_TOKENS[network]?.USDC || null,
    }));
}

/**
 * Get network configuration by network ID
 * @param {string} networkId - Network identifier (e.g., 'eip155:8453')
 * @returns {Object|null} Network configuration or null if not found
 */
export function getNetworkConfig(networkId) {
  const base = SUPPORTED_NETWORKS[networkId];
  if (!base) return null;
  return {
    ...base,
    tokens: SUPPORTED_TOKENS[networkId] || {},
    usdc: SUPPORTED_TOKENS[networkId]?.USDC || null,
  };
}

/**
 * Get all accepted tokens across all supported networks
 * @param {boolean} includeTestnet - Whether to include testnet networks
 * @returns {Array<{symbol: string, networks: Array}>} Accepted tokens
 */
export function getAcceptedTokens(includeTestnet = false) {
  const tokenMap = {};
  for (const [networkId, tokens] of Object.entries(SUPPORTED_TOKENS)) {
    const net = SUPPORTED_NETWORKS[networkId];
    if (!net) continue;
    if (!includeTestnet && net.testnet) continue;
    for (const [symbol, address] of Object.entries(tokens)) {
      if (!tokenMap[symbol]) tokenMap[symbol] = [];
      tokenMap[symbol].push({ network: networkId, name: net.name, address });
    }
  }
  return Object.entries(tokenMap).map(([symbol, networks]) => ({ symbol, networks }));
}

// Pricing tiers for AI agent operations (in USD, paid in USDC)
export const AI_OPERATION_PRICES = {
  // Scraping operations
  'scrape:profile': '$0.001',        // Profile info
  'scrape:followers': '$0.01',       // Follower list (up to 1000)
  'scrape:following': '$0.01',       // Following list (up to 1000)
  'scrape:tweets': '$0.005',         // Tweet history (up to 100)
  'scrape:thread': '$0.002',         // Single thread
  'scrape:search': '$0.01',          // Search results
  'scrape:hashtag': '$0.01',         // Hashtag tweets
  'scrape:media': '$0.005',          // Media from profile
  
  // Automation operations
  'action:unfollow-non-followers': '$0.05',  // Clean following list
  'action:unfollow-everyone': '$0.10',       // Full unfollow
  'action:detect-unfollowers': '$0.02',      // Who unfollowed
  'action:auto-like': '$0.02',               // Like tweets
  'action:follow-engagers': '$0.03',         // Follow from engagement
  'action:keyword-follow': '$0.03',          // Follow by keyword
  
  // Monitoring operations  
  'monitor:account': '$0.01',        // Account changes
  'monitor:followers': '$0.01',      // Follower changes
  'alert:new-followers': '$0.005',   // New follower notifications
  
  // Utility operations
  'download:video': '$0.005',        // Video download
  'export:bookmarks': '$0.01',       // Bookmark export
  'unroll:thread': '$0.002',         // Thread unroller
  
  // Profile operations
  'profile:get': '$0.001',           // Get profile info
  'profile:update': '$0.01',         // Update profile fields
  
  // Posting operations
  'posting:tweet': '$0.005',         // Post a tweet
  'posting:thread': '$0.01',         // Post a thread
  'posting:poll': '$0.01',           // Create a poll
  'posting:schedule': '$0.005',      // Schedule a post
  'posting:delete': '$0.002',        // Delete a tweet
  
  // Engagement operations
  'engagement:like': '$0.002',       // Like a tweet
  'engagement:unlike': '$0.002',     // Unlike a tweet
  'engagement:reply': '$0.005',      // Reply to a tweet
  'engagement:bookmark': '$0.002',   // Bookmark a tweet
  'engagement:auto-like': '$0.02',   // Auto-like by keywords
  'engagement:analytics': '$0.01',   // Engagement analytics
  
  // Discovery operations
  'discovery:search': '$0.01',       // Search tweets
  'discovery:trends': '$0.005',      // Get trending topics
  'discovery:explore': '$0.005',     // Explore feed
  
  // Notification operations
  'notifications:get': '$0.005',     // Get notifications
  'notifications:mute': '$0.002',    // Mute a user
  'notifications:unmute': '$0.002',  // Unmute a user
  
  // DM operations
  'messages:send': '$0.01',          // Send a DM
  'messages:conversations': '$0.005', // List conversations
  'messages:export': '$0.02',        // Export DMs
  
  // Bookmark operations
  'bookmarks:get': '$0.01',          // Get bookmarks
  'bookmarks:folder': '$0.005',      // Create folder
  'bookmarks:clear': '$0.01',        // Clear all bookmarks
  
  // Creator operations
  'creator:analytics': '$0.01',      // Creator analytics
  'creator:revenue': '$0.005',       // Revenue info
  'creator:subscribers': '$0.01',    // Subscriber list
  
  // Spaces operations
  'spaces:live': '$0.005',           // Live Spaces
  'spaces:scheduled': '$0.005',      // Scheduled Spaces
  'spaces:scrape': '$0.01',          // Scrape a Space
  
  // Settings operations
  'settings:get': '$0.005',          // Get settings
  'settings:protected': '$0.005',    // Toggle protected
  'settings:blocked': '$0.01',       // Get blocked accounts
  'settings:muted': '$0.01',         // Get muted accounts
  'settings:download-data': '$0.02', // Request data download
  
  // Grok AI operations
  'grok:query': '$0.02',             // Query Grok
  'grok:summarize': '$0.02',         // Summarize topic
  
  // Business operations
  'business:brand-monitor': '$0.03', // Brand monitoring
  'business:competitor': '$0.03',    // Competitor analysis
  
  // Premium operations
  'premium:check': '$0.001',         // Check premium status
  
  // Article operations
  'article:publish': '$0.05',        // Publish article
  'article:analytics': '$0.01',      // Article analytics

  // Writer operations
  'writer:analyze-voice': '$0.02',   // Analyze writing voice
  'writer:generate': '$0.01',        // Generate tweets in voice
  'writer:rewrite': '$0.005',        // Rewrite/improve tweet
  'writer:calendar': '$0.02',        // Generate content calendar
  'writer:reply': '$0.005',          // Generate reply

  // Analytics operations (browser scripts: viewAnalytics, engagementAnalytics, etc.)
  'analytics:health-score': '$0.01',       // Account health monitor
  'analytics:audience-demographics': '$0.02', // Audience demographics analysis
  'analytics:audience-overlap': '$0.02',   // Audience overlap comparison
  'analytics:best-time': '$0.01',          // Best time to post analysis
  'analytics:competitor': '$0.02',         // Competitor analysis
  'analytics:leaderboard': '$0.01',        // Engagement leaderboard
  'analytics:hashtags': '$0.01',           // Hashtag analytics
  'analytics:sentiment': '$0.02',          // Sentiment analysis
  'analytics:tweet-performance': '$0.01',  // Tweet performance comparison
  'analytics:schedule-optimizer': '$0.01', // Tweet schedule optimizer
  'analytics:overview': '$0.01',           // Analytics overview/dashboard
  'analytics:viral-detector': '$0.01',     // Viral tweet detector
  'analytics:follower-growth': '$0.01',    // Follower growth tracker
  'analytics:follow-ratio': '$0.005',      // Follow ratio manager
  'analytics:ab-test': '$0.02',            // Tweet A/B testing

  // Automation operations (browser scripts: autoReply, autoRepost, etc.)
  'automation:auto-reply': '$0.03',        // Auto-reply to tweets
  'automation:auto-repost': '$0.03',       // Auto-repost matching tweets
  'automation:plug-replies': '$0.02',      // Auto-plug replies on viral tweets
  'automation:engagement-booster': '$0.03', // Systematic engagement booster
  'automation:quote-tweet': '$0.03',       // Auto quote-tweet automation
  'automation:repurpose': '$0.02',         // Content repurposer
  'automation:content-calendar': '$0.02',  // Content calendar planner
  'automation:welcome-followers': '$0.02', // Welcome new followers via DM
  'automation:continuous-monitor': '$0.02', // Continuous follower monitoring
  'automation:keyword-monitor': '$0.02',   // Keyword mention monitor
  'automation:customer-service': '$0.03',  // Customer service automation
  'automation:evergreen': '$0.02',         // Evergreen tweet recycler

  // Community operations (browser scripts: joinCommunities, manageCommunity, etc.)
  'community:join': '$0.01',         // Join communities by keyword
  'community:leave-all': '$0.02',    // Leave all communities
  'community:create': '$0.02',       // Create a community
  'community:manage': '$0.01',       // Manage community members/settings
  'community:notes': '$0.005',       // View/contribute community notes

  // Lists operations (browser scripts: listManager, advancedLists, etc.)
  'lists:manage': '$0.01',           // Create/manage lists
  'lists:advanced': '$0.01',         // Advanced list operations
  'lists:follow': '$0.005',          // Follow/unfollow lists

  // Moderation operations (browser scripts: blockBots, massBlock, etc.)
  'moderation:block-bots': '$0.02',  // Detect and block bots
  'moderation:mass-block': '$0.02',  // Block multiple accounts
  'moderation:mass-unblock': '$0.02', // Unblock multiple accounts
  'moderation:mass-unmute': '$0.01', // Unmute multiple accounts
  'moderation:mute-keywords': '$0.01', // Mute users by keyword
  'moderation:muted-words': '$0.005', // Manage muted words
  'moderation:remove-followers': '$0.02', // Remove followers (soft-block)
  'moderation:report-spam': '$0.01', // Report spam accounts
  'moderation:shadowban-check': '$0.005', // Check shadowban status
  'moderation:verified-only': '$0.005', // Toggle verified-only replies

  // Account operations (browser scripts: backupAccount, auditFollowers, etc.)
  'account:backup': '$0.05',         // Full account backup
  'account:download-data': '$0.02',  // Request data download
  'account:audit-followers': '$0.02', // Audit followers for bots/fakes
  'account:delegate-access': '$0.01', // Manage delegate access
  'account:verify-identity': '$0.005', // ID verification flow
  'account:upload-contacts': '$0.005', // Upload/sync contacts
  'account:multi': '$0.01',          // Multi-account management

  // Ads operations (browser scripts: adCampaignManager, adsManager, etc.)
  'ads:manage': '$0.03',             // Manage ad campaigns
  'ads:dashboard': '$0.01',          // Ads dashboard/analytics
  'ads:media-studio': '$0.02',       // Media Studio management

  // X Pro operations (browser scripts: xPro, xProManager)
  'xpro:dashboard': '$0.01',         // X Pro/TweetDeck dashboard
  'xpro:manage': '$0.01',            // X Pro column management

  // Additional posting operations (browser scripts not yet covered)
  'posting:edit': '$0.005',          // Edit existing post
  'posting:pin': '$0.005',           // Pin/unpin/rotate tweets
  'posting:advanced': '$0.005',      // Advanced post options (undo, formatting)
  'posting:bulk-delete': '$0.05',    // Bulk delete tweets
  'posting:clear-reposts': '$0.03',  // Clear all reposts
  'posting:unlike-all': '$0.03',     // Unlike all posts
  'posting:format': '$0.002',        // Text formatting (bold, italic, etc.)
  'posting:captions': '$0.005',      // Add video captions
  'posting:mention': '$0.005',       // Compose mention post
  'posting:compose-thread': '$0.01', // Thread composer with preview

  // Additional engagement operations
  'engagement:repost': '$0.002',     // Repost a tweet
  'engagement:auto-repost': '$0.02', // Auto-repost by keyword
  'engagement:interactions': '$0.005', // View who liked/reposted/quoted

  // Additional scraping operations
  'scrape:timeline': '$0.005',       // Scrape timeline content
  'scrape:likes': '$0.005',          // Scrape tweet likes
  'scrape:retweets': '$0.005',       // Scrape tweet retweets
  'scrape:bookmarks': '$0.01',       // Scrape bookmarks
  'scrape:tweet-details': '$0.002',  // Scrape single tweet details

  // Additional discovery operations
  'discovery:trending-monitor': '$0.01', // Trending topic monitor
  'discovery:save-search': '$0.002', // Save a search query
  'discovery:saved-searches': '$0.005', // Manage saved searches
  'discovery:topics': '$0.005',      // Manage followed topics

  // Additional messages operations
  'messages:advanced': '$0.01',      // Advanced DM features
  'messages:encrypted': '$0.01',     // Encrypted DMs
  'messages:group': '$0.01',         // Group DM management
  'messages:call': '$0.005',         // DM audio/video calls

  // Additional spaces operations
  'spaces:host': '$0.02',            // Host a new Space
  'spaces:join': '$0.005',           // Join a live Space
  'spaces:advanced': '$0.01',        // Advanced Spaces features

  // Additional premium operations
  'premium:gift': '$0.02',           // Gift Premium subscription
  'premium:subscribe': '$0.005',     // Premium subscription management
  'premium:advanced': '$0.01',       // Advanced Premium features

  // Additional settings operations
  'settings:advanced': '$0.005',     // Advanced settings
  'settings:block-list': '$0.01',    // Block list import/export

  // Additional creator operations
  'creator:studio': '$0.01',         // Creator Studio dashboard
  'creator:subscriptions': '$0.01',  // Creator subscription management

  // Additional monitor operations
  'monitor:following': '$0.01',      // Monitor following changes
  'monitor:continuous': '$0.02',     // Continuous monitoring

  // Utility operations (additional browser scripts)
  'utility:embed': '$0.002',         // Get embed code/share link
  'utility:qr-code': '$0.002',       // Generate QR code for profile
  'utility:follow-account': '$0.005', // Follow specific accounts
};

// Route configuration for x402 middleware
export function getRouteConfig(payTo) {
  const routes = {};
  
  for (const [operation, price] of Object.entries(AI_OPERATION_PRICES)) {
    const [category, action] = operation.split(':');
    const routePath = `POST /api/ai/${category}/${action}`;
    
    routes[routePath] = {
      accepts: [{
        scheme: 'exact',
        price,
        network: NETWORK,
        payTo,
      }],
      description: `AI Agent: ${operation.replace(':', ' - ')}`,
      mimeType: 'application/json',
    };
  }
  
  return routes;
}

/**
 * Validate x402 configuration
 * 
 * In production, this THROWS if payment address is not configured.
 * In development, it warns but allows testnet operation.
 * 
 * @param {boolean} throwOnError - If true, throws ConfigurationError on critical issues
 * @returns {{ valid: boolean, errors: string[], warnings: string[] }}
 */
export function validateConfig(throwOnError = false) {
  const errors = [];
  const warnings = [];
  
  // Check payment address
  if (!PAY_TO_ADDRESS) {
    if (isProduction) {
      errors.push(
        'X402_PAY_TO_ADDRESS is REQUIRED in production. ' +
        'Set your wallet address to receive USDC payments.'
      );
    } else {
      warnings.push(
        'X402_PAY_TO_ADDRESS not set - x402 payments will be disabled in development. ' +
        'Set this environment variable to test payments.'
      );
    }
  } else if (PAY_TO_ADDRESS === '0xYourWalletAddress' || PAY_TO_ADDRESS === '0xYourEthereumAddress') {
    errors.push(
      'X402_PAY_TO_ADDRESS is set to a placeholder value. ' +
      'Update with your actual Ethereum wallet address.'
    );
  } else if (!PAY_TO_ADDRESS.match(/^0x[a-fA-F0-9]{40}$/)) {
    errors.push(
      `X402_PAY_TO_ADDRESS "${PAY_TO_ADDRESS}" is not a valid Ethereum address. ` +
      'Must be 42 characters starting with 0x.'
    );
  }
  
  // Log network status
  if (NETWORK === 'eip155:84532') {
    console.log('⚠️  x402: Running on Base Sepolia TESTNET');
    if (isProduction) {
      warnings.push('Using testnet (Base Sepolia) in production - switch to eip155:8453 for mainnet');
    }
  } else if (NETWORK === 'eip155:8453') {
    console.log('✅ x402: Running on Base MAINNET');
    if (!isProduction) {
      warnings.push('Using mainnet (Base) in development - switch to eip155:84532 for testnet');
    }
  } else {
    warnings.push(`Unknown network: ${NETWORK}`);
  }
  
  const valid = errors.length === 0;
  
  // Throw in production if there are critical errors
  if (throwOnError && !valid) {
    const errorMsg = `\n❌ x402 Configuration Error:\n${errors.map(e => `   • ${e}`).join('\n')}`;
    throw new Error(errorMsg);
  }
  
  // Mark as validated
  configValidated = true;
  
  return { valid, errors, warnings };
}

/**
 * Ensure config has been validated (call on first request)
 * Returns false if payment address is not configured (disables x402)
 */
export function ensureConfigValidated() {
  if (!configValidated) {
    const result = validateConfig();
    
    // Log warnings
    if (result.warnings.length > 0) {
      console.log('⚠️  x402 Configuration Warnings:');
      result.warnings.forEach(w => console.log(`   • ${w}`));
    }
    
    // Log errors (in dev mode, these are non-fatal)
    if (result.errors.length > 0 && !isProduction) {
      console.log('❌ x402 Configuration Errors (non-fatal in development):');
      result.errors.forEach(e => console.log(`   • ${e}`));
    }
  }
  
  // Return whether x402 can operate
  return PAY_TO_ADDRESS && 
         PAY_TO_ADDRESS !== '0xYourWalletAddress' && 
         PAY_TO_ADDRESS !== '0xYourEthereumAddress';
}

/**
 * Check if x402 is properly configured
 */
export function isX402Configured() {
  return PAY_TO_ADDRESS && 
         PAY_TO_ADDRESS.match(/^0x[a-fA-F0-9]{40}$/) &&
         PAY_TO_ADDRESS !== '0xYourWalletAddress' &&
         PAY_TO_ADDRESS !== '0xYourEthereumAddress';
}

// Get human-readable operation name
export function getOperationName(operation) {
  const names = {
    'scrape:profile': 'Scrape Profile',
    'scrape:followers': 'Scrape Followers',
    'scrape:following': 'Scrape Following',
    'scrape:tweets': 'Scrape Tweets',
    'scrape:thread': 'Scrape Thread',
    'scrape:search': 'Search Tweets',
    'scrape:hashtag': 'Scrape Hashtag',
    'scrape:media': 'Scrape Media',
    'action:unfollow-non-followers': 'Unfollow Non-Followers',
    'action:unfollow-everyone': 'Unfollow Everyone',
    'action:detect-unfollowers': 'Detect Unfollowers',
    'action:auto-like': 'Auto Like',
    'action:follow-engagers': 'Follow Engagers',
    'action:keyword-follow': 'Keyword Follow',
    'monitor:account': 'Monitor Account',
    'monitor:followers': 'Monitor Followers',
    'alert:new-followers': 'New Follower Alerts',
    'download:video': 'Download Video',
    'export:bookmarks': 'Export Bookmarks',
    'unroll:thread': 'Unroll Thread',
  };
  return names[operation] || operation;
}
