# OCR

paddleocr, tesseract, easyocr, azure ocr(Form Recognizer 2023-07-31)

![Screenshot_2024-05-07_18-02-58](https://github.com/yoshida-kazuo/ocr/assets/54158856/1d2bb236-ebde-4fcd-aae3-4ffdb2ec12c1)
### 解析結果
![Screenshot_2024-05-07_18-00-25](https://github.com/yoshida-kazuo/ocr/assets/54158856/190ecf83-5e1d-49f4-b799-c1d90cefa206)
### 解析対象フォルダ設定
![Screenshot_2024-05-07_18-01-33](https://github.com/yoshida-kazuo/ocr/assets/54158856/22d8e72f-9b69-4663-b76d-93ad1501e918)
### 解析結果修正確認 :)
![Screenshot_2024-05-07_18-10-57](https://github.com/yoshida-kazuo/ocr/assets/54158856/748f7eb8-8470-43a1-ac11-fb578a673ae1)

## Docker環境
サンプルenvをコピー
```
cp .env-example .env
```

以下適宜設定
```
APP_BUILD_ENV=dev
APP_BUILD_IMAGE=php:8.3-apache
APP_NODE_VERSION=20.11.0
APP_HOST_NAME=sv01.example.jp
APP_BUILD_PATH=docker/${APP_BUILD_ENV}/web
# ローカルソースパスをセット
APP_SOURCE_PATH=~/dev/git/ocr/src
APP_SERVER_PATH=/var/www
APP_SERVER_DOCUMENT_PATH=${APP_SERVER_PATH}/public
APP_IP_ADDRESS=10.255.0.100
# webポートはここで調整
APP_PORT=3030
APP_VITE_PORT=3031
# DB,Redis等のネットワークに参加する。ここでは仮にdefaultとしているが適宜セットすること。
APP_NETWORK=default

# windowsは必ずwsl2を使用すること。またUSER,GROUPは使用環境のuid,gidと合わせる。
APP_GROUP=ubuntu
APP_GROUP_ID=1000
APP_USER=ubuntu
APP_USER_ID=1000

APP_PHP_MEMORY=1G
APP_XDEBUG_CLIENT_HOST=10.255.0.1
APP_XDEBUG_CLIENT_PORT=9003
```

gpuを使用しない場合、`docker-compose.yml` 以下行を削除する。
```
    runtime: nvidia

    ...

      - NVIDIA_VISIBLE_DEVICES=all
      - NVIDIA_VISIBLE_CAPABILITIES=all
```

また稼働演算機に応じて以下を見直す。
```
    deploy:
      resources:
        limits:
          memory: 4GB
          cpus: "4"
```

ビルド
```
docker-compose build
```

## アプリ起動
`src/.env` を生成する
```
cd src
# envを生成しdbアクセス先などを設定する。
cp .env.example .env

docker-compose exec web composer install
docker-compose exec web npm install
docker-compose exec web php artisan key:generate
# マイグレーション実施
docker-compose exec web php artisan migration --path=database/migrations/initialize
docker-compose exec web php artisan migration --path=database/migrations/application
# 初期データ登録
docker-compose exec web php artisan db:seed --class=ProviderSeeder
docker-compose exec web php artisan db:seed --class=RoleSeeder
# ユーザ生成 OP確認 php artisan user:create --help
docker-compose exec web php artisan user:create user@example.jp password --role-id=9

docker-compose exec web npm run dev
```

azure form recognizer を使用する場合は `src/.env` 以下をセット
```
OCR_AZURE_V1_KEY=
OCR_AZURE_V1_ENDPOINT=
```

ブラウザ起動 `http://localhost:3030` へアクセスしよう:)
