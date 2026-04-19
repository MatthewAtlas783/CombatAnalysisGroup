// Serializer for Turbine.PluginData files. Mirrors the format produced by
// Turbine.PluginData.Save: a Lua source file beginning with `return\n` and
// containing a literal table.

export function toLua(value: unknown, indent = ''): string {
  if (value === null || value === undefined) return 'nil';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return 'nil';
    return Number.isInteger(value) ? value.toFixed(6) : String(value);
  }
  if (typeof value === 'string') {
    const escaped = value
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
    return `"${escaped}"`;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '{}';
    const inner = indent + '\t';
    const parts = value.map(v => `${inner}${toLua(v, inner)}`);
    return `{\n${parts.join(',\n')}\n${indent}}`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    const inner = indent + '\t';
    const parts = entries.map(([k, v]) => {
      const keyRepr = /^[A-Za-z_][A-Za-z0-9_]*$/.test(k) ? `["${k}"]` : `[${toLua(k, inner)}]`;
      return `${inner}${keyRepr} = ${toLua(v, inner)}`;
    });
    return `{\n${parts.join(',\n')}\n${indent}}`;
  }
  return 'nil';
}

export function serialize(data: unknown): string {
  return `return \n${toLua(data)}\n`;
}

// Best-effort parser for the subset of plugindata we expect to read back
// (number/string/bool/table). Not a full Lua parser — only what the plugin writes.
export function parse(source: string): unknown {
  const stripped = source.replace(/^\s*return\s*/, '').trim();
  const parser = new LuaLiteralParser(stripped);
  const value = parser.parseValue();
  parser.skipWs();
  if (!parser.atEnd()) {
    throw new Error(`Unexpected trailing content at offset ${parser.pos}`);
  }
  return value;
}

class LuaLiteralParser {
  pos = 0;
  constructor(public src: string) {}

  atEnd(): boolean {
    return this.pos >= this.src.length;
  }

  peek(): string {
    return this.src[this.pos] ?? '';
  }

  skipWs(): void {
    while (!this.atEnd()) {
      const c = this.peek();
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
        this.pos++;
      } else if (c === '-' && this.src[this.pos + 1] === '-') {
        while (!this.atEnd() && this.peek() !== '\n') this.pos++;
      } else {
        return;
      }
    }
  }

  parseValue(): unknown {
    this.skipWs();
    const c = this.peek();
    if (c === '{') return this.parseTable();
    if (c === '"' || c === "'") return this.parseString();
    if (c === '-' || (c >= '0' && c <= '9')) return this.parseNumber();
    if (this.matchKeyword('true')) return true;
    if (this.matchKeyword('false')) return false;
    if (this.matchKeyword('nil')) return null;
    throw new Error(`Unexpected character '${c}' at offset ${this.pos}`);
  }

  matchKeyword(kw: string): boolean {
    if (this.src.startsWith(kw, this.pos)) {
      const next = this.src[this.pos + kw.length];
      if (next === undefined || !/[A-Za-z0-9_]/.test(next)) {
        this.pos += kw.length;
        return true;
      }
    }
    return false;
  }

  parseString(): string {
    const quote = this.src[this.pos]!;
    this.pos++;
    let out = '';
    while (!this.atEnd()) {
      const c = this.src[this.pos]!;
      if (c === '\\') {
        const next = this.src[this.pos + 1] ?? '';
        if (next === 'n') out += '\n';
        else if (next === 'r') out += '\r';
        else if (next === 't') out += '\t';
        else out += next;
        this.pos += 2;
      } else if (c === quote) {
        this.pos++;
        return out;
      } else {
        out += c;
        this.pos++;
      }
    }
    throw new Error('Unterminated string');
  }

  parseNumber(): number {
    const start = this.pos;
    if (this.peek() === '-') this.pos++;
    while (!this.atEnd() && /[0-9.eE+\-]/.test(this.peek())) this.pos++;
    const n = Number(this.src.slice(start, this.pos));
    if (Number.isNaN(n)) throw new Error(`Invalid number at offset ${start}`);
    return n;
  }

  parseTable(): unknown {
    this.pos++; // consume '{'
    this.skipWs();
    if (this.peek() === '}') {
      this.pos++;
      return {};
    }

    const arrayPart: unknown[] = [];
    const keyed: Record<string, unknown> = {};
    let hasKeyed = false;

    while (true) {
      this.skipWs();
      if (this.peek() === '}') {
        this.pos++;
        if (hasKeyed) {
          if (arrayPart.length > 0) {
            arrayPart.forEach((v, i) => {
              keyed[String(i + 1)] = v;
            });
          }
          return keyed;
        }
        return arrayPart;
      }

      let key: string | undefined;
      const start = this.pos;
      if (this.peek() === '[') {
        this.pos++;
        const k = this.parseValue();
        this.skipWs();
        if (this.peek() !== ']') throw new Error(`Expected ']' at offset ${this.pos}`);
        this.pos++;
        this.skipWs();
        if (this.peek() === '=') {
          this.pos++;
          key = String(k);
        } else {
          // bracketed expression with no '=' isn't valid for our subset
          throw new Error(`Expected '=' at offset ${this.pos}`);
        }
      } else if (/[A-Za-z_]/.test(this.peek())) {
        const idStart = this.pos;
        while (!this.atEnd() && /[A-Za-z0-9_]/.test(this.peek())) this.pos++;
        const id = this.src.slice(idStart, this.pos);
        this.skipWs();
        if (this.peek() === '=') {
          this.pos++;
          key = id;
        } else {
          // not an assignment — rewind, treat as positional value (rare for our format)
          this.pos = start;
        }
      }

      const value = this.parseValue();
      if (key !== undefined) {
        hasKeyed = true;
        keyed[key] = value;
      } else {
        arrayPart.push(value);
      }

      this.skipWs();
      const sep = this.peek();
      if (sep === ',' || sep === ';') {
        this.pos++;
        continue;
      }
      if (sep === '}') {
        this.pos++;
        if (hasKeyed) {
          if (arrayPart.length > 0) {
            arrayPart.forEach((v, i) => {
              keyed[String(i + 1)] = v;
            });
          }
          return keyed;
        }
        return arrayPart;
      }
      throw new Error(`Expected ',' or '}' at offset ${this.pos}`);
    }
  }
}
