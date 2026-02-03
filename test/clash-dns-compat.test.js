import { describe, it, expect } from 'vitest';
import yaml from 'js-yaml';
import { ClashConfigBuilder } from '../src/builders/ClashConfigBuilder.js';

describe('Clash YAML compatibility', () => {
    it('nameserver-policy values should be strings (not sequences)', async () => {
        const input = `
proxies:
  - name: Node-A
    type: ss
    server: a.example.com
    port: 443
    cipher: aes-128-gcm
    password: test
`;
        const builder = new ClashConfigBuilder(input, 'minimal', [], null, 'zh-CN', 'test-agent');
        const yamlText = await builder.build();
        const built = yaml.load(yamlText);

        const policy = built?.dns?.['nameserver-policy'];
        expect(policy && typeof policy === 'object' && !Array.isArray(policy)).toBe(true);

        for (const value of Object.values(policy)) {
            expect(typeof value).toBe('string');
        }
    });
});

