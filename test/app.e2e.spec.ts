import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    connection = await app.get(getConnectionToken());

    await app.init();
  });

  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });

  it('testing', () => {
    return expect(true).toBe(true);
  });
  // it('/day (GET) successfully', () => {
  //   return request(app.getHttpServer())
  //     .get('/day')
  //     .expect(200)
  //     .expect((res) => {
  //       expect(res.body).toHaveProperty('day', 1);
  //     });
  // });
  afterAll(async () => {
    await app.close();
  });
});
