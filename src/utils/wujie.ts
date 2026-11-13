import type { UserInfo } from '/#/store';

type HostWindow = Window & {
  __POWERED_BY_WUJIE__?: boolean;
  $wujie?: { props?: { userInfo?: Partial<UserInfo> | null; navigate?: (path: string) => void } };
};

export function isWujieEnvironment(): boolean {
  return typeof window !== 'undefined' && Boolean((window as HostWindow).__POWERED_BY_WUJIE__);
}

// 由一站式平台负责菜单、页签和地址同步；旧一站式平台未提供回调时由调用方降级。
export function navigateWujieHost(path: string): boolean {
  if (!isWujieEnvironment()) return false;
  const navigate = (window as HostWindow).$wujie?.props?.navigate;
  if (!navigate) return false;
  navigate(path);
  return true;
}

// 读取一站式平台用户信息
export function getHostUserInfo(): Partial<UserInfo> | undefined {
  if (!isWujieEnvironment()) return undefined;
  return (window as HostWindow).$wujie?.props?.userInfo ?? undefined;
}

export function getHostDisplayName(): string {
  return getHostUserInfo()?.realname || '';
}

/**
 * getHostUserInfo() 返回数据说明
 *
 * 参考结构：
 * {
 *   "id": "USER_ID_EXAMPLE", // 用户 ID
 *   "username": "testUser", // 登录账号
 *   "realname": "测试用户", // 用户名，上传创建人使用此字段
 *   "avatar": null, // 头像
 *   "birthday": null, // 生日
 *   "sex": null, // 性别
 *   "email": "user@example.com", // 邮箱
 *   "phone": "138****0000", // 手机号
 *   "orgCode": "ORG_EXAMPLE", // 组织编码
 *   "homePath": "/example/home", // 首页路径
 *   "departName": null // 部门名称
 *   ...
 * }
 */
