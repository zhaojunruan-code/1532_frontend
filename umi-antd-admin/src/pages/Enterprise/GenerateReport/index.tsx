/**
 * 生成 AI 报告页面 - GenerateReport
 *
 * 对应 React 原型中的 GenerateReport.tsx 页面。
 * 功能包括：
 * - 展示目标企业的基本信息（名称、地区、行业、核心业务、报告类型）
 * - 选择报告版本（基础版 / 标准版）
 * - 附加资料上传（可选）
 * - 一键生成并下载 Word 报告（调用后端接口模拟 AI 生成）
 *
 * 页面通过 URL 参数获取企业 ID，从后端加载企业详情数据。
 * 使用 ProCard 组件组织页面布局，Upload 组件处理文件上传。
 */
import { enterpriseDetail, enterpriseGenerateReport } from '@/services/enterpriseApi';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloudUploadOutlined,
  FileTextOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { history, useParams, useRequest } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Descriptions,
  message,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
  Upload,
} from 'antd';
import { useState } from 'react';

export default function GenerateReportPage() {
  /** 从 URL 参数获取企业 ID */
  const { id } = useParams<{ id: string }>();

  /** 报告版本选择状态：basic=基础版 / standard=标准版 */
  const [reportVersion, setReportVersion] = useState<'basic' | 'standard'>(
    'basic',
  );
  /** 附加上传的文件列表 */
  const [fileList, setFileList] = useState<any[]>([]);
  /** 报告是否已生成成功 */
  const [isSuccess, setIsSuccess] = useState(false);

  /**
   * 请求企业详情
   * 页面加载时自动发起请求
   */
  const { data: enterprise, loading: detailLoading } = useRequest(
    () => enterpriseDetail(id!),
    {
      ready: !!id,
    },
  );

  /**
   * 生成 AI 报告请求
   * 手动触发，带 3 秒延迟模拟 AI 生成过程
   */
  const requestGenerate = useRequest(enterpriseGenerateReport, {
    manual: true,
    onSuccess: () => {
      setIsSuccess(true);
      message.success('报告生成成功！已开始下载');
      setTimeout(() => setIsSuccess(false), 5000);
    },
  });

  /** 处理生成报告按钮点击 */
  const handleGenerate = () => {
    if (!id) return;
    requestGenerate.run({ id, version: reportVersion });
  };

  /**
   * 版本选择卡片的样式函数
   * 选中时显示蓝色边框和浅蓝背景
   */
  const getVersionCardStyle = (version: 'basic' | 'standard') => ({
    border:
      reportVersion === version ? '2px solid #1890ff' : '1px solid #d9d9d9',
    borderRadius: 8,
    padding: 16,
    cursor: 'pointer',
    backgroundColor: reportVersion === version ? '#e6f7ff' : '#fff',
    transition: 'all 0.3s',
  });

  return (
    <PageContainer
      title="生成AI报告"
      onBack={() => history.push('/enterprise')}
      backIcon={<ArrowLeftOutlined />}
    >
      <Spin spinning={detailLoading}>
        {enterprise ? (
          <Row gutter={[0, 16]} style={{ maxWidth: 800, margin: '0 auto' }}>
            {/* 企业信息卡片，对应原型中的第一个 Card */}
            <Col span={24}>
              <ProCard title="企业信息" headerBordered>
                <Descriptions column={{ xs: 1, sm: 2 }}>
                  <Descriptions.Item label="企业名称" span={2}>
                    <Typography.Text strong>
                      {enterprise.name}
                    </Typography.Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="地区">
                    {enterprise.region}
                  </Descriptions.Item>
                  <Descriptions.Item label="行业">
                    {enterprise.industry}
                  </Descriptions.Item>
                  <Descriptions.Item label="核心业务" span={2}>
                    {enterprise.coreBusiness}
                  </Descriptions.Item>
                  <Descriptions.Item label="目标报告类型">
                    <Tag color="blue">{enterprise.reportType}</Tag>
                  </Descriptions.Item>
                </Descriptions>
              </ProCard>
            </Col>

            {/* 报告配置与生成卡片，对应原型中的第二个 Card */}
            <Col span={24}>
              <ProCard title="报告配置与生成" headerBordered>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  {/* 报告版本选择区域 */}
                  <div>
                    <Typography.Text strong style={{ marginBottom: 12, display: 'block' }}>
                      选择报告版本
                    </Typography.Text>
                    <Row gutter={16}>
                      {/* 基础版选项 */}
                      <Col xs={24} sm={12}>
                        <div
                          style={getVersionCardStyle('basic')}
                          onClick={() => setReportVersion('basic')}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 4,
                            }}
                          >
                            <Typography.Text strong>基础版</Typography.Text>
                            {reportVersion === 'basic' && (
                              <CheckCircleOutlined
                                style={{ color: '#1890ff', fontSize: 16 }}
                              />
                            )}
                          </div>
                          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            15,000 - 25,000 字
                          </Typography.Text>
                          <br />
                          <Typography.Text
                            type="secondary"
                            style={{ fontSize: 12 }}
                          >
                            包含行业概况、企业基本面分析、核心竞争力评估。
                          </Typography.Text>
                        </div>
                      </Col>
                      {/* 标准版选项 */}
                      <Col xs={24} sm={12}>
                        <div
                          style={getVersionCardStyle('standard')}
                          onClick={() => setReportVersion('standard')}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 4,
                            }}
                          >
                            <Typography.Text strong>标准版</Typography.Text>
                            {reportVersion === 'standard' && (
                              <CheckCircleOutlined
                                style={{ color: '#1890ff', fontSize: 16 }}
                              />
                            )}
                          </div>
                          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                            ＞ 30,000 字
                          </Typography.Text>
                          <br />
                          <Typography.Text
                            type="secondary"
                            style={{ fontSize: 12 }}
                          >
                            深度行业研究、财务模型预测、风险评估及战略建议。
                          </Typography.Text>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* 附加资料上传区域 */}
                  <div>
                    <Typography.Text strong style={{ marginBottom: 12, display: 'block' }}>
                      附加资料上传 (可选)
                    </Typography.Text>
                    <Upload.Dragger
                      fileList={fileList}
                      onChange={({ fileList: newList }) => setFileList(newList)}
                      multiple
                      beforeUpload={() => false}
                    >
                      <p className="ant-upload-drag-icon">
                        <CloudUploadOutlined
                          style={{ color: '#999', fontSize: 40 }}
                        />
                      </p>
                      <p className="ant-upload-text">
                        点击或拖拽文件至此处上传
                      </p>
                      <p className="ant-upload-hint">
                        支持 PDF, Word, Excel, 图片等格式，用于辅助AI生成
                      </p>
                    </Upload.Dragger>
                  </div>

                  {/* 生成报告按钮 */}
                  <div
                    style={{
                      borderTop: '1px solid #f0f0f0',
                      paddingTop: 24,
                      textAlign: 'center',
                    }}
                  >
                    <Button
                      type="primary"
                      size="large"
                      block
                      style={{
                        height: 56,
                        fontSize: 16,
                        ...(isSuccess
                          ? {
                              backgroundColor: '#52c41a',
                              borderColor: '#52c41a',
                            }
                          : {}),
                      }}
                      onClick={handleGenerate}
                      loading={requestGenerate.loading}
                      disabled={isSuccess}
                      icon={
                        isSuccess ? (
                          <CheckCircleOutlined />
                        ) : requestGenerate.loading ? (
                          <LoadingOutlined />
                        ) : (
                          <FileTextOutlined />
                        )
                      }
                    >
                      {requestGenerate.loading
                        ? 'AI 正在生成并导出 Word 文档...'
                        : isSuccess
                          ? '生成成功！已开始下载'
                          : '一键生成并下载 Word 报告'}
                    </Button>
                    <Typography.Text
                      type="secondary"
                      style={{ fontSize: 12, marginTop: 12, display: 'block' }}
                    >
                      点击生成后，系统将结合企业信息及附加资料，自动生成 Word
                      格式的报告并下载到本地。
                    </Typography.Text>
                  </div>
                </Space>
              </ProCard>
            </Col>
          </Row>
        ) : (
          /* 企业数据不存在时的空状态 */
          !detailLoading && (
            <Card style={{ textAlign: 'center', padding: 40 }}>
              <Typography.Text type="secondary">
                未找到企业信息
              </Typography.Text>
              <br />
              <Button
                type="primary"
                style={{ marginTop: 16 }}
                onClick={() => history.push('/enterprise')}
              >
                返回企业列表
              </Button>
            </Card>
          )
        )}
      </Spin>
    </PageContainer>
  );
}
