import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import App from '../App';

// Mock response data
const mockTranscriptionResponse = {
  transcription: {
    results: {
      channels: [{
        alternatives: [{
          transcript: "This is a test transcript",
          words: [
            { word: "This", start: 0, end: 0.5, confidence: 0.99 },
            { word: "is", start: 0.5, end: 0.7, confidence: 0.98 },
            { word: "a", start: 0.7, end: 0.8, confidence: 0.99 },
            { word: "test", start: 0.8, end: 1.1, confidence: 0.97 },
            { word: "transcript", start: 1.1, end: 1.8, confidence: 0.96 }
          ],
          summaries: [{ text: "A test transcript summary" }],
          topics: [{ topic: "Testing" }]
        }]
      }]
    }
  }
};

// Set up MSW server
const server = setupServer(
  http.post('/api/transcribe', () => {
    return HttpResponse.json(mockTranscriptionResponse);
  })
);

beforeAll(() => server.listen());
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('App Component', () => {
  it('renders the title correctly', () => {
    render(<App />);
    expect(screen.getByText('Transcribe')).toBeInTheDocument();
    expect(screen.getByText('Preexisting Audio Files')).toBeInTheDocument();
  });

  it('shows features list when no transcription is present', () => {
    render(<App />);
    expect(screen.getByText('Smart Format')).toBeInTheDocument();
    expect(screen.getByText('Summarization')).toBeInTheDocument();
    expect(screen.getByText('Topic Detection')).toBeInTheDocument();
  });

  it('validates URL input', async () => {
    render(<App />);
    const user = userEvent.setup();
    
    const input = screen.getByPlaceholderText('Enter YouTube URL...');
    const submitButton = screen.getByText('Transcribe');
    
    // Try submitting without a URL
    await user.click(submitButton);
    expect(input).toBeInvalid();
    
    // Try with invalid URL
    await user.type(input, 'not-a-url');
    await user.click(submitButton);
    expect(input).toBeInvalid();
    
    // Try with valid URL
    await user.clear(input);
    await user.type(input, 'https://youtube.com/watch?v=test');
    expect(input).toBeValid();
  });

  it('handles URL submission and displays transcription', async () => {
    render(<App />);
    const user = userEvent.setup();
    
    // Find and fill the input
    const input = screen.getByPlaceholderText('Enter YouTube URL...');
    await user.type(input, 'https://youtube.com/watch?v=test');
    
    // Submit the form
    const submitButton = screen.getByText('Transcribe');
    await user.click(submitButton);
    
    // Wait for the transcription to appear
    await waitFor(() => {
      expect(screen.getByText('This')).toBeInTheDocument();
      expect(screen.getByText('transcript')).toBeInTheDocument();
    });
    
    // Check if summary and topics are displayed
    expect(screen.getByText('A test transcript summary')).toBeInTheDocument();
    expect(screen.getByText('Testing')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    // Override the default handler for this test
    server.use(
      http.post('/api/transcribe', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<App />);
    const user = userEvent.setup();
    
    const input = screen.getByPlaceholderText('Enter YouTube URL...');
    await user.type(input, 'https://youtube.com/watch?v=test');
    
    const submitButton = screen.getByText('Transcribe');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to transcribe video')).toBeInTheDocument();
    });
  });

  it('toggles audio playback controls', async () => {
    render(<App />);
    
    // First submit a URL to get the transcription
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText('Enter YouTube URL...');
    await user.type(input, 'https://youtube.com/watch?v=test');
    
    const submitButton = screen.getByText('Transcribe');
    await user.click(submitButton);
    
    // Wait for the transcription and check audio controls
    await waitFor(() => {
      const audioButton = screen.getByRole('button', { name: /volume/i });
      expect(audioButton).toBeInTheDocument();
    });
  });

  it('shows loading state during transcription', async () => {
    // Add delay to simulate loading
    server.use(
      http.post('/api/transcribe', async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return HttpResponse.json(mockTranscriptionResponse);
      })
    );

    render(<App />);
    const user = userEvent.setup();
    
    const input = screen.getByPlaceholderText('Enter YouTube URL...');
    await user.type(input, 'https://youtube.com/watch?v=test');
    
    const submitButton = screen.getByText('Transcribe');
    await user.click(submitButton);
    
    // Check loading state
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    
    // Wait for completion
    await waitFor(() => {
      expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
    });
  });

  it('allows jumping to specific timestamps in transcription', async () => {
    render(<App />);
    const user = userEvent.setup();
    
    // Submit URL and get transcription
    const input = screen.getByPlaceholderText('Enter YouTube URL...');
    await user.type(input, 'https://youtube.com/watch?v=test');
    await user.click(screen.getByText('Transcribe'));
    
    // Wait for transcription
    await waitFor(() => {
      expect(screen.getByText('This')).toBeInTheDocument();
    });
    
    // Click on a word
    const word = screen.getByText('test');
    await user.click(word);
    
    // Audio element should be in the document (though hidden)
    const audio = document.querySelector('audio');
    expect(audio).toBeInTheDocument();
  });
});