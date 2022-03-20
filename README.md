# SWR でグローバルに状態管理をするときのベストプラクティス

SWR はデータの取得からキャッシュの管理、そしてグローバルに状態の管理までできる非常に便利なライブラリです。  
グローバルな状態管理という文脈では Recoil も有名です。  
fwywd のチームでは外部からのデータ取得があるケースは SWR, そうでない場合には Recoil と使い分けています。

その便利なライブラリである SWR のベストプラクティスを紹介します。  
グローバルな状態管理は非常に便利な一方で React の Custom Hooks で `useState` と同じように使うと状態管理が崩壊するリスクがあります。  
SWR で管理している値にアクセスしたい getter 系と、状態を変化させる setter 系は分けて定義するようにしましょう。

今回は `count` を状態として管理し、カウントアップを行う非常に簡単な例です。  
getter と setter を分けないことで、どのような落とし穴があるか簡単に理解することができます。

## step1

<img src="https://i.gyazo.com/6cfbb4147fcaab3ff131853202f2060c.gif" alt="step1" width="400"/>

`useCount` に `count` と `countUp` をすべて含んだ場合です。

```typescript:hook/useCount.ts
import useSWR from 'swr';

interface UseCount {
  count?: number | null;
  countUp: () => void;
}

export const useCount = (): UseCount => {
  // 非同期処理の疑似的に再現
  const getCount = async (): Promise<number> => {
    return 0;
  };

  const { data: count, mutate } = useSWR('count', getCount);

  const countUp = (): void => {
    mutate((prevCount) => {
      if (prevCount !== undefined) return prevCount + 1;
    }, false);
  };

  return { count, countUp };
};
```

```typescript:component/CountUp.tsx
import { useCount } from '@/hook/useCount';

export const CountUp: React.FC = () => {
  const { countUp } = useCount();
  return (
    <div>
      <button
        onClick={countUp}
        className='rounded bg-primary-800 px-4 py-2 text-white hover:opacity-70'
      >
        UseCount 経由の カウントアップ
      </button>
    </div>
  );
};
```

`countUp` 自体は `count` に依存していないのですが、`count` が変化すると `useCount` に含まれている全てに影響があり、`countUp` を含んだボタンも再レンダリングされていることがわかります。

`mutate` は `setState` とほぼ同じ書き方です。
書き方のコツとして `prevCount` のように `mutate` や `setState` の関数内で Read only な状態を取得することができます。
この方法で状態を更新すれば、状態を Subscribe していないため、状態が変化しても影響を受けることがありません。
レンダリングの抑制などには不可欠な書き方と言えます。

## step2

`count` の状態を変化させる setter 系の処理をすべて `useSetCount` に寄せます。

<img src="https://i.gyazo.com/e9a4d98a523b8029f7fb6f40b40a9765.gif" alt="Step2" width="400"/>

```typescript:useCount.ts
import useSWR, { useSWRConfig } from 'swr';

interface UseSetCount {
  countUp: () => void;
}

interface UseCount extends UseSetCount {
  count?: number | null;
}

export const useCount = (): UseCount => {
  // 非同期処理の疑似的に再現
  const getCount = async (): Promise<number> => {
    return 0;
  };

  const { data: count } = useSWR('count', getCount);

  const setter = useSetCount();

  return { count, ...setter };
};

export const useSetCount = (): UseSetCount => {
  const { mutate } = useSWRConfig();

  const countUp = (): void => {
    mutate(
      'count',
      (count?: number) => {
        if (count !== undefined) return count + 1;
      },
      false,
    );
  };

  return { countUp };
};
```

```typescript:component/CountUp.tsx
import { useSetCount } from '@/hook/useCount';

export const CountUp: React.FC = () => {
  const { countUp } = useSetCount();
  return (
    <div>
      <button
        onClick={countUp}
        className='rounded bg-primary-800 px-4 py-2 text-white hover:opacity-70'
      >
        UseSetCount 経由の カウントアップ
      </button>
    </div>
  );
};
```

## Getting Started

### パッケージのインストール

Git から Clone 後に必要なパッケージのインストールを行います。

```bash
yarn install
```

> 2022/03/15 現在 storybook の依存パッケージの部分で問題が起きています。npm 経由でインストールを行うと「X 件の高い脆弱性が発見されました（found X high severity vulnerabilities）」と警告がでます。yarn ではこの問題を自動的に解消してくれるため **yarn の利用**を推奨しています。

### サーバーの立ち上げ

```bash
yarn dev
```

