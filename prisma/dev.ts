import axios from 'axios';

import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

// axios.get('https://api.github.com/users/alvin0216').then((res) => {
//   // console.log(res.data);

//   db.user
//     .create({
//       data: {
//         id: res.data.id,
//         username: 'alvin0216',
//         github: JSON.stringify(res.data),
//       },
//     })
//     .catch((e) => {
//       console.log('error', e);
//     });
// });

db.msg
  .deleteMany({ where: { postId: '1024' } })
  .then((res) => {
    console.log(res);
  })
  .catch((e) => {
    console.log('error:', e);
  });

// 27bbb4f8-b057-460c-ab15-5bb18c8d62da
// f8290a1b-f651-4824-a989-f694b0d0cf26

// db.comment
//   .create({
//     data: {
//       content: '一条评论',
//       postId: '1b4f13ad-410b-4d1a-a73a-9381ede4f570',
//       userId: '27bbb4f8-b057-460c-ab15-5bb18c8d62da',
//     },
//   })
//   .catch((e) => {
//     console.log('error', e);
//   });

// db.reply
//   .create({
//     data: {
//       content: '二条回复',
//       commentId: 'c4256337-5f2d-4a58-86fa-b6846eed419d',
//       userId: '27bbb4f8-b057-460c-ab15-5bb18c8d62da',
//       replyId: '815ca7c3-da5a-4a40-910a-5b1ee07525e7',
//     },
//   })
//   .catch((e) => {
//     console.log('error', e);
//   });
