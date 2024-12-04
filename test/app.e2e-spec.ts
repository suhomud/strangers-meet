import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Strangers Meet App (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Users API', () => {
    it('should create a new user', async () => {
      const user = { name: 'John Doe', email: 'john.doe@example.com' };
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: user.name,
        email: user.email,
      });
    });

    it('should fetch all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('Dinners API', () => {
    let createdUserId: number;

    beforeEach(async () => {
      const user = { name: 'Jane Doe', email: 'jane.doe@example.com' };
      const userResponse = await request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(201);

      createdUserId = userResponse.body.id;
    });

    it('should create a new dinner', async () => {
      const dinner = {
        title: 'Italian Dinner Night',
        description: 'Authentic Italian dinner with strangers!',
        date: '2024-12-15T19:00:00.000Z',
        location: 'Downtown Restaurant',
        maxGuests: 5,
        userId: createdUserId,
      };

      const response = await request(app.getHttpServer())
        .post('/dinners')
        .send(dinner)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        title: dinner.title,
        description: dinner.description,
        location: dinner.location,
        maxGuests: dinner.maxGuests,
        currentGuests: 1,
        guests: [
          {
            id: createdUserId,
          },
        ],
      });
    });

    it('should allow a user to join a dinner', async () => {
      const dinner = {
        title: 'French Dinner Night',
        description: 'A casual French dinner.',
        date: '2024-12-20T19:00:00.000Z',
        location: 'City Bistro',
        maxGuests: 5,
        userId: createdUserId,
      };

      const dinnerResponse = await request(app.getHttpServer())
        .post('/dinners')
        .send(dinner)
        .expect(201);

      const dinnerId = dinnerResponse.body.id;

      const newUser = { name: 'Mark Smith', email: 'mark.smith@example.com' };
      const userResponse = await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .expect(201);

      const newUserId = userResponse.body.id;

      const joinResponse = await request(app.getHttpServer())
        .post(`/dinners/${dinnerId}/join`)
        .send({ userId: newUserId })
        .expect(200);

      expect(joinResponse.body).toMatchObject({
        id: dinnerId,
        currentGuests: 2,
        guests: expect.arrayContaining([
          { id: createdUserId },
          { id: newUserId },
        ]),
      });
    });

    it('should allow a user to leave a dinner', async () => {
      const dinner = {
        title: 'Pizza Night',
        description: 'Enjoy pizza with strangers!',
        date: '2024-12-25T19:00:00.000Z',
        location: 'Pizza Place',
        maxGuests: 5,
        userId: createdUserId,
      };

      const dinnerResponse = await request(app.getHttpServer())
        .post('/dinners')
        .send(dinner)
        .expect(201);

      const dinnerId = dinnerResponse.body.id;

      const leaveResponse = await request(app.getHttpServer())
        .put(`/dinners/${dinnerId}/leave`)
        .send({ userId: createdUserId })
        .expect(200);

      expect(leaveResponse.body).toMatchObject({
        id: dinnerId,
        currentGuests: 0,
        guests: [],
      });
    });
  });
});