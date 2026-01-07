# ゲームデザイン

## ゲームループ

探索 → 陳列 → 販売（予約） → ランキング

## リソース

### スタミナ

- 1スタミナは30秒に相当 (`StaminaSec = 30`)
- 現在スタミナは回復予定時刻から逆算

```
current_stamina = max_stamina - ceil((recover_time - now) / 30sec)
```

- 探索実行後の回復時刻更新

```
recover_time = recover_time + required_stamina * 30sec
```

### 資金

- `fund`は整数
- 消費時は0未満にならない（0未満の場合はエラー）

### 人気度

- `popularity`は0.0〜1.0の範囲
- 販売成功で増加、販売失敗で減少

人気度増加量:

```
BasePopularityGain = 0.1 * 0.01 = 0.001
MinPopularityGain = 0.005 * 0.01 = 0.00005
MaxPopularityGain = 0.5 * 0.01 = 0.005
priceEffect = 2^(log10(price/100))
setPriceEffect = price / set_price
gain = clamp(BasePopularityGain * priceEffect * setPriceEffect, Min, Max)
```

人気度減少量:

```
lost = -2 * gain
```

人気度更新:

```
popularity = clamp(popularity + change, 0, 1)
```

## スキルシステム

### スキルレベル計算

`SkillExp`から`SkillLv`を算出。

```
exp = SkillExp
for lv in 1..99:
  exp -= lv * 10
  if exp < 0: return lv
return 100
```

### スタミナ軽減率

スキルレベルごとに倍率を掛け合わせる。

```
rate = 1.0
for lv in skill_levels:
  if lv > 1:
    rate *= (MaxSkillLv - lv) / MaxSkillLv
```

### 経験値成長

探索実行回数`exec_count`に応じて加算。

```
gain = gaining_point * exec_count
after_exp = before_exp + gain
before_lv = calc_lv(before_exp)
after_lv = calc_lv(after_exp)
```

## 探索システム

### 実行可能判定

実行回数`N`に対して以下を満たすと`is_possible = true`。

- `current_stamina >= required_stamina * N`
- `current_fund >= required_payment * N`
- `item_stock[item_id] >= required_max_count * N`（消費アイテム）
- `skill_level >= required_lv`（必要スキル）

### スタミナ消費計算

探索ごとの基本スタミナ`base`、軽減率`reducible_rate`、スキル倍率`skill_rate`から算出。

```
const = base * (1 - reducible_rate)
vary = base * skill_rate * reducible_rate
required_stamina = max(1, round(const + vary))
```

### アイテム獲得

```
count_i = min + round((max - min) * rand)
earned = sum(count_i) over exec_count
```

### アイテム消費

```
trials = exec_count * max_count
consumed = count(rand < consumption_prob) over trials
```

### 在庫更新

```
after_stock = clamp(stock + earned - consumed, 0, max_stock)
```

### 資金消費

`PostAction`実装では `required_payment` を1回のみ消費（`exec_count`倍ではない）。

### スタミナ消費

`PostAction`実装では `required_stamina` を1回のみ消費。

## 棚システム

### 棚サイズ

- 仕様上のサイズ範囲: 0〜8
- 実装上、target sizeの範囲チェックが行われないためクライアント側で制限する
- `UpdateShelfSize` は `size-to-{size}` の探索アクションを実行してコストを支払う

### 棚内容更新

`UpdateShelfContent` のバリデーション:

- 指定indexが存在する
- 同一アイテムが既に他の棚に載っていない
- 対象アイテムの在庫が1以上

※ `set_price` に数値範囲の制限はなし

## 予約（販売）システム

### 価格ペナルティ

```
PricePenalty = log10(base_price) / 2
```

### アイテム魅力度

```
price_ratio = set_price / base_price
attraction = clamp(
  base_attraction * (1 / price_ratio) ^ PricePenalty,
  0.25 * base_attraction,
  4.0 * base_attraction
)
```

### 棚魅力度

```
shelf_attraction = sum(modified_item_attraction)
```

### 来店客数

```
customer_num_per_hour = int((0.5 + popularity) * shelf_attraction)
```

### 購入確率

```
max_probability = min(0.95, base_probability * 2)
price_ratio = set_price / base_price
powered_ratio = price_ratio ^ PricePenalty

if price_ratio >= 1:
  probability = base_probability / powered_ratio
else:
  failed = 1 - base_probability
  modified_failed = failed * powered_ratio
  probability = clamp(1 - modified_failed, 0, max_probability)
```

### 予約生成

- 対象期間は1時間
- `customer_num_per_hour`に応じて予約時刻を等間隔に配置
- 判定に通った場合のみ予約生成

```
if customer_num_per_hour == 0:
  interval = 2h
else:
  interval = 1h / customer_num_per_hour

scheduled_time = from_time + interval * (i+1)
```

### 販売適用

- 在庫不足時: 人気度減少
- 在庫十分時: 在庫減少、利益加算、人気度増加

## ランキング

- スコア加算は販売時に行う

```
gaining_score = set_price * (popularity + 1)
new_total_score = before_total_score + gaining_score
```

- 期間は`rank_period_table`で管理、`ChangePeriod`で更新
