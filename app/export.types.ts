import { Category, Comment, Post, Reply, Tag, User } from '@prisma/client';

export interface AddCommentParams {
  redirectUrl: string;
  postId: string;
  comment: string;
}

export interface AddReplyParams {
  redirectUrl: string;
  reply: string;
  commentId: string;
  replyId: string;
}

export type DiscussListItem = Comment & {
  reply: (Reply & { user: User })[];
  user: User;
};

export type PostListItem = Post & {
  tag: Tag[];
  cate: Category[];
  comment: DiscussListItem[];
};

export interface CateListItem {
  name: string;
  _count: number;
}
