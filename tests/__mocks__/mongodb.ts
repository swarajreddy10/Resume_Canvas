import { mock } from 'bun:test';

export const mockCollection = {
  find: mock(() => ({
    toArray: mock(() => Promise.resolve([])),
  })),
  findOne: mock(() => Promise.resolve(null)),
  insertOne: mock(() => Promise.resolve({ insertedId: 'mock-id' })),
  updateOne: mock(() => Promise.resolve({ modifiedCount: 1 })),
  deleteOne: mock(() => Promise.resolve({ deletedCount: 1 })),
};

export const mockDb = {
  collection: mock(() => mockCollection),
};

export const mockClient = {
  connect: mock(() => Promise.resolve()),
  db: mock(() => mockDb),
  close: mock(() => Promise.resolve()),
};

export class MongoClient {
  static connect = mock(() => Promise.resolve(mockClient));
}
