import { describe, it, expect } from 'vitest';
import {
  V2_SETTINGS_KEY,
  MODEL_PROVIDERS,
  defaultV2Settings,
  loadV2Settings,
  saveV2Settings,
  clearV2Settings,
  hasApiKey,
  settingsStatusLabel,
  providerMeta,
  type V2Settings,
  type V2StorageLike,
} from './settings';

/** 可注入假存储（测试用；键值均为测试假数据，不含任何真实凭证） */
function makeStorage(initial: Record<string, string> = {}): V2StorageLike & {
  dump(): Record<string, string>;
} {
  const map = new Map(Object.entries(initial));
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
    dump: () => Object.fromEntries(map),
  };
}

describe('v2 模型设置存储', () => {
  it('默认设置：GLM 提供商 + 各字段有默认值；三档提供商清单完整', () => {
    const settings = defaultV2Settings();
    expect(settings.provider).toBe('glm');
    expect(settings.baseURL).toBe(providerMeta('glm').defaultBaseURL);
    expect(settings.model).toBe(providerMeta('glm').defaultModel);
    expect(settings.apiKey).toBe('');
    expect(MODEL_PROVIDERS.map((p) => p.id)).toEqual(['glm', 'deepseek', 'openai-compatible']);
    for (const provider of MODEL_PROVIDERS) {
      expect(provider.label.length).toBeGreaterThan(0);
      expect(provider.defaultBaseURL.startsWith('https://')).toBe(true);
      expect(provider.defaultModel.length).toBeGreaterThan(0);
    }
  });

  it('保存后可重新读回（重开仍在），持久化为约定键下的 JSON', () => {
    const storage = makeStorage();
    const settings = { ...defaultV2Settings(), apiKey: 'test-key-1', model: 'glm-4-plus' };
    saveV2Settings(settings, storage);
    expect(storage.dump()[V2_SETTINGS_KEY]).toBe(JSON.stringify(settings));
    expect(loadV2Settings(storage)).toEqual(settings);
  });

  it('清空后回到默认且键被移除，随后可重新保存（清空可重设）', () => {
    const storage = makeStorage();
    saveV2Settings({ ...defaultV2Settings(), apiKey: 'test-key-2' }, storage);
    clearV2Settings(storage);
    expect(storage.dump()[V2_SETTINGS_KEY]).toBeUndefined();
    expect(loadV2Settings(storage)).toEqual(defaultV2Settings());

    const again: V2Settings = { ...defaultV2Settings(), provider: 'deepseek', apiKey: 'test-key-3' };
    saveV2Settings(again, storage);
    expect(loadV2Settings(storage)).toEqual(again);
  });

  it('空 / 损坏 JSON / 非法字段一律回退默认，不抛异常', () => {
    const storage = makeStorage();
    expect(loadV2Settings(storage)).toEqual(defaultV2Settings()); // 空

    storage.setItem(V2_SETTINGS_KEY, '{oops');
    expect(loadV2Settings(storage)).toEqual(defaultV2Settings()); // 损坏 JSON

    storage.setItem(V2_SETTINGS_KEY, JSON.stringify({ version: 1, provider: 'evil' }));
    expect(loadV2Settings(storage)).toEqual(defaultV2Settings()); // 非法提供商

    storage.setItem(
      V2_SETTINGS_KEY,
      JSON.stringify({ provider: 'deepseek', baseURL: 123, apiKey: null, model: {} }),
    );
    const mixed = loadV2Settings(storage); // 部分字段类型错 → 整体回退默认
    expect(mixed).toEqual(defaultV2Settings());
  });

  it('hasApiKey：空串 / 纯空白为 false，非空为 true（含首尾空格容忍）', () => {
    expect(hasApiKey(defaultV2Settings())).toBe(false);
    expect(hasApiKey({ ...defaultV2Settings(), apiKey: '   ' })).toBe(false);
    expect(hasApiKey({ ...defaultV2Settings(), apiKey: ' test-key-4 ' })).toBe(true);
  });

  it('状态文案：未配置提示占位回复；已配置显示提供商与模型名', () => {
    expect(settingsStatusLabel(defaultV2Settings())).toContain('未配置');
    expect(
      settingsStatusLabel({ ...defaultV2Settings(), apiKey: 'test-key-5' }),
    ).toContain(providerMeta('glm').label);
    expect(
      settingsStatusLabel({ ...defaultV2Settings(), apiKey: 'test-key-5' }),
    ).toContain('glm-4-flash');
  });
});
