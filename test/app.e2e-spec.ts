import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('E2E - API', () => {
  let app: INestApplication;
  let token: string;
  let createdUserId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // ---------------------------
  // 1) Criar usuário
  // ---------------------------
  it('POST /user/register — deve registrar usuário', async () => {
    const userData = {
      name: 'Vinicius Test',
      email: 'vinicius-test@example.com',
      password: '123456',
      document: '12345678900',
    };

    const res = await request(app.getHttpServer())
      .post('/user/register')
      .send(userData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdUserId = res.body.id;
  });

  // ---------------------------
  // 2) Login
  // ---------------------------
  it('POST /auth/login — deve logar e receber token', async () => {
    const body = {
      email: 'vinicius-test@example.com',
      password: '123456',
    };

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('accessToken');

    token = res.body.accessToken;
  });

  // ---------------------------
  // 3) Buscar usuário por ID
  // ---------------------------
  it('GET /user/:id — deve retornar usuário', async () => {
    const res = await request(app.getHttpServer())
      .get(`/user/${createdUserId}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('vinicius-test@example.com');
  });

  // ---------------------------
  // 4) Transferência (rota com AuthGuard)
  // ---------------------------
  it('POST /transactions — deve realizar transferência', async () => {
    const body = {
      receiverId: createdUserId,
      amount: 10,
    };

    const res = await request(app.getHttpServer())
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send(body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('transactionId');
  });
});
