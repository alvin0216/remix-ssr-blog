import { Modal, Upload } from 'antd';
import { useImperativeHandle } from 'react';
import useModal from '~/hooks/useModal';

import { InboxOutlined } from '@ant-design/icons';

export type UploadModalRef = { show(): void };

interface UploadModalProps {
  innerRef?: React.Ref<UploadModalRef>;
}

const UploadModal: React.FC<UploadModalProps> = (props) => {
  const { show, close, modalProps } = useModal();

  useImperativeHandle(props.innerRef, () => ({ show }));

  return (
    <Modal {...modalProps} destroyOnClose>
      <Upload.Dragger method='post' name='file' multiple showUploadList={false} action={`/api/posts`} accept='.md'>
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>Click or drag file to this area to upload</p>
        <p className='ant-upload-hint'>
          Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files
        </p>
      </Upload.Dragger>
    </Modal>
  );
};

export default UploadModal;
