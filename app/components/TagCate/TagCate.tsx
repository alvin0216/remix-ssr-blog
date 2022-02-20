import { Divider } from 'antd';
import TagCom from 'antd/lib/tag';
import { Link } from 'remix';

import { FolderOutlined } from '@ant-design/icons';
import { Category, Tag } from '@prisma/client';

import TagIcon from './tags.svg';

const colorList = [
  'magenta',
  'blue',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'geekblue',
  'purple',
];

interface TagCateProps {
  tag: Tag[];
  cate: Category[];
}

const TagCate: React.FC<TagCateProps> = (props) => {
  return (
    <>
      {props.tag.length > 0 && (
        <>
          <Divider type='vertical' className='mr-7px' />
          <img className='wh-14 mr-7px' src='https://gitee.com/alvin0216/cdn/raw/master/images/tag.png' />

          {props.tag.map((t, i) => (
            <TagCom key={t.id} color={colorList[i]}>
              <Link to={`/tags/${t.name}`}>{t.name}</Link>
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
              <Link to={`/tags/${t.name}`}>{t.name}</Link>
            </TagCom>
          ))}
        </>
      )}
    </>
  );
};

export default TagCate;
