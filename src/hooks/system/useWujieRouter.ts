import { router } from '/@/router';
import { closeEvidencePage, evidencePageOpen, evidenceCacheVersion } from './wujieEvidenceState';

const WUJIE_NAVIGATE_EVENT = 'finDataSynthSecurity-navigate';
const WUJIE_ROUTES = new Set(['/home', '/dataSynthMonitor', '/dataSynthTask', '/blockChainMonitor', '/evidencePreserve']);

interface WujieWindow extends Window {
  __POWERED_BY_WUJIE__?: boolean;
  $wujie?: {
    bus: {
      $on(event: string, handler: (path: string) => void): void;
    };
  };
}

let wujieRouterRegistered = false;

export function setupWujieRouter() {
  const wujieWindow = window as WujieWindow;
  if (!wujieWindow.__POWERED_BY_WUJIE__ || wujieRouterRegistered) return;

  wujieWindow.$wujie?.bus.$on(WUJIE_NAVIGATE_EVENT, async (path) => {
    if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) return;
    const target = router.resolve(path);
    const shortPath = target.path.replace(/^\/finDataSynthSecurity(?=\/)/, '');
    if (!WUJIE_ROUTES.has(shortPath)) return;
    const version = evidenceCacheVersion.value;
    if (router.currentRoute.value.fullPath !== target.fullPath) {
      const failure = await router.push(target.fullPath);
      if (failure) return;
    }
    // 关闭后重新打开时必须先提交新路由，否则新组件会读取残留 taskId。
    // 等待导航期间再次关闭或重置，不允许旧导航重新打开页面。
    if (shortPath === '/evidencePreserve' && version === evidenceCacheVersion.value && router.currentRoute.value.fullPath === target.fullPath) {
      evidencePageOpen.value = true;
    }
  });
  wujieWindow.$wujie?.bus.$on('finDataSynthSecurity-evidence-close', closeEvidencePage);
  wujieRouterRegistered = true;
}
