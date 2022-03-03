import { ActionFunction, redirect } from 'remix';
import { checkUserProfile } from '~/auth.server';
import { parseFormData } from '~/utils';
import { db } from '~/utils/db.server';

import type { AddCommentParams, AddReplyParams } from '~/export.types';

export const action: ActionFunction = async ({ request }) => {
  const form = await parseFormData(request);

  const { user, isMaster } = await checkUserProfile(request);
  const params = {
    ...form,
    userId: user.id,
    email: user.email,
  };

  switch (form.actionType) {
    case 'api_add_comment':
      await api_add_comment(params);
      await api_add_msg(params);
      break;

    case 'api_add_reply':
      await api_add_reply(params);
      await api_add_msg(params);
      break;

    case 'api_remove_comment':
      // 需要 master 权限
      if (!isMaster) return redirect('/401');
      await api_remove_comment(params);
      break;

    case 'api_remove_reply':
      // 需要 master 权限
      if (!isMaster) return redirect('/401');
      await api_remove_reply(params);
      break;
  }

  return redirect(form.redirectUrl || request.url);
};

export const api_add_comment = async (form: AddCommentParams) => {
  return db.comment.create({
    data: {
      content: form.comment,
      postId: form.postId,
      userId: form.userId,
    },
  });
};

export const api_remove_comment = async (form: { commentId: string; redirectUrl: string }) => {
  return db.comment.delete({ where: { id: form.commentId } });
};

export const api_add_reply = async (form: AddReplyParams) => {
  return db.reply.create({
    data: {
      content: form.reply,
      commentId: form.commentId,
      replyId: form.replyId,
      userId: form.userId,
    },
  });
};

export const api_remove_reply = async (form: { replyId: string; redirectUrl: string }) => {
  return db.reply.delete({
    where: { id: form.replyId },
  });
};

export const api_add_msg = async (params: any) => {
  const data = await db.msg.findFirst({
    where: {
      postId: params.postId,
      userId: params.userId,
    },
  });

  if (!data) {
    await db.msg.create({
      data: {
        postId: params.postId,
        userId: params.userId,
        email: params.email,
      },
    });
  }
};
