import { redirect } from 'remix';
import { getUserProfile } from '~/auth.server';
import { db } from '~/utils/db.server';

import type { AddCommentParams, AddReplyParams } from '~/export.types';

export const api_add_comment = async (request: Request, form: AddCommentParams) => {
  const user = await getUserProfile(request);
  await db.comment.create({
    data: {
      content: form.comment,
      postId: form.postId,
      userId: user.id,
    },
  });
  return redirect(form.redirectUrl || request.url);
};

export const api_remove_comment = async (
  request: Request,
  form: {
    commentId: string;
    redirectUrl: string;
  }
) => {
  await getUserProfile(request); // check auth
  // await db.reply.deleteMany({
  //   where: { commentId: form.commentId },
  // });

  await db.comment.delete({ where: { id: form.commentId } });
  return redirect(form.redirectUrl || request.url);
};

export const api_add_reply = async (request: Request, form: AddReplyParams) => {
  const user = await getUserProfile(request);
  await db.reply.create({
    data: {
      content: form.reply,
      commentId: form.commentId,
      replyId: form.replyId,
      userId: user.id,
    },
  });
  return redirect(form.redirectUrl || request.url);
};

export const api_remove_reply = async (
  request: Request,
  form: {
    replyId: string;
    redirectUrl: string;
  }
) => {
  await getUserProfile(request); // check auth
  await db.reply.delete({
    where: { id: form.replyId },
  });

  return redirect(form.redirectUrl || request.url);
};
