import { describe, it, expect } from 'vitest';
import {
  loadV2Config,
  saveV2Config,
  normalizeV2Config,
  hasRemoteAgent,
  chatCompletionsUrl,
  maskApiKey,
  V2_CONFIG_STORAGE_KEY,
  DEFAULT_V2_CONFIG,
} from './config';
import type { StorageLike } from '../store/progress';

function memory(initial: Record<string, string> = {}): StorageLike & { dump: () => Record<string, string> } {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => void store.set(k, v),
    dump: () => Object.fromEntries(store.entries()),
  };
}

describe('v2 模型配置（T1）', () => {
  it('空存储回默认：官方端点 / 空 Key / gpt-4o-mini → 无 key 降级', () => {
    const config = loadV2Config(memory());
    expect(config).toEqual(DEFAULT_V2_CONFIG);
    expect(hasRemoteAgent(config)).toBe(false);
  });

  it('保存 → 读取往返持久化到 localStorage 约定键', () => {
    const storage = memory();
    saveV2Config(
      { version: 1, baseUrl: 'https://llm.example.com/v1/', apiKey: '  sk-abc123  ', model: 'qwen-max' },
      storage,
    );
    expect(Object.keys(storage.dump())).toEqual([V2_CONFIG_STORAGE_KEY]);
    const loaded = loadV2Config(storage);
    expect(loaded.baseUrl).toBe('https://llm.example.com/v1/'); // 非空串保留（拼端点时再去斜杠）
    expect(loaded.apiKey).toBe('sk-abc123'); // 去首尾空白
    expect(loaded.model).toBe('qwen-max');
    expect(hasRemoteAgent(loaded)).toBe(true);
  });

  it('normalize：坏形状 / 错版本 / 缺字段回默认；空字段回默认值', () => {
    expect(normalizeV2Config(null)).toEqual(DEFAULT_V2_CONFIG);
    expect(normalizeV2Config('x')).toEqual(DEFAULT_V2_CONFIG);
    expect(normalizeV2Config({ version: 2, apiKey: 'sk' })).toEqual(DEFAULT_V2_CONFIG);
    expect(normalizeV2Config({ version: 1, baseUrl: '', model: '' })).toEqual(DEFAULT_V2_CONFIG);
    expect(normalizeV2Config({ version: 1, baseUrl: 123, apiKey: 42 })).toEqual(DEFAULT_V2_CONFIG);
  });

  it('坏 JSON / 存取抛异常安全回退默认', () => {
    const broken = memory({ [V2_CONFIG_STORAGE_KEY]: '{oops' });
    expect(loadV2Config(broken)).toEqual(DEFAULT_V2_CONFIG);
    const throwing: StorageLike = {
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('denied');
      },
    };
    expect(loadV2Config(throwing)).toEqual(DEFAULT_V2_CONFIG);
  });

  it('端点拼接：去尾部斜杠后拼 /chat/completions', () => {
    expect(chatCompletionsUrl('https://api.openai.com/v1')).toBe('https://api.openai.com/v1/chat/completions');
    expect(chatCompletionsUrl('https://api.openai.com/v1///')).toBe('https://api.openai.com/v1/chat/completions');
  });

  it('Key 脱敏展示', () => {
    expect(maskApiKey('')).toBe('');
    expect(maskApiKey('sk1')).toBe('••••');
    expect(maskApiKey('sk-1234567890abcdef')).toBe('sk-1…ef');
  });
});
