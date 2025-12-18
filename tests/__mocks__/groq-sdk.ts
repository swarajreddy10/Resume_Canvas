import { mock } from 'bun:test';

export const mockGroqResponse = {
  choices: [
    {
      message: {
        content:
          'Led team of 5 engineers to deliver critical features\nImproved system performance by 40% through optimization\nArchitected scalable microservices infrastructure',
      },
    },
  ],
};

export default class Groq {
  chat = {
    completions: {
      create: mock(() => Promise.resolve(mockGroqResponse)),
    },
  };
}
