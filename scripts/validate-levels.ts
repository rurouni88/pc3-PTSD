#!/usr/bin/env tsx
// Build-time level config validation.
// Run via: npm run validate:levels

import { validateLevels } from '../src/config/validate-levels';

const errors = validateLevels();

if (errors.length > 0) {
  console.error('❌ Level config validation failed:');
  for (const e of errors) {
    console.error(`  - ${e}`);
  }
  process.exit(1);
}

console.log('✅ All level configs valid');
