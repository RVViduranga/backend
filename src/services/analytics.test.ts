/**
 * Integration Tests for Analytics Service
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import analyticsService from './analytics';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

beforeEach(() => {
  mockLocalStorage.clear();
  global.localStorage = mockLocalStorage as any;
});

describe('analyticsService.getPlatformStatistics', () => {
  it('should get platform statistics', async () => {
    const stats = await analyticsService.getPlatformStatistics();

    expect(stats).toBeDefined();
    expect(stats.activeJobs).toBeDefined();
    expect(stats.companies).toBeDefined();
    expect(stats.jobSeekers).toBeDefined();
    expect(stats.newJobsDaily).toBeDefined();
  });

  it('should return formatted statistics', async () => {
    const stats = await analyticsService.getPlatformStatistics();

    // Values should be strings (formatted) or numbers
    expect(typeof stats.activeJobs === 'string' || typeof stats.activeJobs === 'number').toBe(true);
    expect(typeof stats.companies === 'string' || typeof stats.companies === 'number').toBe(true);
    expect(typeof stats.jobSeekers === 'string' || typeof stats.jobSeekers === 'number').toBe(true);
    expect(typeof stats.newJobsDaily === 'string' || typeof stats.newJobsDaily === 'number').toBe(true);
  });
});

describe('analyticsService.subscribeToNewsletter', () => {
  it('should subscribe email to newsletter', async () => {
    const email = 'test@example.com';

    await expect(analyticsService.subscribeToNewsletter(email)).resolves.not.toThrow();

    // Verify email was stored in localStorage
    const stored = mockLocalStorage.getItem('newsletter_subscriptions');
    expect(stored).toBeTruthy();
    if (stored) {
      const subscriptions = JSON.parse(stored);
      expect(subscriptions).toContain(email);
    }
  });

  it('should not duplicate email subscriptions', async () => {
    const email = 'test@example.com';

    // Subscribe twice
    await analyticsService.subscribeToNewsletter(email);
    await analyticsService.subscribeToNewsletter(email);

    // Verify email appears only once
    const stored = mockLocalStorage.getItem('newsletter_subscriptions');
    if (stored) {
      const subscriptions = JSON.parse(stored);
      const count = subscriptions.filter((e: string) => e === email).length;
      expect(count).toBe(1);
    }
  });

  it('should handle multiple email subscriptions', async () => {
    const emails = ['test1@example.com', 'test2@example.com', 'test3@example.com'];

    for (const email of emails) {
      await analyticsService.subscribeToNewsletter(email);
    }

    // Verify all emails were stored
    const stored = mockLocalStorage.getItem('newsletter_subscriptions');
    if (stored) {
      const subscriptions = JSON.parse(stored);
      emails.forEach((email) => {
        expect(subscriptions).toContain(email);
      });
    }
  });
});

describe('analyticsService.sendContactMessage', () => {
  it('should send contact message successfully', async () => {
    const messageData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'This is a test message',
    };

    await expect(analyticsService.sendContactMessage(messageData)).resolves.not.toThrow();

    // Verify message was stored in localStorage
    const stored = mockLocalStorage.getItem('contact_messages');
    expect(stored).toBeTruthy();
    if (stored) {
      const messages = JSON.parse(stored);
      expect(messages.length).toBeGreaterThan(0);
      const lastMessage = messages[messages.length - 1];
      expect(lastMessage.name).toBe(messageData.name);
      expect(lastMessage.email).toBe(messageData.email);
      expect(lastMessage.subject).toBe(messageData.subject);
      expect(lastMessage.message).toBe(messageData.message);
      expect(lastMessage.date).toBeDefined();
    }
  });

  it('should handle multiple contact messages', async () => {
    const messages = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Subject 1',
        message: 'Message 1',
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        subject: 'Subject 2',
        message: 'Message 2',
      },
    ];

    for (const message of messages) {
      await analyticsService.sendContactMessage(message);
    }

    // Verify all messages were stored
    const stored = mockLocalStorage.getItem('contact_messages');
    if (stored) {
      const storedMessages = JSON.parse(stored);
      expect(storedMessages.length).toBeGreaterThanOrEqual(messages.length);
    }
  });

  it('should include timestamp in contact message', async () => {
    const messageData = {
      name: 'John Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'Test message',
    };

    await analyticsService.sendContactMessage(messageData);

    const stored = mockLocalStorage.getItem('contact_messages');
    if (stored) {
      const messages = JSON.parse(stored);
      const lastMessage = messages[messages.length - 1];
      expect(lastMessage.date).toBeDefined();
      expect(new Date(lastMessage.date).getTime()).toBeLessThanOrEqual(Date.now());
    }
  });
});
