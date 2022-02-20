## Alvin‘s Blog

技术框架

1. [remix](https://github.com/remix-run/remix)
2. [prisma](https://github.com/prisma/prisma)
3. [unocss](https://github.com/unocss/unocss)

## 快速上手

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

Remix App Server started at http://localhost:3333

![](https://user-images.githubusercontent.com/34113677/154849355-95039f63-9610-4e9f-b359-03e6043e073f.png)
