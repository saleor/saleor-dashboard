import { renderHook } from '@testing-library/react';
import { useMetadataFormControls } from '../MetadataHookForm/useMetadataFormControls';

test('renders metadata fields', () => {
  const { result } = renderHook(() => useMetadataFormControls());
  expect(result.current.metadataFields).toBeInTheDocument();
});

test('renders private metadata fields', () => {
  const { result } = renderHook(() => useMetadataFormControls());
  expect(result.current.privateMetadataFields).toBeInTheDocument();
});

test('handles metadata change', () => {
  const { result } = renderHook(() => useMetadataFormControls());
  const metadataField = result.current.metadataFields[0];
  fireEvent.change(metadataField, { target: { value: 'New value' } });
  expect(metadataField).toHaveValue('New value');
});

test('handles private metadata change', () => {
  const { result } = renderHook(() => useMetadataFormControls());
  const privateMetadataField = result.current.privateMetadataFields[0];
  fireEvent.change(privateMetadataField, { target: { value: 'New private value' } });
  expect(privateMetadataField).toHaveValue('New private value');
});

test('updates form values on metadata change', () => {
  const { result } = renderHook(() => useMetadataFormControls());
  const metadataField = result.current.metadataFields[0];
  fireEvent.change(metadataField, { target: { value: 'New value' } });
  expect(result.current.formValues).toHaveValue('New value');
});

test('updates form values on private metadata change', () => {
  const { result } = renderHook(() => useMetadataFormControls());
  const privateMetadataField = result.current.privateMetadataFields[0];
  fireEvent.change(privateMetadataField, { target: { value: 'New private value' } });
  expect(result.current.formValues).toHaveValue('New private value');
});

test('handles metadata add', () => {
  const { result } = renderHook(() => useMetadataFormControls());
  const metadataList = result.current.metadataFields;
  fireEvent.click(metadataList[0].querySelector('button'));
  expect(metadataList.length).toBe(2);
});

test('handles private metadata add', () => {
  const { result } = renderHook(() => useMetadataFormControls());
  const privateMetadataList = result.current.privateMetadataFields;
  fireEvent.click(privateMetadataList[0].querySelector('button'));
  expect(privateMetadataList.length).toBe(2);
});

test('handles metadata remove', () => {
  const { result } = renderHook(() => useMetadataFormControls());
  const metadataList = result.current.metadataFields;
  fireEvent.click(metadataList[0].querySelector('button'));
  expect(metadataList.length).toBe(1);
});

test('handles private metadata remove', () => {
  const { result } = renderHook(() => useMetadataFormControls());
  const privateMetadataList = result.current.privateMetadataFields;
  fireEvent.click(privateMetadataList[0].querySelector('button'));
  expect(privateMetadataList.length).toBe(1);
});
