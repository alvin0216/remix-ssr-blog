## Alvin‘s Blog

技术框架

1. [remix](https://github.com/remix-run/remix)
2. [prisma](https://github.com/prisma/prisma)
3. [unocss](https://github.com/unocss/unocss)
4. mysql

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

![](https://user-images.githubusercontent.com/34113677/155189577-0650d10c-1253-4e91-b643-cbc49ed6ec2e.png)

仍然在开发中..还有优化的空间～

## 如果该项目对您有所帮助，不妨请作者喝杯奶茶

<img src="public/alipay.png" width="430"> <img src="public/wechat.png" width="430">
