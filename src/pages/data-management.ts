import {
  createBackup,
  serializeBackup,
  importBackupFromText,
  BackupFormatError,
  type ImportSummary,
} from '../store/backup';

/**
 * 数据管理区（挂在学习报告页）：JSON 导出 / 导入。
 * - 导出：四份数据（词汇进度/错题本/写作草稿/练习统计）打包为 JSON 文件下载；
 * - 导入：选择 JSON 备份文件 → 解析校验 → 与本地数据合并去重 → 显示导入摘要。
 * 文案与状态全部走 textContent 组合，不回显文件内容。
 */

export interface DataManagementDeps {
  /** 导出：返回备份 JSON 文本 */
  exportData: () => string;
  /** 导入：解析并合并，返回摘要；格式错误抛 BackupFormatError */
  importText: (text: string) => ImportSummary;
  /** 下载文件（浏览器实现为 <a download>；测试可注入） */
  download: (filename: string, text: string) => void;
  now: () => number;
}

export function defaultDownload(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function defaultDataManagementDeps(): DataManagementDeps {
  return {
    exportData: () => serializeBackup(createBackup()),
    importText: (text) => importBackupFromText(text),
    download: defaultDownload,
    now: () => Date.now(),
  };
}

function summaryText(summary: ImportSummary): string {
  return `导入完成（合并去重）：词汇进度新增 ${summary.cardsAdded}、合并 ${summary.cardsMerged}；错题新增 ${summary.wrongAdded}、合并 ${summary.wrongMerged}；草稿新增 ${summary.draftsAdded}、合并 ${summary.draftsMerged}；统计更新 ${summary.statsModulesUpdated} 项。`;
}

export function buildDataManagement(
  deps: DataManagementDeps,
  options: { onImported?: () => void } = {},
): HTMLElement {
  const d = deps;

  const section = document.createElement('section');
  section.className = 'report-backup';
  section.setAttribute('data-testid', 'data-management');

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = '数据管理（导出 / 导入）';

  const intro = document.createElement('p');
  intro.className = 'page-intro';
  intro.textContent =
    '导出：把本机的词汇进度、错题本、写作草稿与练习统计打包为一个 JSON 备份文件，换设备或备份留存。导入：选择之前的备份文件，与本机数据合并去重（不覆盖、不双算）。';

  /* 导出 */
  const exportBtn = document.createElement('button');
  exportBtn.type = 'button';
  exportBtn.className = 'btn btn--primary';
  exportBtn.setAttribute('data-testid', 'export-btn');
  exportBtn.textContent = '⬇ 导出数据（JSON）';

  /* 导入 */
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.className = 'import-file';
  fileInput.setAttribute('data-testid', 'import-file');
  fileInput.accept = 'application/json,.json';
  fileInput.setAttribute('aria-label', '选择要导入的 JSON 备份文件');

  const importLabel = document.createElement('label');
  importLabel.className = 'stat-chip';
  importLabel.style.cursor = 'pointer';
  importLabel.style.display = 'inline-flex';
  importLabel.style.alignItems = 'center';
  importLabel.style.gap = 'var(--space-2)';
  importLabel.textContent = '⬆ 选择备份文件导入';
  importLabel.append(fileInput);

  const status = document.createElement('p');
  status.className = 'writing-editor__status';
  status.setAttribute('data-testid', 'import-status');
  status.setAttribute('role', 'status');

  function setStatus(text: string, kind: 'ok' | 'error'): void {
    status.textContent = text;
    status.dataset.kind = kind;
  }

  exportBtn.addEventListener('click', () => {
    const date = new Date(d.now());
    const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
      date.getDate(),
    ).padStart(2, '0')}`;
    const filename = `english-learning-backup-${stamp}.json`;
    try {
      d.download(filename, d.exportData());
      setStatus(`已导出备份文件 ${filename}（含词汇进度 / 错题本 / 写作草稿 / 练习统计）。`, 'ok');
    } catch {
      setStatus('导出失败：浏览器可能拦截了下载，请重试。', 'error');
    }
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      try {
        const summary = d.importText(String(reader.result ?? ''));
        setStatus(summaryText(summary), 'ok');
        fileInput.value = '';
        options.onImported?.();
      } catch (error) {
        const message =
          error instanceof BackupFormatError ? error.message : '导入失败：文件无法读取，请确认备份文件。';
        setStatus(message, 'error');
      }
    });
    reader.addEventListener('error', () => {
      setStatus('导入失败：文件无法读取，请重新选择。', 'error');
    });
    reader.readAsText(file);
  });

  const actions = document.createElement('div');
  actions.style.cssText = 'display:flex;flex-wrap:wrap;gap:var(--space-3);align-items:center;';
  actions.append(exportBtn, importLabel);

  section.append(title, intro, actions, status);
  return section;
}
