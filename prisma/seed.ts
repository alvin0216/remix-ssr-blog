import fs from 'fs-extra';
import { resolve } from 'path';
import YAML from 'yamljs';

import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const fileDir = resolve(__dirname, '../docs');
fs.ensureDirSync(fileDir);

const fileList = fs.readdirSync(fileDir);

const list = fileList.map((file, idx) => {
  const fileStr = fs.readFileSync(resolve(fileDir, file), 'utf8');

  const mdYmlStr =
    fileStr
      .slice(0, 500)
      .match(/---(.*?)---/gs)?.[0]
      ?.replace(/---/g, '') || '';

  const yml = YAML.parse(mdYmlStr);

  return { yml, title: yml.title || file, content: fileStr.slice(mdYmlStr.length + 8) };
});

async function init() {
  const data = await db.post.findUnique({ where: { id: '1024' } });
  if (!data) {
    db.post.create({
      data: {
        id: '1024',
        title: 'discuss page',
        content: '',
      },
    });
  }
}

Promise.all([
  init(),
  ...list.map(({ yml, title, content }) => {
    return db.post.create({
      data: {
        title,
        content,
        tag: {
          create: !yml.tags
            ? undefined
            : Array.isArray(yml.tags)
            ? yml.tags.map((name: string) => ({ name }))
            : [{ name: yml.tags }],
        },
        cate: {
          create: !yml.categories
            ? undefined
            : Array.isArray(yml.categories)
            ? yml.categories.map((name: string) => ({ name }))
            : [{ name: yml.categories }],
        },
      },
    });
  }),
])
  .then(() => {
    console.log('Database has been seeded. 🌱');
  })
  .catch((e) => {
    console.log('seed error:', e);
  });
