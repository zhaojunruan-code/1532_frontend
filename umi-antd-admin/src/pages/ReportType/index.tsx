/**
 * 报告类型管理页面 - ReportType
 *
 * 对应 React 原型中的 ReportTypes.tsx 页面。
 * 功能包括：
 * - 报告类型列表展示（ProTable）
 * - 新增/编辑报告类型（EditDrawer）
 * - 管理报告目录（DirectoryDrawer）
 * - 删除报告类型
 *
 * 表格列与原型保持一致：报告名称、目录资料数量、最后更新时间、操作。
 */
import { DEFAULT_PROTABLE_OPTIONS } from '@/constants';
import { reportTypePages, reportTypeRemove } from '@/services/reportTypeApi';
import {
  DeleteOutlined,
  EditOutlined,
  FolderOpenOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, message, Popconfirm, Tooltip } from 'antd';
import { useMemo, useRef, useState } from 'react';
import DirectoryDrawer from './components/DirectoryDrawer';
import ReportTypeEditDrawer from './components/EditDrawer';

export default function ReportTypePage() {
  /** 编辑抽屉显示状态 */
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  /** 目录管理抽屉显示状态 */
  const [openDirectoryDrawer, setOpenDirectoryDrawer] = useState(false);
  /** 当前操作的报告类型记录 */
  const [currentRecord, setCurrentRecord] =
    useState<REPORT_TYPE.ReportTypeModel | null>(null);
  /** ProTable 操作引用 */
  const tableActionRef = useRef<ActionType | null>();

  /** 删除报告类型请求 */
  const requestRemove = useRequest(reportTypeRemove, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      tableActionRef.current?.reload();
    },
  });

  /**
   * ProTable 列定义
   * 与 React 原型中的表格列保持一致
   */
  const columns = useMemo<ProColumns<REPORT_TYPE.ReportTypeModel>[]>(
    () => [
      {
        dataIndex: 'index',
        valueType: 'indexBorder',
        title: '序号',
        width: 50,
      },
      {
        dataIndex: 'name',
        title: '报告名称',
        copyable: true,
      },
      {
        dataIndex: 'directoryCount',
        title: '目录资料数量',
        hideInSearch: true,
        renderText: (val: number) => `${val} 个章节`,
      },
      {
        dataIndex: 'updatedAt',
        title: '最后更新时间',
        hideInSearch: true,
      },
      {
        title: '操作',
        valueType: 'option',
        width: 200,
        render: (_, row) => [
          /* 管理目录按钮 */
          <Button
            key="directory"
            type="link"
            size="small"
            icon={<FolderOpenOutlined />}
            onClick={() => {
              setCurrentRecord(row);
              setOpenDirectoryDrawer(true);
            }}
          >
            管理目录
          </Button>,
          /* 编辑按钮 */
          <Tooltip key="edit" title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentRecord(row);
                setOpenEditDrawer(true);
              }}
            />
          </Tooltip>,
          /* 删除按钮 */
          <Popconfirm
            key="delete"
            okType="danger"
            title="确定要删除该报告类型吗？"
            onConfirm={() => requestRemove.run(row.id!)}
            okButtonProps={{ loading: requestRemove.loading }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>,
        ],
      },
    ],
    [requestRemove.loading],
  );

  return (
    <PageContainer title="报告类型管理">
      <ProTable<REPORT_TYPE.ReportTypeModel>
        {...DEFAULT_PROTABLE_OPTIONS}
        actionRef={tableActionRef}
        columns={columns}
        request={reportTypePages}
        toolbar={{
          title: '报告类型列表',
          actions: [
            <Button
              key="add"
              type="primary"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                setCurrentRecord(null);
                setOpenEditDrawer(true);
              }}
            >
              新增类型
            </Button>,
          ],
        }}
      />

      {/* 新增/编辑报告类型抽屉 */}
      <ReportTypeEditDrawer
        open={openEditDrawer}
        data={currentRecord}
        onFinish={() => {
          setOpenEditDrawer(false);
          setCurrentRecord(null);
          tableActionRef.current?.reload();
        }}
      />

      {/* 目录管理抽屉 */}
      <DirectoryDrawer
        open={openDirectoryDrawer}
        data={currentRecord}
        onFinish={() => {
          setOpenDirectoryDrawer(false);
          setCurrentRecord(null);
          tableActionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
}
