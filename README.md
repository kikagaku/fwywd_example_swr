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
