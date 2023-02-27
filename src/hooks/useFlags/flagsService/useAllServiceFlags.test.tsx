import { renderHook } from '@testing-library/react-hooks';

import { useAllServiceFlags } from './useAllServiceFlags';

afterAll(() => {
  jest.clearAllMocks();
});

describe('useAllServiceFlags hook', () => {
  test('should return all flags from flag service', () => {
    // Arrange && Act
    const { result } = renderHook(() => useAllServiceFlags());

    // Assert
    expect(result.current).toEqual([]);
  });
});
