import { describe, it, expect, vi } from 'vitest';
import { buildDataManagement, type DataManagementDeps } from './data-management';
import {
  BackupFormatError,
  createBackup,
  serializeBackup,
  importBackupFromText,
  type ImportSummary,
} from '../store/backup';
import type { StorageLike } from '../store/progress';
import { emptyProgress, saveProgress, type Progress } from '../store/progress';
import { createCard } from '../srs/sm2';

const NOW = Date.UTC(2026, 0, 1);

function memoryStorage(seed: Record<string, string> = {}): StorageLike {
  const memory = new Map<string, string>(Object.entries(seed));
  return {
    getItem: (k) => memory.get(k) ?? null,
    setItem: (k, v) => void memory.set(k, v),
  };
}

function click(el: Element): void {
  el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

/** 组装可注入的依赖：真实走内存存储的导出/导入逻辑 */
function makeDeps(storage: StorageLike): DataManagementDeps {
  return {
    exportData: () => serializeBackup(createBackup(storage, NOW)),
    importText: (text) => importBackupFromText(text, storage),
    download: () => {},
    now: () => NOW,
  };
}

describe('数据管理区 · 导出', () => {
  it('点击导出：下载 JSON 文件（含四份数据与版本号），状态提示成功', () => {
    const storage = memoryStorage();
    const progress = emptyProgress();
    progress.cards['teenage'] = createCard('teenage', NOW);
    saveProgress(progress, storage);

    const downloads: Array<{ filename: string; text: string }> = [];
    const section = buildDataManagement({
      ...makeDeps(storage),
      download: (filename, text) => downloads.push({ filename, text }),
    });

    click(section.querySelector<HTMLButtonElement>('[data-testid="export-btn"]')!);

    expect(downloads).toHaveLength(1);
    expect(downloads[0]!.filename).toBe('english-learning-backup-20260101.json');
    const parsed = JSON.parse(downloads[0]!.text) as { version: number; app: string; progress: Progress };
    expect(parsed.version).toBe(1);
    expect(parsed.app).toBe('english-learning');
    expect(parsed.progress.cards['teenage']).toBeDefined();
    expect(section.querySelector('[data-testid="import-status"]')!.textContent).toContain('已导出');
  });
});

describe('数据管理区 · 导入', () => {
  async function selectFile(input: HTMLInputElement, text: string): Promise<void> {
    const file = new File([text], 'backup.json', { type: 'application/json' });
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await vi.waitFor(() => {
      const status = input
        .closest('section')
        ?.querySelector<HTMLElement>('[data-testid="import-status"]');
      if (!status || status.textContent === '') throw new Error('status not ready');
    });
  }

  it('选择合法备份文件：合并导入成功，状态显示新增/合并摘要并清空文件框', async () => {
    const storage = memoryStorage();

    // 先在「另一台设备」导出一份含词汇进度的备份
    const other = memoryStorage();
    const progress = emptyProgress();
    progress.cards['apply'] = createCard('apply', NOW);
    saveProgress(progress, other);
    const backupText = serializeBackup(createBackup(other, NOW));

    const section = buildDataManagement(makeDeps(storage));
    const input = section.querySelector<HTMLInputElement>('[data-testid="import-file"]')!;

    await selectFile(input, backupText);

    const status = section.querySelector<HTMLElement>('[data-testid="import-status"]')!;
    expect(status.dataset.kind).toBe('ok');
    expect(status.textContent).toContain('导入完成');
    expect(status.textContent).toContain('新增 1');
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('选择非法 JSON 文件：状态显示格式错误，不写入数据', async () => {
    const storage = memoryStorage();
    const section = buildDataManagement(makeDeps(storage));
    const input = section.querySelector<HTMLInputElement>('[data-testid="import-file"]')!;

    await selectFile(input, 'not a json');

    const status = section.querySelector<HTMLElement>('[data-testid="import-status"]')!;
    expect(status.dataset.kind).toBe('error');
    expect(status.textContent).toContain('JSON');
    expect(storage.getItem('english-learning.progress.v1')).toBeNull();
  });

  it('导入成功触发 onImported 回调；导入失败不触发（报告页据此刷新）', async () => {
    const storage = memoryStorage();
    const backupText = serializeBackup(createBackup(memoryStorage(), NOW));
    const onImported = vi.fn();

    // 合法导入 → 触发回调
    const okSection = buildDataManagement(makeDeps(storage), { onImported });
    await selectFile(okSection.querySelector<HTMLInputElement>('[data-testid="import-file"]')!, backupText);
    expect(onImported).toHaveBeenCalledTimes(1);

    // 非法导入 → 不触发回调，状态为错误
    const onImportedFail = vi.fn();
    const badSection = buildDataManagement(
      {
        exportData: () => '{}',
        importText: (): ImportSummary => {
          throw new BackupFormatError('bad');
        },
        download: () => {},
        now: () => NOW,
      },
      { onImported: onImportedFail },
    );
    await selectFile(badSection.querySelector<HTMLInputElement>('[data-testid="import-file"]')!, 'nope');
    expect(onImportedFail).not.toHaveBeenCalled();
    expect(badSection.querySelector<HTMLElement>('[data-testid="import-status"]')!.dataset.kind).toBe('error');
  });
});

describe('数据管理区 · 依赖注入', () => {
  it('importText 抛非 BackupFormatError 异常时给出兜底提示', async () => {
    const section = buildDataManagement({
      exportData: () => '{}',
      importText: (): ImportSummary => {
        throw new Error('boom');
      },
      download: () => {},
      now: () => NOW,
    });
    const input = section.querySelector<HTMLInputElement>('[data-testid="import-file"]')!;

    const file = new File(['x'], 'b.json');
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    input.dispatchEvent(new Event('change', { bubbles: true }));

    await vi.waitFor(() => {
      if (section.querySelector<HTMLElement>('[data-testid="import-status"]')!.dataset.kind !== 'error') {
        throw new Error('not ready');
      }
    });
    expect(section.querySelector('[data-testid="import-status"]')!.textContent).toContain('导入失败');
  });
});
