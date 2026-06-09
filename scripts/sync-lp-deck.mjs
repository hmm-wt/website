#!/usr/bin/env node
// sync-lp-deck — mirror the latest built LP Deck PDF into the site's unlisted
// share path so the public link never drifts from the pack build.
//
// The deck is rebuilt out of External/_Source/Capital_Formation_Pack via the
// sponsor pack pipeline. This script copies the freshest build into public/lp/
// under a FIXED, clean filename, so a link already handed to an LP keeps working
// across rebuilds. The path is intentionally readable (not a secret token), so
// "unlisted" here means: /lp/* carries an X-Robots-Tag: noindex header (see
// netlify.toml) and is never linked or sitemapped. It is NOT secret — the path
// is guessable, so don't host anything here that can't tolerate a chance hit.
//
//   npm run sync:deck        # copy the fresh deck into public/lp/ (local only)
//   npm run publish:deck     # copy + commit + push  → Netlify redeploys live
//
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// Fixed share filename. Changing it breaks every link already shared with an LP.
const SHARE_FILENAME = 'fund-i-lp-deck.pdf';

// Built PDF lives one level up from the site repo, in the Drive workspace.
const SOURCE = path.resolve(
  process.cwd(),
  '..',
  'External/Outbound/_built/capital_formation/hmm Ventures Fund I - LP Deck (Confidential).pdf',
);
const REL_DEST = path.join('public', 'lp', SHARE_FILENAME);
const DEST = path.join(process.cwd(), REL_DEST);

const PUBLISH = process.argv.includes('--publish');

function git(args) {
  return execFileSync('git', args, { cwd: process.cwd(), encoding: 'utf8' }).trim();
}

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`✗ Built LP Deck not found at:\n  ${SOURCE}`);
    console.error('  Rebuild the capital formation pack first, then re-run.');
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(DEST), { recursive: true });
  fs.copyFileSync(SOURCE, DEST);

  const kb = (fs.statSync(DEST).size / 1024).toFixed(0);
  console.log(`✓ Synced LP Deck (${kb} KB) → ${REL_DEST}`);
  console.log(`  URL: https://hmm.ventures/lp/${SHARE_FILENAME}`);

  if (!PUBLISH) return;

  // Publish: commit + push only if the deck actually changed. No-op stays quiet.
  git(['add', REL_DEST]);
  const staged = git(['diff', '--cached', '--name-only']);
  if (!staged.includes(REL_DEST)) {
    console.log('• Deck unchanged — nothing to publish.');
    return;
  }
  git(['commit', '-m', 'deck: refresh hosted LP deck']);
  git(['push']);
  console.log('✓ Pushed — Netlify will redeploy the live deck in ~2 min.');
}

main();
