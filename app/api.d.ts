declare interface AddCommentParams {
  redirectUrl: string;
  postId: string;
  comment: string;
}

declare interface AddReplyParams {
  redirectUrl: string;
  reply: string;
  commentId: string;
  replyId: string;
}
