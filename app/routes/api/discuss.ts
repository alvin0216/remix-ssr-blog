import { ActionFunction, redirect } from 'remix';
import { getUserProfile } from '~/auth.server';
import { parseFormData } from '~/utils';
import { db } from '~/utils/db.server';

import type { AddCommentParams, AddReplyParams } from '~/export.types';

export const action: ActionFunction = async ({ request }) => {
  const form = await parseFormData(request);

  const user = await getUserProfile(request);
  const params = {
    ...form,
    userId: user.id,
  };

  if (form.actionType === 'api_add_comment') await api_add_comment(params);
  if (form.actionType === 'api_remove_comment') await api_remove_comment(params);
  if (form.actionType === 'api_add_reply') await api_add_reply(params);
  if (form.actionType === 'api_remove_reply') await api_remove_reply(params);

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
