import { render, fireEvent } from '@testing-library/svelte';
import PlayerJoin from '../src/components/player/PlayerJoin.svelte';

test('should emit join event on form submit', async () => {
  const mockOnJoin = vi.fn();
  const { getByRole, getByPlaceholderText } = render(PlayerJoin, { props: { connectionStatus: 'connected', onJoin: mockOnJoin } });

  const input = getByPlaceholderText(/player/i);
  await fireEvent.input(input, { target: { value: 'Test Player' } });
  await fireEvent.click(getByRole('button'));
  expect(mockOnJoin).toHaveBeenCalledWith('Test Player');
});
