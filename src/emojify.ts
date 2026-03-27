import isIgnored from '@commitlint/is-ignored'
import { fs } from 'zx'

import { getLogger } from './log'

/** Inspired by https://gitmoji.dev/ and https://github.com/folke/devmoji */
const emojiMap = {
  feat: '✨',
  fix: '🐛',
  docs: '📝',
  style: '🎨',
  refactor: '♻️',
  perf: '⚡️',
  test: '✅',
  build: '🏗️',
  ci: '👷',
  chore: '🔧',
} as const

export type CommitType = keyof typeof emojiMap

export interface EmojifyOptions {
  /** Custom emoji map to override default */
  emojiMap?: Record<string, string>
}

/**
 * Add emoji prefix to a conventional commit message
 * @param msgPath - Path to the git commit message file (e.g., .git/COMMIT_EDITMSG)
 * @param options - Optional configuration
 */
export function emojify(msgPath: string, options?: EmojifyOptions) {
  const msg = fs.readFileSync(msgPath, 'utf-8').trim()

  if (isIgnored(msg)) {
    return
  }

  const logger = getLogger()

  const effectiveEmojiMap = options?.emojiMap ?? emojiMap

  // Simplified commit message pattern
  // Supported: type: | emoji type: | type(scope):
  const prefixPattern = /^([^\w\s]{1,2})?\s*(\w+)(?:\([^)]+\))?:/
  const match = msg.match(prefixPattern)

  if (!match) {
    logger.warn(`Unrecognized commit message format, skipping emojify.`)
    return
  }

  const [, existingEmoji, type] = match

  // Check if type is supported
  if (!(type in effectiveEmojiMap)) {
    logger.warn(`Unsupported type: ${type}`)
    return
  }

  const correctEmoji = effectiveEmojiMap[type as keyof typeof effectiveEmojiMap]

  let newMsg: string

  if (existingEmoji) {
    if (existingEmoji === correctEmoji) {
      return
    }
    else {
      logger.warn(`Emoji is incorrect: ${existingEmoji} -> ${correctEmoji} ${type}`)
      const remainder = msg.slice(existingEmoji.length).trimStart()
      newMsg = `${correctEmoji} ${remainder}`
    }
  }
  else {
    logger.info(`Adding emoji: ${correctEmoji} ${type}`)
    newMsg = `${correctEmoji} ${msg}`
  }

  fs.writeFileSync(msgPath, newMsg)
}

export { emojiMap }