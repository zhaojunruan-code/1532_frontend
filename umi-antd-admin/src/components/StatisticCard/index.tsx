/**
 * 统计卡片组件 - StatisticCard
 *
 * 通用的数据统计展示卡片，用于 Dashboard 等页面的数据概览区域。
 * 支持自定义图标、标题、数值和描述文本。
 *
 * @example
 * ```tsx
 * <StatisticCard
 *   icon={<FileTextOutlined />}
 *   iconColor="#1890ff"
 *   iconBgColor="#e6f7ff"
 *   title="报告种类数量"
 *   value={24}
 *   description="+2 较上月"
 * />
 * ```
 */
import { ProCard } from '@ant-design/pro-components';
import { Statistic, Typography } from 'antd';
import React from 'react';

interface StatisticCardProps {
  /** 卡片左侧展示的图标 */
  icon: React.ReactNode;
  /** 图标颜色 */
  iconColor: string;
  /** 图标背景颜色 */
  iconBgColor: string;
  /** 统计项标题 */
  title: string;
  /** 统计数值 */
  value: number | string;
  /** 数值下方的描述文本（如环比变化） */
  description?: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  icon,
  iconColor,
  iconBgColor,
  title,
  value,
  description,
}) => {
  return (
    <ProCard hoverable>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* 图标容器：圆形背景 + 居中图标 */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: iconBgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
            fontSize: 24,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        {/* 文本区域：标题 + 数值 + 描述 */}
        <div>
          <Statistic title={title} value={value} />
          {description && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {description}
            </Typography.Text>
          )}
        </div>
      </div>
    </ProCard>
  );
};

export default StatisticCard;
