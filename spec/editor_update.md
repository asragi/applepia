# マスタデータエディタ UI改修計画

## 概要

サイドバーナビゲーション + テーブル表示形式から、**上部タブナビゲーション + 2カラムレイアウト**に変更する。

### 新UI構造

```
┌──────────────────────────────────────────────────────────┐
│ Master Editor  [アイテム][スキル][探索][ステージ]  💾保存 🔄│
├────────────────────────┬─────────────────────────────────┤
│ 左カラム (w-64)         │ 右カラム (flex-1)                │
│                        │                                 │
│ [+ 新規作成]            │ りんご                 [🗑 削除] │
│ ─────────────          │ ─────────────────────────        │
│ ● りんご  ← 選択中     │ 【編集フォーム】                  │
│   黄金りんご            │ ItemID: [1        ]              │
│   木材                 │ 価格:   [200      ]              │
│   ...                  │ 在庫:   [1000     ]              │
│                        │ ...                             │
│                        │                                 │
│                        │ 関連する探索:                     │
│                        │  [採集] (獲得: 50-100個) → 遷移  │
│                        │  [調理] (消費)           → 遷移  │
└────────────────────────┴─────────────────────────────────┘
```

---

## ファイル変更一覧

### 新規作成 (9ファイル)

| ファイル | 説明 |
|---------|------|
| `components/tab-header/view.tsx` | 上部タブバー + 保存/リロードボタン |
| `components/tab-header/index.tsx` | エクスポート |
| `components/record-list/view.tsx` | 左カラム: レコード名リスト + 新規作成ボタン |
| `components/record-list/index.tsx` | エクスポート |
| `components/record-detail/view.tsx` | 右カラム: タイトル + 削除ボタン + children |
| `components/record-detail/index.tsx` | エクスポート |
| `components/field-editor/view.tsx` | 編集可能フィールドコンポーネント |
| `components/field-editor/index.tsx` | エクスポート |
| `hooks/useNavigateToRecord.ts` | タブ間遷移フック |

### 変更 (9ファイル)

| ファイル | 変更内容 |
|---------|---------|
| `pages/layout/view.tsx` | SidebarView → TabHeaderView に置換 |
| `pages/items/view.tsx` | 2カラムレイアウト + 編集フォーム + リレーションリンク |
| `pages/items/presenter.ts` | URLパラメータ対応 (`?selected=<masterId>`) |
| `pages/skills/view.tsx` | 2カラムレイアウト + 編集フォーム |
| `pages/skills/presenter.ts` | URLパラメータ対応 |
| `pages/explores/view.tsx` | 2カラムレイアウト + 編集フォーム + リレーションリンク |
| `pages/explores/presenter.ts` | URLパラメータ対応 |
| `pages/stages/view.tsx` | 2カラムレイアウト + 編集フォーム |
| `pages/stages/presenter.ts` | URLパラメータ対応 |

### 削除 (2ファイル)

| ファイル | 理由 |
|---------|------|
| `components/sidebar/view.tsx` | TabHeaderに置換 |
| `components/sidebar/index.tsx` | TabHeaderに置換 |

### 変更不要

- `components/relation-list/` - 拡張して再利用（onItemClickにナビゲーション機能追加）
- `components/relation-editor/` - モーダルはそのまま使用
- `components/data-table/` - 今回は不使用だが維持
- `components/detail-panel/` - 維持（必要なら参照）
- `types/`, `api/` - 変更なし

---

## 実装詳細

### 1. TabHeaderView

```tsx
// components/tab-header/view.tsx
type TabHeaderViewProps = {
  onSave: () => void;
  onReload: () => void;
  isSaving: boolean;
  hasChanges: boolean;
};

const tabs = [
  { to: "/items", label: "アイテム" },
  { to: "/skills", label: "スキル" },
  { to: "/explores", label: "探索" },
  { to: "/stages", label: "ステージ" },
];

// DaisyUI tabs tabs-boxed + NavLink
```

### 2. RecordListView

