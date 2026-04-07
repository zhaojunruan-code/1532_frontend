/**
 * 数据概览页面 - Dashboard
 *
 * 对应 React 原型中的 Dashboard.tsx 页面。
 * 展示系统核心数据统计信息，包括：
 * - 四个统计卡片：报告种类数量、客户数量、地区数量、行业数量
 * - 行业名称及数量分布柱状图
 * - 时间范围筛选器（今日/本周/本月/本年/全部）
 *
 * 使用 @ant-design/charts 的 Column 组件绘制柱状图，
 * 复用自定义 StatisticCard 组件展示统计数据。
 */
import StatisticCard from '@/components/StatisticCard';
import {
  getDashboardStats,
  getIndustryDistribution,
} from '@/services/enterpriseApi';
import {
  BarChartOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Col, Row, Select, Spin } from 'antd';
import { useState } from 'react';
import { Column, ColumnConfig } from '@ant-design/charts';

export default function DashboardPage() {
  /** 时间范围筛选状态 */
  const [timeRange, setTimeRange] = useState<string>('this-month');

  /**
   * 请求 Dashboard 统计数据
   * 使用 useRequest 自动发起请求并管理 loading 状态
   */
  const { data: stats, loading: statsLoading } = useRequest(getDashboardStats);

  /**
   * 请求行业分布数据
   * 用于柱状图展示
   */
  const { data: industryData, loading: chartLoading } = useRequest(
    getIndustryDistribution,
  );

  /**
   * 柱状图配置
   * 参照 React 原型中的 Recharts BarChart 配置进行适配
   */
  const chartConfig: ColumnConfig = {
    data: industryData || [],
    xField: 'name',
    yField: 'value',
    color: '#3b82f6',
    columnWidthRatio: 0.4,
    label: {
      position: 'top' as const,
      style: {
        fill: '#6b7280',
        fontSize: 12,
      },
    },
    xAxis: {
      label: {
        style: {
          fill: '#6b7280',
          fontSize: 12,
        },
      },
    },
    yAxis: {
      label: {
        style: {
          fill: '#6b7280',
          fontSize: 12,
        },
      },
    },
    meta: {
      name: { alias: '行业名称' },
      value: { alias: '数量' },
    },
  };

  return (
    <PageContainer
      title="数据概览"
      extra={
        /* 时间范围筛选器，对应原型中的 Select 组件 */
        <Select
          value={timeRange}
          onChange={setTimeRange}
          style={{ width: 150 }}
          options={[
            { value: 'today', label: '今日' },
            { value: 'this-week', label: '本周' },
            { value: 'this-month', label: '本月' },
            { value: 'this-year', label: '本年' },
            { value: 'all', label: '全部' },
          ]}
        />
      }
    >
      <Spin spinning={statsLoading}>
        {/* 统计卡片区域 - 四列布局，对应原型中的四个 Card 组件 */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              icon={<FileTextOutlined />}
              iconColor="#2563eb"
              iconBgColor="#dbeafe"
              title="报告种类数量"
              value={stats?.reportTypeCount ?? 0}
              description="+2 较上月"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              icon={<TeamOutlined />}
              iconColor="#16a34a"
              iconBgColor="#dcfce7"
              title="客户数量"
              value={stats?.clientCount ?? 0}
              description="+18% 较上月"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              icon={<EnvironmentOutlined />}
              iconColor="#ea580c"
              iconBgColor="#fff7ed"
              title="地区数量"
              value={stats?.regionCount ?? 0}
              description="覆盖全国主要省市"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatisticCard
              icon={<BarChartOutlined />}
              iconColor="#9333ea"
              iconBgColor="#faf5ff"
              title="行业数量"
              value={stats?.industryCount ?? 0}
              description="+3 较上月"
            />
          </Col>
        </Row>
      </Spin>

      {/* 行业分布柱状图，对应原型中的 Recharts BarChart */}
      <ProCard
        title="行业名称及数量分布"
        headerBordered
        style={{ marginTop: 16 }}
      >
        <Spin spinning={chartLoading}>
          <div style={{ height: 350 }}>
            {industryData && industryData.length > 0 && (
              <Column {...chartConfig} />
            )}
          </div>
        </Spin>
      </ProCard>
    </PageContainer>
  );
}
