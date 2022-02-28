import { Avatar, Popover } from 'antd';

import { GithubOutlined } from '@ant-design/icons';

interface DisscussAvatarProps {
  isMaster: boolean;
  github: GithubInfo;
}

const DisscussAvatar: React.FC<DisscussAvatarProps> = (props) => {
  const github = props.github;

  if (props.isMaster) {
    return (
      <Popover
        title={
          <>
            <GithubOutlined />
            <span className='ml-2'>{github.login}</span>
          </>
        }
        content={
          <>
            {github.email && (
              <div>
                blog
                <a className='ml-2' target='_blank' rel='noreferrer noopener' href={github.blog}>
                  {github.blog}
                </a>
              </div>
            )}
            {github.email && (
              <div>
                email
                <a className='ml-2' href={`mailto:${github.email}`}>
                  {github.email}
                </a>
              </div>
            )}

            <div>
              github
              <a className='ml-2' target='_blank' rel='noreferrer noopener' href={`https://github.com/${github.login}`}>
                {`https://github.com/${github.login}`}
              </a>
            </div>

            {github.company && (
              <div>
                company <span className='ml-2'>{github.company}</span>
              </div>
            )}
            {github.location && (
              <div>
                location <span className='ml-2'>{github.location}</span>
              </div>
            )}
            <div>
              followers <span className='ml-2'>{github.followers}</span>
            </div>
          </>
        }>
        <Avatar src={github.avatar_url}>{github.name || github.login}</Avatar>
      </Popover>
    );
  }
  return <Avatar src={github.avatar_url}>{github.name || github.login}</Avatar>;
};

export default DisscussAvatar;
