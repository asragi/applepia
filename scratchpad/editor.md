# マスタデータエディタ実装計画

## 概要

ゲームのマスタデータCSVファイルを直感的に編集できるWebエディタを作成する。
フロントエンドと同じアーキテクチャ（React + TypeScript + Vite + DaisyUI）で構築し、Docker上で起動可能にする。

**方式**: CSVファイル直接編集（バックエンドAPI追加なし）
**認証**: なし（ローカル開発専用）

---

## CSVファイル一覧

| ファイル | 内容 | レコード数 |
|---------|------|-----------|
| item-master.csv | アイテムマスタ | 56 |
| skill-master.csv | スキルマスタ | 21 |
| explore-master.csv | 探索マスタ | 6 |
| stage-master.csv | ステージマスタ | 2 |
| earning-items.csv | 獲得アイテム（探索→アイテム） | 4 |
| consuming-items.csv | 消費アイテム（探索→アイテム） | 4 |
| required-skills.csv | 必要スキル（探索→スキル） | 1 |
| skill-growth.csv | スキル成長（探索→スキル） | - |
| stage-explore-relations.csv | ステージ-探索関連 | - |
| reduction-stamina.csv | スタミナ軽減スキル | 11 |
| item-explore-relations.csv | アイテム-探索関連 | - |

**CSVパス**: `dev/backend/docker/mysql/init/data/`

---

## UI設計

### ナビゲーション構造（直感的な階層操作）

```
サイドバー                    メインエリア
┌─────────────┐              ┌────────────────────────────────────┐
│ 📦 アイテム │──選択───────→│ アイテム一覧テーブル                │
│ ⚡ スキル   │              │ ┌────────────────────────────────┐ │
│ 🗺️ 探索    │              │ │ ID │ 名前    │ 価格  │ 在庫   │ │
│ 🏔️ ステージ│              │ │ 1  │ りんご  │ 200   │ 1000   │ │
│─────────────│              │ │ 2  │ 黄金... │ 20000 │ 1000   │ │
│ 💾 保存    │              │ └────────────────────────────────┘ │
│ 🔄 リロード │              │                                    │
└─────────────┘              │ [行をクリックで詳細パネル展開]      │
                             │ ┌────────────────────────────────┐ │
                             │ │ りんご 詳細編集                 │ │
                             │ │ ─────────────────────────────  │ │
                             │ │ 関連する探索:                   │ │
                             │ │  ├─ 採集 (獲得: 50-100個)       │ │
                             │ │  └─ 調理 (消費)                 │ │
                             │ │      └─ [探索クリックで展開]    │ │
                             │ │         獲得: りんご 50-100     │ │
                             │ │         消費: なし              │ │
                             │ │         必要スキル: なし        │ │
                             │ └────────────────────────────────┘ │
                             └────────────────────────────────────┘
```

### 画面構成

1. **サイドバー**: マスタ種別の切り替え + 保存/リロードボタン
2. **メインテーブル**: 選択中マスタの一覧（インライン編集可）
3. **詳細パネル**: 行選択時に展開、リレーション表示・編集

---

## 技術スタック

フロントエンドと同一:
- React 19 + TypeScript 5.9
- Vite 7
- DaisyUI 5 + Tailwind CSS 4
- React Router 7
- Presenter-View パターン

CSV操作:
- Node.jsバックエンド（Express軽量サーバー）でCSV読み書き

---

## アーキテクチャ

```
┌─────────────────────────────────────────────────────┐
│                   エディタUI (React)                 │
│  - DataTable (インライン編集)                        │
│  - DetailPanel (リレーション表示)                    │
│  - RelationEditor (関連付け編集)                     │
└─────────────────────┬───────────────────────────────┘
                      │ fetch API
                      ▼
┌─────────────────────────────────────────────────────┐
│           軽量APIサーバー (Express/Node.js)          │
│  GET  /api/masters/:type      - CSV読み込み          │
│  PUT  /api/masters/:type      - CSV書き込み          │
│  GET  /api/relations/:type    - リレーションCSV読込  │
│  PUT  /api/relations/:type    - リレーションCSV書込  │
└─────────────────────┬───────────────────────────────┘
                      │ fs読み書き
                      ▼
┌─────────────────────────────────────────────────────┐
│              CSVファイル群                           │
│  dev/backend/docker/mysql/init/data/*.csv           │
└─────────────────────────────────────────────────────┘
```

