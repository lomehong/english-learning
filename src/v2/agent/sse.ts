/**
 * SSE 增量解析器（T2）：把 fetch body 的分块字节流喂进来，产出 data 载荷。
 *
 * - 跨 chunk 半行残留：内部缓冲，按行切分后保留未完成的尾巴；
 * - 忽略注释行（`: keep-alive`）与事件名行，只关心 `data:`；
 * - `data: [DONE]` 由调用方判断（本解析器只去掉前缀给原文）。
 */

export interface SSEParser {
  /** 喂入一段解码后的文本，返回其中完整的 data 载荷（可能为空数组） */
  push(chunk: string): string[];
  /** 流结束时冲刷残留（最后一行若无换行符也产出） */
  flush(): string[];
}

export function createSSEParser(): SSEParser {
  let buffer = '';

  function drain(finish: boolean): string[] {
    const out: string[] = [];
    const lines = buffer.split('\n');
    // 未完成流：最后一段是不完整行，留在缓冲里等下一个 chunk
    buffer = finish ? '' : (lines.pop() ?? '');
    for (const line of lines) {
      const trimmed = line.replace(/\r$/, '');
      if (trimmed === '' || trimmed.startsWith(':')) continue; // 空行 / 注释
      if (!trimmed.startsWith('data:')) continue; // event:/id:/retry: 忽略
      out.push(trimmed.slice(5).replace(/^ /, ''));
    }
    return out;
  }

  return {
    push(chunk) {
      buffer += chunk;
      return drain(false);
    },
    flush() {
      return drain(true);
    },
  };
}
