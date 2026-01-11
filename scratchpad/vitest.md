# Vitest導入計画 - dev/editor

## 概要
dev/editorにVitestを最小構成で導入する。対象はフロントエンド（src/）のみ。

## 必要なパッケージ
```bash
yarn add -D vitest
```

## 変更対象ファイル

### 1. 新規作成: vitest.config.ts
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist"],
  },
});
```

### 2. 新規作成: tsconfig.test.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vitest/globals"],
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false
  },
  "include": [
    "src/**/*.test.ts",
    "src/**/*.test.tsx",
    "src/**/*.spec.ts",
    "src/**/*.spec.tsx"
  ]
}
```

### 3. 編集: tsconfig.json
参照リストに `tsconfig.test.json` を追加:
```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" },
    { "path": "./tsconfig.server.json" },
    { "path": "./tsconfig.test.json" }
  ]
}
```

### 4. 編集: package.json
scriptsセクションに追加:
```json
"test": "vitest",
"test:run": "vitest run"
```

## 実装手順

1. `yarn add -D vitest` でパッケージをインストール
2. `vitest.config.ts` を作成
3. `tsconfig.test.json` を作成
4. `tsconfig.json` に参照を追加
5. `package.json` にスクリプトを追加
6. `yarn test:run` で動作確認

## 今後の拡張（必要に応じて）
- React Testing Library追加: `yarn add -D @testing-library/react @testing-library/jest-dom jsdom`
- カバレッジ追加: `yarn add -D @vitest/coverage-v8`
- `test:coverage` スクリプト追加