---

## ディレクトリ構成

```
dev/
├── editor/                          # 新規作成
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── server/                      # Express APIサーバー
│   │   ├── index.ts                 # エントリーポイント
│   │   ├── routes/
│   │   │   ├── masters.ts           # マスタCSV操作
│   │   │   └── relations.ts         # リレーションCSV操作
│   │   └── utils/
│   │       └── csv.ts               # CSV読み書きユーティリティ
│   └── src/                         # React フロントエンド
│       ├── main.tsx
│       ├── App.tsx
│       ├── api/                     # API通信層
│       │   └── client.ts
│       ├── types/                   # 型定義
│       │   ├── masters.ts           # マスタデータ型
│       │   └── relations.ts         # リレーション型
│       ├── components/
│       │   ├── sidebar/             # サイドバー
│       │   ├── data-table/          # 汎用編集テーブル
│       │   ├── detail-panel/        # 詳細パネル
│       │   ├── relation-list/       # リレーションリスト
│       │   ├── relation-editor/     # リレーション編集モーダル
│       │   └── toast/               # 通知
│       └── pages/
│           ├── layout/              # 共通レイアウト
│           ├── items/               # アイテム編集
│           │   ├── presenter.ts
│           │   └── view.tsx
│           ├── skills/              # スキル編集
│           ├── explores/            # 探索編集
│           └── stages/              # ステージ編集
└── backend/
    └── docker/mysql/init/data/      # CSVファイル（既存）
```

---

## 実装フェーズ

### Phase 1: プロジェクト基盤
1. `dev/editor/` ディレクトリ作成
2. package.json（React + Express依存関係）
3. Vite設定、TypeScript設定
4. Dockerfile, docker-compose.yml

### Phase 2: APIサーバー
1. Express サーバー基本構成
2. CSV読み込みAPI（GET /api/masters/:type）
3. CSV書き込みAPI（PUT /api/masters/:type）
4. リレーションCSV操作API

### Phase 3: 基本UI
1. サイドバーコンポーネント
2. 汎用DataTableコンポーネント（インライン編集）
3. レイアウト・ルーティング

### Phase 4: マスタ編集画面
1. アイテム一覧・編集
2. スキル一覧・編集
3. 探索一覧・編集
4. ステージ一覧・編集

### Phase 5: リレーション編集
1. 詳細パネル（リレーション表示）
2. アイテム→関連探索表示
3. 探索→獲得/消費アイテム、必要スキル表示
4. リレーション追加・削除UI

---

## API設計

### マスタデータ

```
GET  /api/masters/items      → item-master.csv の内容をJSON配列で返す
PUT  /api/masters/items      → リクエストボディのJSON配列をCSVに書き込み
GET  /api/masters/skills     → skill-master.csv
PUT  /api/masters/skills
GET  /api/masters/explores   → explore-master.csv
PUT  /api/masters/explores
GET  /api/masters/stages     → stage-master.csv
PUT  /api/masters/stages
```

### リレーション

```
GET  /api/relations/earning-items     → earning-items.csv
PUT  /api/relations/earning-items
GET  /api/relations/consuming-items   → consuming-items.csv
PUT  /api/relations/consuming-items
GET  /api/relations/required-skills   → required-skills.csv
PUT  /api/relations/required-skills
GET  /api/relations/skill-growth      → skill-growth.csv
PUT  /api/relations/skill-growth
GET  /api/relations/stage-explores    → stage-explore-relations.csv
PUT  /api/relations/stage-explores
GET  /api/relations/reduction-stamina → reduction-stamina.csv
PUT  /api/relations/reduction-stamina
GET  /api/relations/item-explores     → item-explore-relations.csv
PUT  /api/relations/item-explores
```

---

## 型定義

