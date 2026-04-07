import { login } from '@/services/loginApi';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginFormPage, ProConfigProvider, ProFormText } from '@ant-design/pro-components';
import { history, useRequest } from '@umijs/max';
import { Button, Divider, GlobalToken, theme } from 'antd';

const LoginPage = () => {
  const { token } = theme.useToken();

  /** 登录请求：成功后跳转到数据概览页 */
  const requestLogin = useRequest(login, {
    manual: true,
    loadingDelay: 1000,
    onSuccess: () => {
      history.replace('/dashboard');
    },
  });

  return (
    <div style={{ height: '100vh' }}>
      <LoginFormPage
        backgroundImageUrl="https://mdn.alipayobjects.com/huamei_gcee1x/afts/img/A*y0ZTS6WLwvgAAAAAAAAAAAAADml6AQ/fmt.webp"
        // 后续根据接口获取
        // logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
        backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
        title="智能ESG报告生成"
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0,0.65)',
          backdropFilter: 'blur(4px)',
        }}
        subTitle=" "
        // activityConfig={getActivityConfig(token)}
        actions={
          <div>
            <Divider plain>
              <span
                style={{
                  color: token.colorTextPlaceholder,
                  fontWeight: 'normal',
                  fontSize: 14,
                }}
              >
                忘记秘密？请联系管理员
              </span>
            </Divider>
          </div>
        }
        onFinish={async (values) => {
          history.replace('/dashboard');
          await requestLogin.run(values);
          return true;
        }}
      >
        <ProFormText
          name="account"
          width="md"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined />,
          }}
          placeholder={'账号'}
          rules={[
            {
              required: true,
              message: '请输入账号!',
            },
          ]}
        />
        <ProFormText.Password
          name="password"
          width="md"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined />,
          }}
          placeholder={'密码'}
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
      </LoginFormPage>
    </div>
  );
};

export default () => {
  return (
    <ProConfigProvider dark>
      <LoginPage />
    </ProConfigProvider>
  );
};
