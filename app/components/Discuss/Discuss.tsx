import { Avatar, Button, Divider, Input, Popconfirm, Tooltip } from 'antd';
import CommentCom from 'antd/lib/comment';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useMemo, useRef, useState } from 'react';
import { useFetcher, useTransition } from 'remix';
import { DiscussListItem } from '~/export.types';
import useRemixFetcherSubmit from '~/hooks/useRemixFetcherSubmit';
import useSetState from '~/hooks/useSetState';
import { getDiscussCount, translateMd } from '~/utils';

import {
    DeleteOutlined, GithubOutlined, InfoCircleOutlined, UserOutlined
} from '@ant-design/icons';
import { Category, Comment, Post, Reply, Tag, User } from '@prisma/client';

import DisscussAvatar from './DisscussAvatar';

dayjs.extend(relativeTime);

interface UserDataMap {
  // userId
  [key: string]: {
    username: string;
    github: GithubInfo;
  };
}

interface ReplyUserMap {
  [key: string]: number;
}
interface DiscussProps {
  comment: DiscussListItem[];
  context: GlobalContext;
  postId: string;
}

/** 需要在引入的地方导入 action */
const Discuss: React.FC<DiscussProps> = (props) => {
  const { submit, fetcher } = useRemixFetcherSubmit();

  const context = props.context;
  const transition = useTransition();
  const count = getDiscussCount(props.comment);

  const [state, setState] = useSetState({
    comment: '',
    reply: '',
    replyId: '',
    replyCommentId: '',
  });

  const { userMap, replyUserMap } = useMemo(() => {
    const userMap: UserDataMap = {};
    const replyUserMap: ReplyUserMap = {};

    const parse = (user: User) => {
      const github: GithubInfo = JSON.parse(user.github);
      if (!userMap[user.id]) {
        userMap[user.id] = {
          username: github.name || user.username,
          github,
        };
      }
    };

    props.comment.forEach((v1) => {
      parse(v1.user);
      v1.reply.forEach((v2) => {
        parse(v2.user);
        replyUserMap[v2.id] = v2.userId;
      });
    });

    return { userMap, replyUserMap };
  }, [props.comment]);

  const addComment = async () => {
    if (state.comment.trim()) {
      submit('/api/discuss', {
        actionType: 'api_add_comment',
        postId: props.postId,
        comment: state.comment.trim(),
      });
    }
  };

  const addReply = async (commentId: string) => {
    if (state.reply) {
      submit('/api/discuss', {
        actionType: 'api_add_reply',
        postId: props.postId,
        replyId: state.replyId,
        reply: state.reply,
        commentId,
      });
      setTimeout(() => setState({ replyCommentId: '', reply: '' }), 200);
    }
  };

  return (
    <>
      <div className='text-16px'>
        <span className='text-#6190e8 mr-5px' style={{ borderBottom: '1px dotted #6190e8' }}>
          {count}
        </span>
        条评论
      </div>
      <Divider style={{ marginBottom: 0, marginTop: 10 }} />
      <CommentCom
        avatar={<Avatar icon={<UserOutlined />} src={context.user?.avatar_url} />}
        content={
          <Input.TextArea
            rows={4}
            placeholder='说点什么...'
            value={state.comment}
            onChange={(e) => setState({ comment: e.target.value })}
          />
        }
      />
      <div className='mt-8px float-right color-#6190e8 clear-both'>
        <InfoCircleOutlined className='mr-4px' />
        <span className='mr-20px'>支持 Markdown 语法</span>
        {context.user?.id ? (
          <Tooltip title={!state.comment.trim() && '😊 说点什么...'}>
            <Button type='primary' onClick={addComment} loading={transition.state === 'loading'}>
              添加评论
            </Button>
          </Tooltip>
        ) : (
          <Tooltip title='您暂未登录，请点击登录哦～'>
            <Button icon={<GithubOutlined />} onClick={() => submit('/auth/github', null)}>
              添加评论
            </Button>
          </Tooltip>
        )}
      </div>
      <div className='clear-right'>
        {props.comment.map((c) => {
          const cUser = userMap[c.user.id];
          return (
            <CommentCom
              className='clear-both'
              key={c.id}
              author={cUser.username}
              avatar={<DisscussAvatar isMaster={context.isMaster} github={cUser.github} />}
              datetime={
                <Tooltip title={dayjs(c.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                  <span>{dayjs(c.createdAt).fromNow()}</span>
                </Tooltip>
              }
              content={
                <div className='article-detail' dangerouslySetInnerHTML={{ __html: translateMd(c.content, true) }} />
              }
              actions={[
                <span key='1' onClick={() => setState({ replyCommentId: c.id, replyId: '' })}>
                  Reply to
                </span>,
                <>
                  {context.isMaster && (
                    <Popconfirm
                      key='popconfirm'
                      title='是否删除该留言？'
                      cancelText='取消'
                      okText='确认'
                      onConfirm={() => submit('/api/discuss', { actionType: 'api_remove_comment', commentId: c.id })}>
                      <div className='delete-icon text-#f00'>
                        <DeleteOutlined className='cursor-pointer' style={{ verticalAlign: 'middle' }} />
                      </div>
                    </Popconfirm>
                  )}
                </>,
              ]}>
              {state.replyCommentId === c.id && !state.replyId && (
                <>
                  <Input.TextArea
                    rows={4}
                    placeholder={`回复${cUser.username}...`}
                    value={state.reply}
                    onChange={(e) => setState({ reply: e.target.value })}
                    onKeyUp={(e) => e.ctrlKey && (e.key === 'Enter' || e.key === 'Meta') && addReply(c.id)}
                  />

                  <div className='py-10px float-right'>
                    <span className='text-#c2c2c2 text-13px mr-8px'>Ctrl or ⌘ + Enter</span>
                    <Button type='primary' disabled={!state.reply.trim()} onClick={() => addReply(c.id)}>
                      回复
                    </Button>
                  </div>
                </>
              )}

              {c.reply.map((r) => {
                const rUser = userMap[r.user.id];
                return (
                  <CommentCom
                    className='clear-both'
                    key={r.id}
                    actions={[
                      <span key='1' onClick={() => setState({ replyId: r.id, replyCommentId: c.id })}>
                        Reply to
                      </span>,
                      <>
                        {context.isMaster && (
                          <Popconfirm
                            key='popconfirm'
                            title='是否删除该回复？'
                            cancelText='取消'
                            okText='确认'
                            onConfirm={() => submit('/api/discuss', { actionType: 'api_remove_reply', replyId: r.id })}>
                            <div className='delete-icon text-#f00'>
                              <DeleteOutlined className='cursor-pointer' style={{ verticalAlign: 'middle' }} />
                            </div>
                          </Popconfirm>
                        )}
                      </>,
                    ]}
                    author={
                      <span>
                        {rUser.username} 回复 {userMap[replyUserMap[r.replyId]]?.username || cUser.username}
                      </span>
                    }
                    avatar={<DisscussAvatar isMaster={context.isMaster} github={rUser.github} />}
                    datetime={
                      <Tooltip title={dayjs(r.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{dayjs(r.createdAt).fromNow()}</span>
                      </Tooltip>
                    }
                    content={
                      <>
                        <div
                          className='article-detail'
                          dangerouslySetInnerHTML={{ __html: translateMd(r.content, true) }}
                        />
                      </>
                    }>
                    {state.replyId === r.id && state.replyCommentId && (
                      <>
                        <Input.TextArea
                          rows={4}
                          placeholder={`回复${rUser.username}...`}
                          value={state.reply}
                          onChange={(e) => setState({ reply: e.target.value })}
                          onKeyUp={(e) => {
                            (e.ctrlKey || e.metaKey) && e.key === 'Enter' && addReply(c.id);
                          }}
                        />

                        <div className='py-10px float-right'>
                          <span className='text-#c2c2c2 text-13px mr-8px'>Ctrl or ⌘ + Enter</span>
                          <Button type='primary' disabled={!state.reply.trim()} onClick={() => addReply(c.id)}>
                            回复
                          </Button>
                        </div>
                      </>
                    )}
                  </CommentCom>
                );
              })}
            </CommentCom>
          );
        })}
      </div>
    </>
  );
};

export default Discuss;
