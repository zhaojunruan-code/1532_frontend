/**
 * 权限管理页面 - Permission
 *
 * 对应 React 原型中的 Permissions.tsx 页面。
 * 功能包括：
 * - 用户账号列表展示（ProTable）
 * - 添加/编辑子账号（EditDrawer）
 * - 启用/停用子账号
 * - 删除子账号
 *
 * 表格列与原型保持一致：账号名称、角色权限、状态、创建时间、操作。
 * 总管理员不显示操作按钮（不可被编辑/删除/停用）。
 */
import { DEFAULT_PROTABLE_OPTIONS } from '@/constants';
import StatusTag from '@/components/StatusTag';
import {
  permissionPages,
  permissionRemove,
  permissionToggleStatus,
} from '@/services/permissionApi';
import {
  DeleteOutlined,
  EditOutlined,
  UserAddOutlined,
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
import PermissionEditDrawer from './components/EditDrawer';

export default function PermissionPage() {
  /** 编辑抽屉显示状态 */
  const [openEditDrawer, setOpenEditDrawer] = useState(false);
  /** 当前编辑的用户记录 */
  const [currentRecord, setCurrentRecord] =
    useState<PERMISSION.UserModel | null>(null);
  /** ProTable 操作引用 */
  const tableActionRef = useRef<ActionType | null>();

  /** 删除用户请求 */
  const requestRemove = useRequest(permissionRemove, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功');
      tableActionRef.current?.reload();
    },
  });

  /** 切换用户状态请求 */
  const requestToggle = useRequest(permissionToggleStatus, {
    manual: true,
    onSuccess: () => {
      message.success('状态已更新');
      tableActionRef.current?.reload();
    },
  });

  /**
   * ProTable 列定义
   * 与 React 原型中的表格列保持一致
   */
  const columns = useMemo<ProColumns<PERMISSION.UserModel>[]>(
    () => [
      {
        dataIndex: 'index',
        valueType: 'indexBorder',
        title: '序号',
        width: 50,
      },
      {
        dataIndex: 'username',
        title: '账号名称',
        copyable: true,
      },
      {
        dataIndex: 'role',
        title: '角色权限',
        valueEnum: {
          admin: { text: '总管理员' },
          'sub-admin': { text: '子账号' },
        },
        render: (_, record) =>
          record.role === 'admin' ? (
            <StatusTag color="blue" text="总管理员" />
          ) : (
            <StatusTag status="default" text="子账号" />
          ),
      },
      {
        dataIndex: 'status',
        title: '状态',
        valueEnum: {
          active: { text: '正常', status: 'Success' },
          disabled: { text: '已停用', status: 'Error' },
        },
        render: (_, record) =>
          record.status === 'active' ? (
            <StatusTag status="success" text="正常" />
          ) : (
            <StatusTag status="error" text="已停用" />
          ),
      },
      {
        dataIndex: 'createdAt',
        title: '创建时间',
        hideInSearch: true,
      },
      {
        title: '操作',
        valueType: 'option',
        width: 200,
        render: (_, record) => {
          /* 总管理员不显示操作按钮 */
          if (record.role === 'admin') {
            return <span style={{ color: '#999' }}>-</span>;
          }
          return [
            /* 启用/停用切换按钮 */
            <Popconfirm
              key="toggle"
              title={`确定要${record.status === 'active' ? '停用' : '启用'}该账号吗？`}
              onConfirm={() => requestToggle.run(record.id!)}
              okButtonProps={{ loading: requestToggle.loading }}
            >
              <Button type="link" size="small">
                {record.status === 'active' ? '停用' : '启用'}
              </Button>
            </Popconfirm>,
            /* 编辑按钮 */
            <Tooltip key="edit" title="编辑">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => {
                  setCurrentRecord(record);
                  setOpenEditDrawer(true);
                }}
              />
            </Tooltip>,
            /* 删除按钮 */
            <Popconfirm
              key="delete"
              okType="danger"
              title="确定要删除该账号吗？"
              onConfirm={() => requestRemove.run(record.id!)}
              okButtonProps={{ loading: requestRemove.loading }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>,
          ];
        },
      },
    ],
    [requestRemove.loading, requestToggle.loading],
  );

  return (
    <PageContainer title="权限管理">
      <ProTable<PERMISSION.UserModel>
        {...DEFAULT_PROTABLE_OPTIONS}
        actionRef={tableActionRef}
        columns={columns}
        request={permissionPages}
        toolbar={{
          title: '账号列表',
          actions: [
            <Button
              key="add"
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => {
                setCurrentRecord(null);
                setOpenEditDrawer(true);
              }}
            >
              添加子账号
            </Button>,
          ],
        }}
      />

      {/* 添加/编辑子账号抽屉 */}
      <PermissionEditDrawer
        open={openEditDrawer}
        data={currentRecord}
        onFinish={() => {
          setOpenEditDrawer(false);
          setCurrentRecord(null);
          tableActionRef.current?.reload();
        }}
      />
    </PageContainer>
  );
}
