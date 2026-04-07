/**
 * 报告类型编辑抽屉组件 - ReportTypeEditDrawer
 *
 * 报告类型管理的新增/编辑表单，使用 DrawerForm 组件实现。
 * 复用于新增和编辑两种场景：
 * - 新增模式：包含报告名称、目录内容输入、目录文件上传
 * - 编辑模式：仅编辑报告名称
 *
 * 对应 React 原型 ReportTypes.tsx 中的新增/编辑 Modal。
 */
import { reportTypeAdd, reportTypeUpdate } from '@/services/reportTypeApi';
import {
  DrawerForm,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { message } from 'antd';

interface Props {
  /** 抽屉是否打开 */
  open: boolean;
  /** 编辑时传入的报告类型数据，新增时为 null */
  data?: REPORT_TYPE.ReportTypeModel | null;
  /** 抽屉关闭/提交完成的回调 */
  onFinish: () => void;
}

export default function ReportTypeEditDrawer(props: Props) {
  /** 新增报告类型请求 */
  const requestAdd = useRequest(reportTypeAdd, {
    manual: true,
    onSuccess() {
      message.success('新增报告类型成功');
      props.onFinish();
    },
  });

  /** 更新报告类型请求 */
  const requestUpdate = useRequest(reportTypeUpdate, {
    manual: true,
    onSuccess() {
      message.success('更新报告类型成功');
      props.onFinish();
    },
  });

  return (
    <DrawerForm
      open={props.open}
      width={500}
      title={props.data ? '编辑报告类型' : '新增报告类型'}
      drawerProps={{
        destroyOnClose: true,
        onClose: props.onFinish,
      }}
      /** 表单初始值：编辑模式下回填报告名称 */
      initialValues={
        props.data ? { name: props.data.name } : undefined
      }
      onOpenChange={(_open) => !_open && props.onFinish()}
      onFinish={async (values: REPORT_TYPE.ReportTypeFormData) => {
        if (props.data) {
          /* 编辑模式：仅更新名称 */
          await requestUpdate.run({ ...props.data, name: values.name });
        } else {
          /* 新增模式：提交名称和目录内容 */
          await requestAdd.run(values);
        }
        return true;
      }}
    >
      {/* 报告类型名称 */}
      <ProFormText
        name="name"
        label="报告名称"
        rules={[{ required: true, message: '请输入报告类型名称' }]}
        placeholder="请输入报告类型名称"
        fieldProps={{ maxLength: 30, showCount: true }}
      />

      {/* 新增时才显示目录输入区域 */}
      {!props.data && (
        <>
          {/* 目录内容文本输入 */}
          <ProFormTextArea
            name="directoryContent"
            label="目录内容输入"
            placeholder="请输入目录内容，每行一个章节..."
            fieldProps={{
              rows: 5,
              showCount: true,
              maxLength: 2000,
            }}
          />

          {/* 目录文件上传 */}
          <ProFormUploadButton
            name="directoryFile"
            label="或上传目录文件"
            max={1}
            fieldProps={{
              accept: '.txt,.doc,.docx,.pdf',
              beforeUpload: () => false,
            }}
            extra="支持 .txt、.doc、.docx、.pdf 格式"
          />
        </>
      )}
    </DrawerForm>
  );
}
