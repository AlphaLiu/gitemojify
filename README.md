# gitemojify

Add emoji prefix to conventional commit messages automatically.

## Installation

```bash
npm install -D gitemojify
# or
pnpm add -D gitemojify
# or
yarn add -D gitemojify
# or
bun add -D gitemojify
```

## Usage

### With Husky

Add to your `.husky/commit-msg` hook:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
npx --no -- gitemojify $1
```

Or with bun:

```bash
bunx --no -- commitlint --edit $1
bunx --no -- gitemojify $1
```

### How it works

The tool reads your commit message from the git commit message file, parses the conventional commit type, and adds the corresponding emoji prefix:

| Type | Emoji |
|------|-------|
| feat | ✨ |
| fix | 🐛 |
| docs | 📝 |
| style | 🎨 |
| refactor | ♻️ |
| perf | ⚡️ |
| test | ✅ |
| build | 🏗️ |
| ci | 👷 |
| chore | 🔧 |

### Examples

| Before | After |
|--------|-------|
| `feat: add new feature` | `✨ feat: add new feature` |
| `fix(auth): resolve login issue` | `🐛 fix(auth): resolve login issue` |
| `docs: update readme` | `📝 docs: update readme` |

### Programmatic API

```typescript
import { emojify, emojiMap } from 'gitemojify'

// Emojify a commit message file
emojify('.git/COMMIT_EDITMSG')

// With custom emoji map
emojify('.git/COMMIT_EDITMSG', {
  emojiMap: {
    ...emojiMap,
    release: '🚀',
  },
})
```

## Inspired by

- [@janna/lint](https://github.com/jannajs/lint) - emojify feature
- [gitmoji](https://gitmoji.dev/)
- [devmoji](https://github.com/folke/devmoji)

## License

MIT