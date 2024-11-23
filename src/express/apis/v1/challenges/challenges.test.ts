import request from 'supertest';
import app from '../../../app';

describe('/api/v1/challenges', () => {
  describe('GET /challenges', () => {
    test('should return a 200 for a valid uuid', async () => {
      const res = await request(app).get(`/api/v1/challenges`).send();
      expect(res.status).toBe(200);
      expect(res.body.results.length).toBeGreaterThan(0);
    });
  });
});
