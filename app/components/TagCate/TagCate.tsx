import { Divider } from 'antd';
import TagCom from 'antd/lib/tag';
import { Link } from 'remix';

import { FolderOutlined } from '@ant-design/icons';
import { Category, Tag } from '@prisma/client';

interface TagCateProps {
  tag: Tag[];
  cate: Category[];
  tagColor: { [key: string]: string };
}

const TagCate: React.FC<TagCateProps> = (props) => {
  return (
    <>
      {props.tag.length > 0 && (
        <>
          <Divider type='vertical' className='mr-7px' />
          <img className='wh-14 mr-7px' src='https://alvin-cdn.oss-cn-shenzhen.aliyuncs.com/images/tag.png' />

          {props.tag.map((t, i) => (
            <TagCom key={t.id} color={props.tagColor[t.name]}>
              <Link to={`/tags/?tag=${t.name}`}>{t.name}</Link>
            </TagCom>
          ))}
        </>
      )}

      {props.cate.length > 0 && (
        <>
          <Divider type='vertical' className='mr-7px' />
          <FolderOutlined className='mr-7px' />

          {props.cate.map((t, i) => (
            <TagCom key={t.id} color='#2db7f5'>
              <Link to={`/categories/?cate=${t.name}`}>{t.name}</Link>
            </TagCom>
          ))}
        </>
      )}
    </>
  );
};

export default TagCate;
