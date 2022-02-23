## Alvin‘s Blog

技术框架

1. [remix](https://github.com/remix-run/remix)
2. [react 17.0.2](https://github.com/facebook/react)
3. [unocss](https://github.com/unocss/unocss)
4. [mysql](https://github.com/mysqljs/mysql)
5. [prisma](https://github.com/prisma/prisma)

## 快速上手

- [.env](./.env) 文件配置环境变量，例如 mysql 的访问地址、github 的授权地址
- [config.yml](./config.yml) 是博客的基本配置，比如社交平台、友链等

```json
{
  "postinstall": "remix setup node",
  "start": "remix-serve build",
  "build": "remix build",
  "build:css": "unocss \"app/routes/**/*.tsx\"",
  "dev": "concurrently \"npm run dev:css\" \"remix dev\"",
  "dev:css": "unocss -o ./app/uno.css \"app/**/*.tsx\" --watch",
  "database": "npx prisma db push", // 初始化数据库
  "seed": "ts-node prisma/seed.ts" // 插入数据
}
```

```bash
# 生成数据库表
yarn database

# 初始化数据
yarn seed

# 开始跑
yarn dev
```

Remix App Server started at http://localhost:3333。

![](https://user-images.githubusercontent.com/34113677/155190401-8662dc40-d7ba-4614-92b3-4fd5a4810043.png)

## 性能体现

![](https://user-images.githubusercontent.com/34113677/155289161-67e5b721-345a-4c35-86ab-a7aa95dddd48.png)

![](https://user-images.githubusercontent.com/34113677/155289175-ef19b26d-651c-49d5-af76-88518a8e5262.png)

统计来源：[https://remix.alvin.run](https://remix.alvin.run)。

## 如果该项目对您有所帮助，不妨请作者喝杯奶茶

**微信**

<img src="public/wechat.png" width="180">

**支付宝**

<img src="public/alipay.png" width="180">
