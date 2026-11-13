import { ref } from 'vue';

// 仅用于 Wujie 页面缓存；不持久化到浏览器，刷新后重新加载。
export const evidenceCacheVersion = ref(0);
export const evidencePageOpen = ref(true);

export function closeEvidencePage() {
  evidencePageOpen.value = false;
  evidenceCacheVersion.value += 1;
}

export function resetEvidencePage() {
  evidenceCacheVersion.value += 1;
}