```typescript
// マスタデータ型
type ItemMaster = {
  id: number;
  item_id: number;
  DisplayName: string;
  Description: string;
  Price: number;
  MaxStock: number;
  Attraction: number;
  PurchaseProb: number;
};

type SkillMaster = {
  id: number;
  SkillId: number;
  DisplayName: string;
};

type ExploreMaster = {
  id: number;
  ExploreId: number;
  DisplayName: string;
  Description: string;
  ConsumingStamina: number;
  RequiredPayment: number;
  StaminaReducibleRate: number;
};

type StageMaster = {
  id: number;
  StageId: number;
  DisplayName: string;
  Description: string;
};

// リレーション型
type EarningItem = {
  id: number;
  ExploreId: number;
  ItemId: number;
  MinCount: number;
  MaxCount: number;
  probability: number;
};

type ConsumingItem = {
  id: number;
  ExploreId: number;
  ItemId: number;
  MaxCount: number;
  ConsumptionProb: number;
};

type RequiredSkill = {
  id: number;
  ExploreId: number;
  SkillId: number;
  SkillLv: number;
};
```

---

## 主要コンポーネント設計

### DataTable（汎用編集テーブル）

```typescript
type Column<T> = {
  key: keyof T;
  label: string;
  type: 'text' | 'number';
  width?: string;
  editable?: boolean;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onUpdate: (id: number, field: keyof T, value: string | number) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
};
```

### DetailPanel（詳細・リレーションパネル）

```typescript
type DetailPanelProps = {
  type: 'item' | 'explore' | 'stage';
  selectedId: number;
  relations: RelationData[];
  onRelationClick: (relation: RelationData) => void;
  onAddRelation: () => void;
  onRemoveRelation: (relationId: number) => void;
};
```

---

## Docker構成

```yaml
# dev/editor/docker-compose.yml
services:
  editor:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5174:5174"   # フロントエンド
      - "3001:3001"   # APIサーバー
    volumes:
      - .:/app
      - /app/node_modules
      - ../backend/docker/mysql/init/data:/data  # CSVマウント
    environment:
      - CSV_DATA_PATH=/data
```

```dockerfile
# Dockerfile
FROM node:24-alpine3.22
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
EXPOSE 5174 3001
CMD ["yarn", "dev"]
```

---

## 作成するファイル一覧

### 新規作成
- `dev/editor/package.json`
- `dev/editor/tsconfig.json`
- `dev/editor/tsconfig.node.json`
- `dev/editor/vite.config.ts`
- `dev/editor/index.html`
- `dev/editor/Dockerfile`
- `dev/editor/docker-compose.yml`
- `dev/editor/server/index.ts`
- `dev/editor/server/routes/masters.ts`
- `dev/editor/server/routes/relations.ts`
- `dev/editor/server/utils/csv.ts`
- `dev/editor/src/main.tsx`
- `dev/editor/src/App.tsx`
- `dev/editor/src/api/client.ts`
- `dev/editor/src/types/masters.ts`
- `dev/editor/src/types/relations.ts`
- `dev/editor/src/components/sidebar/view.tsx`
- `dev/editor/src/components/data-table/view.tsx`
- `dev/editor/src/components/data-table/presenter.ts`
- `dev/editor/src/components/detail-panel/view.tsx`
- `dev/editor/src/components/relation-list/view.tsx`
- `dev/editor/src/components/relation-editor/view.tsx`
- `dev/editor/src/components/relation-editor/presenter.ts`
- `dev/editor/src/components/toast/view.tsx`
- `dev/editor/src/pages/layout/view.tsx`
- `dev/editor/src/pages/items/view.tsx`
- `dev/editor/src/pages/items/presenter.ts`
- `dev/editor/src/pages/skills/view.tsx`
- `dev/editor/src/pages/skills/presenter.ts`
- `dev/editor/src/pages/explores/view.tsx`
- `dev/editor/src/pages/explores/presenter.ts`
- `dev/editor/src/pages/stages/view.tsx`
- `dev/editor/src/pages/stages/presenter.ts`

### 変更なし
- 既存のCSVファイル（読み書き対象）
- バックエンドコード（変更不要）
