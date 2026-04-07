/**
 * 用户账号编辑抽屉组件 - PermissionEditDrawer
 *
 * 权限管理的添加/编辑子账号表单，使用 DrawerForm 组件实现。
 * 复用于新增和编辑两种场景：
 * - 新增模式：包含账号名称、初始密码、角色权限
 * - 编辑模式：包含账号名称、重置密码（可选）、角色权限
 *
 * 对应 React 原型 Permissions.tsx 中的添加/编辑 Modal。
 */
import { permissionAdd, permissionUpdate } from '@/services/permissionApi';
import {
  DrawerForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { message } from 'antd';

interface Props {
  /** 抽屉是否打开 */
  open: boolean;
  /** 编辑时传入的用户数据，新增时为 null */
  data?: PERMISSION.UserModel | null;
  /** 抽屉关闭/提交完成的回调 */
  onFinish: () => void;
}

export default function PermissionEditDrawer(props: Props) {
  /** 新增用户请求 */
  const requestAdd = useRequest(permissionAdd, {
    manual: true,
    onSuccess() {
      message.success('添加账号成功');
      props.onFinish();
    },
  });

  /** 更新用户请求 */
  const requestUpdate = useRequest(permissionUpdate, {
    manual: true,
    onSuccess() {
      message.success('更新账号成功');
      props.onFinish();
    },
  });

  return (
    <DrawerForm
      open={props.open}
      width={450}
      title={props.data ? '编辑账号' : '添加子账号'}
      drawerProps={{
        destroyOnClose: true,
        onClose: props.onFinish,
      }}
      /** 编辑模式下回填用户数据 */
      initialValues={
        props.data
          ? {
              username: props.data.username,
              role: props.data.role,
            }
          : { role: 'sub-admin' }
      }
      onOpenChange={(_open) => !_open && props.onFinish()}
      onFinish={async (values: PERMISSION.UserFormData) => {
        if (props.data) {
          /* 编辑模式 */
          await requestUpdate.run({
            id: props.data.id,
            ...values,
          });
        } else {
          /* 新增模式 */
          await requestAdd.run(values);
        }
        return true;
      }}
    >
      {/* 账号名称 */}
      <ProFormText
        name="username"
        label="账号名称"
        rules={[{ required: true, message: '请输入登录账号' }]}
        placeholder="请输入登录账号"
        fieldProps={{ maxLength: 30, showCount: true }}
      />

      {/* 密码字段：新增时为必填的初始密码，编辑时为可选的重置密码 */}
      <ProFormText.Password
        name="password"
        label={props.data ? '重置密码 (可选)' : '初始密码'}
        rules={
          props.data
            ? []
            : [{ required: true, message: '请输入初始密码' }]
        }
        placeholder={props.data ? '留空则不修改密码' : '请输入初始密码'}
      />

      {/* 角色权限选择 */}
      <ProFormSelect
        name="role"
        label="角色权限"
        rules={[{ required: true, message: '请选择角色权限' }]}
        options={[
          { label: '子账号 (受限访问)', value: 'sub-admin' },
          { label: '管理员 (完全访问)', value: 'admin' },
        ]}
      />
    </DrawerForm>
  );
}
