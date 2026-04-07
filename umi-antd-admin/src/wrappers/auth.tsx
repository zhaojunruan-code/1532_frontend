import { Navigate, Outlet } from 'umi';

// 这里是权限分配的界面 他会根据权限进行一些界面 按钮的隐藏或者显示

export default () => {
  const isLogin = true;
  if (isLogin) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};
