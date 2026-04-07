/**
 * 企业资料库页面 - Enterprise List
 *
 * 对应 React 原型中的 Enterprises.tsx 页面。
 * 功能包括：
 * - 统计概览卡片（总企业数、已生成报告、已公示企业）
 * - 企业列表 ProTable（支持搜索、筛选、分页）
 * - 新增/编辑企业（侧滑 Drawer 表单）
 * - 操作按钮：生成报告、下载报告、公示、编辑、删除
 *
 * 使用 ProTable 组件实现数据表格，复用 StatusTag 和 StatisticCard 组件。
 * 表格列定义与原型中的表头保持一致：企业信息、行业与业务、报告配置、当前状态、操作。
 */
import { DEFAULT_PROTABLE_OPTIONS } from '@/constants';
import StatusTag from '@/components/StatusTag';
import {
  enterprisePages,
  enterprisePublish,
  enterpriseRemove,
} from '@/services/enterpriseApi';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FileTextOutlined,
  GlobalOutlined,
  PlusCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history, useRequest } from '@umijs/max';
import { Button, Col, message, Popconfirm, Row, Statistic, Tooltip } from 'antd';
import { useMemo, useRef, useState } from 'react';
import EnterpriseEditDrawer from './components/EditDrawer';

export default function EnterpriseListPage() {
  /** 编辑抽屉的显示状态 */
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  /** 当前编辑的企业 ID（新增时为空） */
  const [editRecord, setEditRecord] = useState<string | number>('');
  /** ProTable 操作引用，用于触发表格刷新 */
  const tableActionRef = useRef<ActionType | null>();

  /** 删除企业请求 */
  const requestRemove = useRequest(enterpriseRemove, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      tableActionRef.current?.reload();
    },
  });

  /** 公示企业报告请求 */
  const requestPublish = useRequest(enterprisePublish, {
    manual: true,
    onSuccess: () => {
      message.success('公示成功');
      tableActionRef.current?.reload();
    },
  });

  /**
   * ProTable 列定义
   * 与 React 原型中的表格列保持一致：
   * - 企业信息（名称 + 地区）
   * - 行业与业务（行业 + 核心业务）
   * - 报告配置（报告类型 + 资料状态）
   * - 当前状态（已公示/报告已生成/待生成）
   * - 操作列
   */
  const columns = useMemo<ProColumns<ENTERPRISE.EnterpriseModel>[]>(
    () => [
      {
        dataIndex: 'index',
        valueType: 'indexBorder',
        title: '序号',
        width: 50,
        fixed: 'left',
      },
      {
        dataIndex: 'name',
        title: '企业名称',
        copyable: true,
        ellipsis: true,
        width: 200,
        formItemProps: {
          label: '企业名称',
        },
      },
      {
        dataIndex: 'region',
        title: '地区',
        width: 100,
        hideInSearch: true,
      },
      {
        dataIndex: 'industry',
        title: '行业',
        width: 100,
        valueEnum: {
          互联网: { text: '互联网' },
          制造业: { text: '制造业' },
          金融: { text: '金融' },
          医疗: { text: '医疗' },
          教育: { text: '教育' },
          零售: { text: '零售' },
        },
      },
      {
        dataIndex: 'coreBusiness',
        title: '核心业务',
        ellipsis: true,
        width: 180,
        hideInSearch: true,
      },
      {
        dataIndex: 'reportType',
        title: '报告类型',
        width: 130,
        hideInSearch: true,
      },
      {
        dataIndex: 'licenseUploaded',
        title: '资料状态',
        width: 100,
        hideInSearch: true,
        render: (_, record) =>
          record.licenseUploaded ? (
            <StatusTag status="success" text="资料已齐" />
          ) : (
            <StatusTag status="warning" text="资料缺失" />
          ),
      },
      {
        dataIndex: 'status',
        title: '当前状态',
        width: 120,
        hideInTable: true,
        valueEnum: {
          all: { text: '所有状态' },
          pending: { text: '待生成' },
          generated: { text: '已生成(未公示)' },
          published: { text: '已公示' },
        },
      },
      {
        dataIndex: 'published',
        title: '当前状态',
        width: 120,
        hideInSearch: true,
        render: (_, record) => {
          if (record.published) {
            return <StatusTag color="purple" text="已公示" />;
          }
          if (record.reportGenerated) {
            return <StatusTag status="success" text="报告已生成" />;
          }
          return <StatusTag status="default" text="待生成" />;
        },
      },
      {
        title: '操作',
        valueType: 'option',
        width: 220,
        fixed: 'right',
        render: (_, record) => {
          /** 根据企业状态展示不同的操作按钮 */
          const actions = [];

          if (!record.reportGenerated) {
            /* 未生成报告：显示"生成报告"按钮 */
            actions.push(
              <Button
                key="generate"
                type="link"
                size="small"
                icon={<FileTextOutlined />}
                onClick={() => {
                  history.push(
                    `/enterprise/generate/${record.id}`,
                  );
                }}
              >
                生成报告
              </Button>,
            );
          } else {
            /* 已生成报告：显示"下载"按钮 */
            actions.push(
              <Button
                key="download"
                type="link"
                size="small"
                icon={<DownloadOutlined />}
                onClick={() => message.info('报告下载功能（模拟）')}
              >
                下载
              </Button>,
            );
            /* 未公示时显示"公示"按钮 */
            if (!record.published) {
              actions.push(
                <Popconfirm
                  key="publish"
                  title="确定要公示该企业报告吗？"
                  onConfirm={() => requestPublish.run(record.id!)}
                >
                  <Button type="link" size="small">
                    公示
                  </Button>
                </Popconfirm>,
              );
            }
          }

          /* 编辑按钮（所有企业均可操作） */
          actions.push(
            <Tooltip key="edit" title="编辑">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditRecord(record.id!);
                  setOpenEditDrawer(true);
                }}
              />
            </Tooltip>,
          );

          /* 删除按钮 */
          actions.push(
            <Popconfirm
              key="delete"
              okType="danger"
              title="确定要删除该企业吗？"
              onConfirm={() => requestRemove.run(record.id!)}
              okButtonProps={{ loading: requestRemove.loading }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>,
          );

          return actions;
        },
      },
    ],
    [requestRemove.loading, requestPublish.loading],
  );

  return (
    <PageContainer
      title="企业资料库"
      content="管理所有企业客户信息、生成报告及公示状态"
    >
      {/* 统计概览卡片区域，对应原型中的三个统计 Card */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <ProCard hoverable>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb',
                  fontSize: 24,
                }}
              >
                <TeamOutlined />
              </div>
              <Statistic title="总企业数" value={5} />
            </div>
          </ProCard>
        </Col>
        <Col xs={24} sm={8}>
          <ProCard hoverable>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#16a34a',
                  fontSize: 24,
                }}
              >
                <CheckCircleOutlined />
              </div>
              <Statistic title="已生成报告" value={2} />
            </div>
          </ProCard>
        </Col>
        <Col xs={24} sm={8}>
          <ProCard hoverable>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  backgroundColor: '#faf5ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9333ea',
                  fontSize: 24,
                }}
              >
                <GlobalOutlined />
              </div>
              <Statistic title="已公示企业" value={1} />
            </div>
          </ProCard>
        </Col>
      </Row>

      {/* 企业列表 ProTable */}
      <ProTable<ENTERPRISE.EnterpriseModel>
        {...DEFAULT_PROTABLE_OPTIONS}
        actionRef={tableActionRef}
        columns={columns}
        request={enterprisePages}
        scroll={{ x: 'max-content' }}
        toolbar={{
          title: '企业列表',
          actions: [
            <Button
              key="add"
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                setEditRecord('');
                setOpenEditDrawer(true);
              }}
            >
              新增企业
            </Button>,
            <Button key="export" type="dashed" icon={<DownloadOutlined />}>
              导出
            </Button>,
          ],
        }}
      />

      {/* 新增/编辑企业抽屉 */}
      <EnterpriseEditDrawer
        open={openEditDrawer}
        data={editRecord}
        onFinish={() => {
          setOpenEditDrawer(false);
          setEditRecord('');
          tableActionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
}
