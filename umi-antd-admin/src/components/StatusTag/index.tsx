/**
 * 状态标签组件 - StatusTag
 *
 * 通用的状态展示标签，使用 Ant Design Tag 组件封装。
 * 支持预设的状态类型映射，也支持自定义颜色。
 * 可在多个页面中复用，保持状态展示的一致性。
 *
 * @example
 * ```tsx
 * // 使用预设状态
 * <StatusTag status="success" text="已公示" />
 * <StatusTag status="warning" text="待生成" />
 *
 * // 自定义颜色
 * <StatusTag color="blue" text="总管理员" />
 * ```
 */
import { Tag } from 'antd';
import React from 'react';

/**
 * 预设的状态类型到颜色的映射
 * success - 绿色，表示成功/已完成/正常状态
 * warning - 橙色，表示警告/待处理状态
 * error - 红色，表示错误/已停用状态
 * processing - 蓝色，表示处理中/进行中状态
 * default - 灰色，默认/未处理状态
 */
type StatusType = 'success' | 'warning' | 'error' | 'processing' | 'default';

interface StatusTagProps {
  /** 预设状态类型，与颜色自动映射 */
  status?: StatusType;
  /** 自定义颜色（优先级高于 status） */
  color?: string;
  /** 标签显示的文本 */
  text: string;
}

/** 状态类型到 Ant Design Tag 颜色值的映射表 */
const STATUS_COLOR_MAP: Record<StatusType, string> = {
  success: 'green',
  warning: 'orange',
  error: 'red',
  processing: 'blue',
  default: 'default',
};

const StatusTag: React.FC<StatusTagProps> = ({ status, color, text }) => {
  /** 优先使用自定义颜色，其次根据状态类型查找映射 */
  const tagColor = color || (status ? STATUS_COLOR_MAP[status] : 'default');

  return <Tag color={tagColor}>{text}</Tag>;
};

export default StatusTag;
