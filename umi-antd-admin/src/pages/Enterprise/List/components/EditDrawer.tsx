/**
 * 企业编辑抽屉组件 - EnterpriseEditDrawer
 *
 * 企业资料库的新增/编辑表单，使用 DrawerForm 组件实现侧滑弹窗表单。
 * 复用于新增和编辑两种场景：
 * - 新增模式：data 为空，表单初始化为空
 * - 编辑模式：data 为企业 ID，加载企业详情后回填表单
 *
 * 表单字段对应 React 原型中的新增/编辑企业 Modal：
 * - 企业名称、地区、所在行业、核心业务、报告类型
 * - 营业执照上传、其他资料上传
 *
 * @example
 * ```tsx
 * <EnterpriseEditDrawer
 *   open={openDrawer}
 *   data={editId}
 *   onFinish={() => { setOpenDrawer(false); tableRef.current?.reload(); }}
 * />
 * ```
 */
import {
  enterpriseAdd,
  enterpriseDetail,
  enterpriseUpdate,
} from '@/services/enterpriseApi';
import { reportTypeList } from '@/services/reportTypeApi';
import {
  DrawerForm,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Col, Row, Spin, message } from 'antd';
import { useEffect, useRef } from 'react';

interface Props {
  /** 抽屉是否打开 */
  open: boolean;
  /** 编辑时传入企业 ID，新增时为空 */
  data?: string | number;
  /** 抽屉关闭/提交完成的回调 */
  onFinish: () => void;
}

export default function EnterpriseEditDrawer(props: Props) {
  /** 表单实例引用，用于程序化操作表单（如回填数据） */
  const formRef = useRef<ProFormInstance>();

  /**
   * 请求企业详情（编辑模式时使用）
   * 加载成功后自动回填表单字段
   */
  const requestDetail = useRequest(enterpriseDetail, {
    manual: true,
    onSuccess(data) {
      if (data) {
        formRef.current?.setFieldsValue(data);
      }
    },
  });

  /** 当抽屉打开且有编辑 ID 时，请求企业详情 */
  useEffect(() => {
    if (props.open && props.data) {
      requestDetail.run(props.data);
    }
  }, [props.data, props.open]);

  /** 新增企业请求 */
  const requestAdd = useRequest(enterpriseAdd, {
    manual: true,
    onSuccess() {
      message.success('新增企业成功');
      props.onFinish();
    },
  });

  /** 更新企业请求 */
  const requestUpdate = useRequest(enterpriseUpdate, {
    manual: true,
    onSuccess() {
      message.success('更新企业成功');
      props.onFinish();
    },
  });

  /**
   * 请求报告类型列表
   * 用于报告类型下拉选择框的选项数据
   */
  const { data: reportTypes } = useRequest(reportTypeList);

  return (
    <DrawerForm
      formRef={formRef}
      open={props.open}
      width={600}
      title={props.data ? '编辑企业' : '新增企业'}
      drawerProps={{
        destroyOnClose: true,
        onClose: props.onFinish,
      }}
      onOpenChange={(_open) => !_open && props.onFinish()}
      onFinish={async (values: ENTERPRISE.EnterpriseFormData) => {
        if (props.data) {
          /* 编辑模式：调用更新接口 */
          await requestUpdate.run({ ...values, id: props.data });
        } else {
          /* 新增模式：调用新增接口 */
          await requestAdd.run(values);
        }
        return true;
      }}
    >
      <Spin spinning={requestDetail.loading} tip="加载中...">
        {/* 企业名称 - 独占一行 */}
        <ProFormText
          name="name"
          label="企业名称"
          rules={[{ required: true, message: '请输入企业名称' }]}
          fieldProps={{ maxLength: 50, showCount: true }}
          placeholder="请输入企业名称"
        />

        {/* 地区和行业 - 两列布局 */}
        <Row gutter={16}>
          <Col span={12}>
            <ProFormText
              name="region"
              label="地区"
              rules={[{ required: true, message: '请输入地区' }]}
              placeholder="如：北京"
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="industry"
              label="所在行业"
              rules={[{ required: true, message: '请输入所在行业' }]}
              placeholder="如：互联网"
            />
          </Col>
        </Row>

        {/* 核心业务 */}
        <ProFormText
          name="coreBusiness"
          label="核心业务"
          rules={[{ required: true, message: '请输入核心业务' }]}
          placeholder="请输入核心业务"
        />

        {/* 报告类型 - 下拉选择，选项来自报告类型管理 */}
        <ProFormSelect
          name="reportType"
          label="报告类型"
          rules={[{ required: true, message: '请选择报告类型' }]}
          options={
            reportTypes?.map((rt: REPORT_TYPE.ReportTypeModel) => ({
              label: rt.name,
              value: rt.name,
            })) || [
              { label: '行业研究报告', value: '行业研究报告' },
              { label: '企业尽调报告', value: '企业尽调报告' },
              { label: '市场分析报告', value: '市场分析报告' },
            ]
          }
          placeholder="请选择报告类型"
        />

        {/* 营业执照上传 */}
        <ProFormUploadButton
          name="license"
          label="营业执照上传"
          max={1}
          fieldProps={{
            listType: 'picture-card',
            accept: 'image/*,.pdf',
          }}
          rules={[
            {
              required: !props.data,
              message: '请上传营业执照',
            },
          ]}
          extra="支持 jpg、png、pdf 格式"
        />

        {/* 其他资料上传（可选） */}
        <ProFormUploadButton
          name="otherFiles"
          label="其他资料上传"
          max={5}
          fieldProps={{
            listType: 'text',
            multiple: true,
          }}
          extra="可选，最多上传5个文件"
        />
      </Spin>
    </DrawerForm>
  );
}
