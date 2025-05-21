import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TourDetails from '../TourDetails';
import { toursAPI } from '../../services/api';

// Mock the API
vi.mock('../../services/api', () => ({
  toursAPI: {
    getById: vi.fn(),
    create: vi.fn(),
  },
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => vi.fn(),
  };
});

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('TourDetails', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const mockTour = {
    id: 1,
    title: 'Test Tour',
    description: 'Test Description',
    price: 100,
    location: 'Test Location',
    duration: '2 days',
    rating: 4.5,
    category: 'Adventure',
    difficulty: 'Easy',
    image: 'test-image.jpg',
    highlights: ['Highlight 1', 'Highlight 2'],
  };

  it('renders loading state initially', () => {
    toursAPI.getById.mockResolvedValueOnce(mockTour);

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TourDetails />
        </BrowserRouter>
      </QueryClientProvider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders tour details when data is loaded', async () => {
    toursAPI.getById.mockResolvedValueOnce(mockTour);

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TourDetails />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(mockTour.title)).toBeInTheDocument();
      expect(screen.getByText(mockTour.description)).toBeInTheDocument();
      expect(screen.getByText(`$${mockTour.price}`)).toBeInTheDocument();
      expect(screen.getByText(mockTour.location)).toBeInTheDocument();
      expect(screen.getByText(mockTour.duration)).toBeInTheDocument();
      expect(screen.getByText(mockTour.category)).toBeInTheDocument();
      expect(screen.getByText(mockTour.difficulty)).toBeInTheDocument();
    });
  });

  it('handles booking successfully', async () => {
    toursAPI.getById.mockResolvedValueOnce(mockTour);
    toursAPI.create.mockResolvedValueOnce({ success: true });

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TourDetails />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Book Now')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Book Now'));

    await waitFor(() => {
      expect(toursAPI.create).toHaveBeenCalledWith({ tourId: '1' });
    });
  });

  it('handles booking error', async () => {
    toursAPI.getById.mockResolvedValueOnce(mockTour);
    toursAPI.create.mockRejectedValueOnce(new Error('Booking failed'));

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TourDetails />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Book Now')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Book Now'));

    await waitFor(() => {
      expect(toursAPI.create).toHaveBeenCalledWith({ tourId: '1' });
    });
  });

  it('renders error state when tour is not found', async () => {
    toursAPI.getById.mockRejectedValueOnce(new Error('Tour not found'));

    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <TourDetails />
        </BrowserRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error Loading Tour')).toBeInTheDocument();
    });
  });
}); 