[http://localhost:3000](http://localhost:3000) にブラウザでアクセスすれば OK です。

### Storybook の立ち上げ

まず始めに src フォルダ直下に component フォルダを作成しましょう（src/component）。作成後以下のコマンドを叩きます。

```bash
yarn sb
```

これで Storybook が [http://localhost:6006](http://localhost:6006) で立ち上がります。

### テスト

Jest でのテストは以下の通りです。

```bash
yarn test
```

## Tips

### バージョン情報

主なパッケージのバージョンは以下の通りです。

- TypeScript：4.5.5
- React：17.0.39
- Next.js：12.1.0
- Tailwind CSS：3.0.23
- React Hook Form：7.27.1
- Zod：3.12.0
- ESLint：8.9.0
- Prettier：2.5.1
- Storybook：6.4.14
- Plop：3.0.5
- Jest：27.5.1
- React Testing Library：12.1.3

### Form

Form 関連は React Hook Form をメインで利用しています。React Hook Form を利用することでコーディング量を減らすことができるだけでなく、レンダリングを効率的に行うことができます。React Hook Form 自体でバリデーションを行えますが、Zod もしくは Yup のようなバリデーション専用のライブラリと連携させることもでき Zod を利用します。

### デプロイ

現状では Vercel と接続すると良いでしょう。アップロード先の GitHub リポジトリを選択すれば問題なくデプロイできるはずです。

### CI/CD

GitHub Actions での CI/CD が標準で設定されています。`main` ブランチに Pull Request or Push した場合に Jest でのテストが動作します。詳細な設定は`.github/workflows.test.yml` を確認してください。

### ESLint/Prettier

[Next.js が推奨する方法](https://nextjs.org/docs/basic-features/eslint)を基本として設定しています。VSCode で保存時に Prettier が適用されるようにもなっているので便利です。ESLint の設定は `.eslintrc` に、Prettier の設定は `package.json` に記載されています。

### コンポーネントの雛形

[PLOP](https://plopjs.com/) を使って Atomic デザインのコンポーネント開発に必要な雛形が自動的に生成できるように設定してあります。以下のコマンドで対話的にコンポーネントの雛形が作成できるため試してみましょう。

```bash
yarn generate
```

PLOP の設定は `generator` ディレクトリを確認してください。

## プロジェクト

### 命名規則

`pages` など Next.js で決められているものを除き、英語は**単数形**を使います。複数形で書くことも海外では多いのですが、日本人だけのチームの時は単数形と複数形で迷う場合が多く、この思考のストレスを少しでも減らすために単数形にしています。今のところは大きな問題に遭遇したことがありません。

### コンポーネントの単位

Atomic デザインを基本としてコンポーネントを設計していきます。

- Atom (Presentational Component)
  - コンポーネントの実装は行わず Tailwind CSS の `@apply` などで決められる範囲内が目安
- Molecule (Presentational Component)
  - 複数の Atom をまとめて使いやすくする程度
- Organism (Presentational Component)
  - SSR / CSR でデータ挿入前の最大の単位
- Template (Container Component)
  - Client Sider Rendering (CSR) でデータ挿入
- Page (Container Component)
  - SSR でデータ挿入

Presentational Component としての実装の最大は Organism として、小：中：大＝ Atom：Molecule：Organism 考えると楽かと思います。Organism に const を含んだ CSR でデータ挿入を行えば Template になり、SSR でデータ挿入を行う場合には Page で管理するイメージです。

### ディレクトリ構造

```bash
kikagaku-next-starter-kit
# ソースコード
├── src
# ファイル置き場
├── public
# Next.js
├── next.config.js
├── next-env.d.ts
# Tailwind CSS
├── tailwind.config.js
├── postcss.config.js
# Jest
├── jest.config.js
├── jest.setup.js
# PLOP
├── generator
# プロジェクトの設定
├── README.md
├── node_modules
├── package.json
├── yarn.lock
└── tsconfig.json
```

ソースコード `src` のディレクトリ構造は以下の通りです。

```bash
./src
├── component
│   ├── atom
│   │   └── [ComponentName]
│   │        ├── index.tsx                    # barrel
│   │        ├── [ComponentName].tsx          # Component
│   │        └── [ComponentName].stories.tsx  # Storybook
│   ├── molecule
│   │   └── [ComponentName]
│   │        ├── index.tsx                    # barrel
│   │        ├── [ComponentName].tsx          # Component
│   │        ├── [ComponentName].type.ts      # Prop Types
│   │        ├── [ComponentName].props.ts     # props for Test & Storybook
│   │        ├── [ComponentName].test.tsx     # Test
│   │        └── [ComponentName].stories.tsx  # Storybook
│   ├── organism
│   │   └── [ComponentName]
│   │        ├── index.tsx                    # barrel
│   │        ├── [ComponentName].tsx          # Component
│   │        ├── [ComponentName].type.ts      # Prop Types
│   │        ├── [ComponentName].props.ts     # props for Test & Storybook
│   │        ├── [ComponentName].test.tsx     # Test
│   │        └── [ComponentName].stories.tsx  # Storybook
│   └── template
│   │   └── [ComponentName]
│   │        ├── index.tsx                    # Container Component
│   │        ├── [ComponentName].tsx          # Presentational Component
│   │        ├── [ComponentName].type.ts      # Presentational Component's Prop Types
│   │        ├── [ComponentName].props.ts     # Presentational props for Test & Storybook
│   │        ├── [ComponentName].test.tsx     # Test for Presentational Component
│   │        └── [ComponentName].stories.tsx  # Storybook
├── pages
│   ├── _app.tsx
│   └── index.tsx
└── style
    └── globals.css  # Tailwind CSS の設定（Atom で使う）
```
