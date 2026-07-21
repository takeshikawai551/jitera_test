# プロジェクトREADME

## 概要

このプロジェクトは、Django製のバックエンドAPIと、React + Vite製のフロントエンドで構成されたシンプルなアイテム一覧アプリです。

- バックエンド: Django 4.2以上
- フロントエンド: React 19 + Vite 8
- 主な機能:
  - ヘルスチェックAPI
  - 挨拶API
  - アイテムの一覧・作成・更新・削除API（インメモリ実装）
  - アイテム一覧画面での検索・選択

## ディレクトリ構成

```text
/home/test01/work/jitera_test
├── manage.py                 # Django起動エントリーポイント
├── requirements.txt          # Python依存関係
├── myproject/                # Djangoプロジェクト設定
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── myapp/                    # Djangoアプリ
│   ├── urls.py
│   ├── views.py
│   └── front.js              # 旧/参考用のフロント実装
├── frontend/                 # React + Vite フロントエンド
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── ItemListPage.jsx
│       ├── App.css
│       └── index.css
└── new.md                    # 既存メモファイル
```

## バックエンド構成

### Django設定

- `manage.py`
  - `DJANGO_SETTINGS_MODULE` に `myproject.settings` を設定します。
- `myproject/settings.py`
  - `INSTALLED_APPS`: `django.contrib.contenttypes`, `django.contrib.staticfiles`, `myapp`
  - DB: SQLite3
  - `LANGUAGE_CODE`: `ja`
  - `TIME_ZONE`: `Asia/Tokyo`
- `myproject/urls.py`
  - ルートURLで `myapp.urls` を読み込みます。

### APIエンドポイント

`myapp/urls.py` で以下を定義しています。

- `GET /` または `GET /hello/`
  - 挨拶を返します。
  - クエリ: `name`
- `GET /health/`
  - サーバーの死活確認を返します。
- `GET /items/`
  - アイテム一覧取得
- `POST /items/`
  - アイテム作成
- `GET /items/<id>/`
  - 個別取得
- `PUT /items/<id>/`
  - 更新
- `DELETE /items/<id>/`
  - 削除

### 実装詳細

- `myapp/views.py`
  - `health_check(request)`
  - `hello(request)`
  - `ItemView(View)`
- アイテムデータは以下のインメモリ変数で管理されています。
  - `_items: dict[int, dict] = {}`
  - `_next_id = 1`
- `ItemView` は `@csrf_exempt` が付与されています。
- 永続化はされず、サーバー再起動でデータは消えます。

## フロントエンド構成

### 使用技術

- `frontend/package.json`
  - dependencies:
    - `react`
    - `react-dom`
  - devDependencies:
    - `vite`
    - `@vitejs/plugin-react`
    - `@tailwindcss/vite`
    - `tailwindcss`
    - `oxlint`

### 主要ファイル

- `frontend/src/main.jsx`
  - Reactアプリのマウント処理
- `frontend/src/App.jsx`
  - `ItemListPage` を描画
- `frontend/src/ItemListPage.jsx`
  - アイテム一覧画面の本体
  - `fetch('/api/items/')` でデータを取得
  - 検索、複数選択、全選択に対応
- `frontend/vite.config.js`
  - 開発サーバー: `0.0.0.0:5173`
  - `/api` を `http://127.0.0.1:8000` へプロキシ

### 画面機能

`ItemListPage.jsx` には以下のUI機能があります。

- アイテム一覧表示
- 読み込み中表示
- エラー表示
- 名前・金額による検索
- 行単位の選択
- 一括選択
- 金額の日本円表示 (`toLocaleString('ja-JP')`)

## 起動方法

### バックエンド起動

```bash
cd /home/test01/work/jitera_test
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

### フロントエンド起動

```bash
cd /home/test01/work/jitera_test/frontend
npm install
npm run dev
```

## 動作確認の例

### API確認

```bash
curl http://127.0.0.1:8000/health/
curl "http://127.0.0.1:8000/hello/?name=太郎"
curl http://127.0.0.1:8000/items/
```

### アイテム作成

```bash
curl -X POST http://127.0.0.1:8000/items/ \
  -H "Content-Type: application/json" \
  -d '{"name":"サンプル商品","value":1200}'
```

## 補足

- `frontend/README.md` はViteテンプレート由来のREADMEです。
- `myapp/front.js` にはモックデータベースの旧UI実装がありますが、現在のフロントエンド本体は `frontend/src/ItemListPage.jsx` です。
- Django側のAPIパスは `/items/` ですが、フロントエンドでは `/api/items/` にアクセスしています。これは `frontend/vite.config.js` のプロキシ設定を前提にしています。
- 本番利用向けには、CSRF、認証、DB永続化、静的ファイル配信、CORS/配備構成の見直しが必要です。

## 参照ファイル

- `/home/test01/work/jitera_test/manage.py`
- `/home/test01/work/jitera_test/requirements.txt`
- `/home/test01/work/jitera_test/myproject/settings.py`
- `/home/test01/work/jitera_test/myproject/urls.py`
- `/home/test01/work/jitera_test/myapp/urls.py`
- `/home/test01/work/jitera_test/myapp/views.py`
- `/home/test01/work/jitera_test/frontend/package.json`
- `/home/test01/work/jitera_test/frontend/src/App.jsx`
- `/home/test01/work/jitera_test/frontend/src/ItemListPage.jsx`
- `/home/test01/work/jitera_test/frontend/src/main.jsx`
- `/home/test01/work/jitera_test/frontend/vite.config.js`
