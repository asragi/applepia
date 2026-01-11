# フロントエンド アーキテクチャガイド

## 設計思想

このコードベースは **Presenter-Viewパターン** を採用し、段階的な複雑度管理を行います。コンポーネントは必要な場合のみ層に分割され、過度な設計を避けています。

## コンポーネント構造

### ファイル構成

```
components/[name]/
  ├── index.tsx       # Container: presenterとviewを接続、パブリックAPIをエクスポート
  ├── view.tsx        # Presentation: 純粋なUI、全てのデータ/ハンドラーをprops経由で受け取る
  ├── presenter.ts    # Logic: 状態管理・副作用・ハンドラーのためのカスタムフック（オプション）
  └── type.ts         # 型定義（オプション）
```

`pages/` も同じ構造に従います。

### 各層の責務

**View (`view.tsx`)**
- 純粋なプレゼンテーショナルコンポーネント
- 全てのデータとハンドラーをpropsで受け取る
- ビジネスロジック・状態管理を持たない
- 焦点: 型付きpropsでUIをレンダリング

**Presenter (`presenter.ts`)** - 必要な場合のみ
- `use[Name]Presenter` という名前のカスタムフック
- 状態管理（`useState`, `useRef`）
- 副作用の処理（routerフック等）
- データ変換（`useMemo`）
- イベントハンドラーの提供（`useCallback`）
- 加工済みデータとハンドラーをviewに返す

**Container (`index.tsx`)**
- presenterとviewを接続
- **データは保持しない**（仮のモックデータのみ配置可能）
- バレルエクスポートパターンでクリーンなインポートを実現

### 複雑度のガイドライン

- **シンプルなコンポーネント**: viewのみ（例: Button, Card）
- **複雑なコンポーネント**: presenter + view（例: Modal, フィルタリング/ページネーションを持つページ）
- ビジネスロジックが存在する場合のみpresenterを追加

## 状態管理

- **グローバル状態管理ライブラリは使用しない**（Redux, Zustand等）
- Reactの組み込み機能を使用:
  - コンポーネントローカル状態（`useState`）
  - ルーティング状態用のReact Router（`useParams`, `useLocation`, `useNavigate`）
  - 共有可能な状態のためのURLパラメータ
  - ページ間データ受け渡しのための`location.state`

## データフロー

```
データソース（Mock/API）
  ↓
Container (index.tsx) - データを保持することがある
  ↓
Presenter Hook - 加工、状態管理
  ↓
View Component - UIをレンダリング
  ↑
ユーザーアクション - presenterのハンドラーをトリガー
```

データは一方向に流れます。状態更新はpresenterで行われ、propsがviewに流れます。

## 関心の分離

**ビジネスロジック**（presenterに配置）
- フィルタリング、ページネーション、計算
- データ変換
- イベント処理
- ルーティングロジック

**UIロジック**（viewに配置）
- レンダリング
- 条件付き表示
- スタイリング（Tailwind + DaisyUI）

## 命名規則

- Presenterフック: `use[Name]Presenter`
- View: `[Name]View`（短い名前で再エクスポートされることが多い）
- Props型: `[Name]Props` または `[Name]ViewProps`

## TypeScript使用方針

- 全てのコンポーネントを完全に型付け
- 明示的なpropsインターフェース
- データフロー全体での型安全性

## ディレクトリ構造

- `/components/` - 再利用可能なUIコンポーネント
- `/pages/` - ルート単位のコンポーネント（`PageLayout`でラップ）
- `/constants/` - 共有定数
- `/hooks/` - 共有カスタムフック（現在未使用、コンポーネントローカルなpresenterを推奨）
- `/utils/` - ユーティリティ関数

## スタイリング方針

**優先順位（上から優先）:**

1. **DaisyUI コンポーネント** - 最優先で使用
   - ボタン、カード、モーダル等の既存コンポーネントを活用
   - DaisyUIの提供するクラス名を使用（例: `btn`, `card`, `modal`）

2. **Tailwind CSS** - DaisyUI適用後の微調整のみ
   - DaisyUIでカバーできない細かい調整に使用
   - マージン、パディング、レイアウト調整など

3. **カスタムCSS** - 極力避ける
   - どうしても必要な場合のみ使用

**スタイリングの基本方針:**
- インライン`className`文字列で記述
- CSSファイルの使用は最小限に

## 技術スタック

- React 19.2.0
- TypeScript 5.9.3
- React Router 7.11.0
- Tailwind CSS 4.1.18 + DaisyUI 5.5.14
- Vite

## 実装チェックリスト

新規コンポーネント作成時:

1. view.tsx から始める（UIのみ）
2. ロジックが必要ならpresenter.ts を追加
3. それらを接続するindex.tsx を作成
4. 型が複雑または共有される場合はtype.ts を追加
5. 関心を分離: UIはview、ロジックはpresenter
6. TypeScriptを厳密に使用
7. 既存のファイル命名パターンに従う
