/**
 * 目录管理抽屉组件 - DirectoryDrawer
 *
 * 报告类型的目录内容管理，使用 DrawerForm 组件实现。
 * 用户可以在文本域中编辑报告的目录章节内容，每行一个章节。
 *
 * 对应 React 原型 ReportTypes.tsx 中的"管理目录"Modal。
 */
import { reportTypeUpdateDirectory } from '@/services/reportTypeApi';
import { DrawerForm, ProFormTextArea } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { message } from 'antd';

interface Props {
  /** 抽屉是否打开 */
  open: boolean;
  /** 当前操作的报告类型数据 */
  data?: REPORT_TYPE.ReportTypeModel | null;
  /** 抽屉关闭/提交完成的回调 */
  onFinish: () => void;
}

export default function DirectoryDrawer(props: Props) {
  /** 更新目录内容请求 */
  const requestUpdate = useRequest(reportTypeUpdateDirectory, {
    manual: true,
    onSuccess() {
      message.success('目录更新成功');
      props.onFinish();
    },
  });

  return (
    <DrawerForm
      open={props.open}
      width={500}
      title={`管理目录 - ${props.data?.name || ''}`}
      drawerProps={{
        destroyOnClose: true,
        onClose: props.onFinish,
      }}
      onOpenChange={(_open) => !_open && props.onFinish()}
      onFinish={async (values: { directoryContent: string }) => {
        if (props.data?.id) {
          await requestUpdate.run({
            id: props.data.id,
            directoryContent: values.directoryContent,
          });
        }
        return true;
      }}
    >
      {/* 目录内容编辑区域 */}
      <ProFormTextArea
        name="directoryContent"
        label="目录内容"
        placeholder="请输入目录内容，每行一个章节..."
        fieldProps={{
          rows: 12,
          showCount: true,
          maxLength: 5000,
        }}
        extra="每行代表一个章节，保存后将自动统计章节数量"
      />
    </DrawerForm>
  );
}
