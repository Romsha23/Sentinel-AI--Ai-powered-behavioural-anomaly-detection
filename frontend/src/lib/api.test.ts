import { describe, it, expect } from 'vitest';
import { buildAlertQuery } from '@/lib/api';

describe('buildAlertQuery', () => {
  it('builds query string with search and filters', () => {
    const qs = buildAlertQuery({
      search: 'ALT-9081',
      priority: 'Critical',
      sort_by: 'risk_score',
      sort_order: 'desc',
      limit: 10,
      offset: 0,
    });
    expect(qs).toContain('search=ALT-9081');
    expect(qs).toContain('priority=Critical');
    expect(qs).toContain('sort_by=risk_score');
    expect(qs).toContain('limit=10');
  });

  it('skips ALL filter values', () => {
    const qs = buildAlertQuery({ priority: 'ALL', status: 'ALL' });
    expect(qs).not.toContain('priority');
    expect(qs).not.toContain('status');
  });

  it('returns empty string when no params', () => {
    expect(buildAlertQuery({})).toBe('');
  });
});

describe('API endpoints config', () => {
  it('has required auth endpoints', async () => {
    const { API_ENDPOINTS } = await import('@/lib/api');
    expect(API_ENDPOINTS.login).toBe('/auth/login');
    expect(API_ENDPOINTS.register).toBe('/auth/register');
    expect(API_ENDPOINTS.profile).toBe('/auth/me');
  });
});
