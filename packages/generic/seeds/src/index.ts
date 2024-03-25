#!/usr/bin/env node

// This is a typescript/esbuild program that load a typescript runner from a Marble seeds
// Check the README of this repo for available commands
import minimist from 'minimist'

import { runner } from './runners/cli/runner'

const args = minimist(process.argv.slice(2))

runner.handler(args).catch((e) => {
  console.error(e)
  process.exit(1)
})