```tsx
// components/record-list/view.tsx
type RecordListViewProps<T extends { id: number }> = {
  items: T[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAdd: () => void;
  getDisplayName: (item: T) => string;
};

// DaisyUI menu + 選択状態ハイライト
```

### 3. RecordDetailView

```tsx
// components/record-detail/view.tsx
type RecordDetailViewProps = {
  title: string;
  children: ReactNode;
  onDelete: () => void;
};

// ヘッダー（タイトル + 削除ボタン）+ children
```

### 4. FieldEditorView

```tsx
// components/field-editor/view.tsx
type Field = {
  key: string;
  label: string;
  type: "text" | "number";
  editable?: boolean;
};

type FieldEditorViewProps = {
  fields: Field[];
  values: Record<string, string | number>;
  onUpdate: (key: string, value: string | number) => void;
};

// グリッドレイアウトでラベル + inputフィールド
```

### 5. useNavigateToRecord

```tsx
// hooks/useNavigateToRecord.ts
export function useNavigateToRecord() {
  const navigate = useNavigate();

  return (targetType: "items" | "skills" | "explores" | "stages", masterId: number) => {
    navigate(`/${targetType}?selected=${masterId}`);
  };
}
```

### 6. 各ページのURLパラメータ対応

```tsx
// presenter.ts に追加
const [searchParams] = useSearchParams();

useEffect(() => {
  const selectedParam = searchParams.get("selected");
  if (selectedParam && data.length > 0) {
    const masterId = Number(selectedParam);
    // マスターIDからレコードを検索
    const record = data.find(item => getMasterId(item) === masterId);
    if (record) {
      setSelectedId(record.id);
    }
  }
}, [searchParams, data]);
```

### 7. RelationListView の拡張

既存の `onItemClick` に遷移機能を実装：

```tsx
// items/view.tsx での使用例
<RelationListView
  title="獲得できる探索"
  items={relatedExplores.earning.map(e => ({
    id: e.id,
    label: e.label,
    description: e.description,
    exploreId: e.exploreId,  // 追加
  }))}
  onItemClick={(id) => {
    const item = relatedExplores.earning.find(e => e.id === id);
    if (item) navigateToRecord("explores", item.exploreId);
  }}
  onRemove={onRemoveEarning}
  onAdd={() => handleOpenModal("earning")}
/>
```

---

## 実装順序

### Phase 1: 新規コンポーネント作成
1. `components/tab-header/`
2. `components/record-list/`
3. `components/record-detail/`
4. `components/field-editor/`
5. `hooks/useNavigateToRecord.ts`

### Phase 2: レイアウト変更
1. `pages/layout/view.tsx` - TabHeaderに置換
2. `components/sidebar/` 削除

### Phase 3: ページ変更（1ページずつ）
1. `pages/items/` - 2カラム化 + URLパラメータ + 編集フォーム + リレーションリンク
2. `pages/explores/` - 同様
3. `pages/skills/` - 同様（リレーションなし）
4. `pages/stages/` - 同様（リレーションなし）

### Phase 4: 動作確認
- タブ切替
- レコード選択・編集
- リレーションリンク遷移
- 新規作成・削除

---

## 注意事項

### マスターIDとテーブルIDの区別

| マスタ | テーブルID | マスターID |
|-------|-----------|-----------|
| Item | `id` | `item_id` |
| Skill | `id` | `SkillId` |
| Explore | `id` | `ExploreId` |
| Stage | `id` | `stage_id` |

リレーションテーブルではマスターIDを使用。遷移時はマスターIDを渡す。

### リレーションの方向

| 起点 | リレーション | 遷移先 |
|-----|-------------|-------|
| Item | EarningItem | → Explore |
| Item | ConsumingItem | → Explore |
| Item | ItemExploreRelation | → Explore |
| Explore | EarningItem | → Item |
| Explore | ConsumingItem | → Item |
| Explore | RequiredSkill | → Skill |
| Explore | SkillGrowth | → Skill |
