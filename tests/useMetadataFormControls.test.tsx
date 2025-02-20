import { render, screen, fireEvent } from '@testing-library/react';
import { useMetadataFormControls } from '../MetadataHookForm/useMetadataFormControls';
import { useForm } from 'react-hook-form';

describe('useMetadataFormControls', () => {
  it('renders metadata fields', () => {
    const { getByTestId } = render(<useMetadataFormControls />);
    const metadataFields = getByTestId('metadata-fields');
    expect(metadataFields).toBeInTheDocument();
  });

  it('renders private metadata fields', () => {
    const { getByTestId } = render(<useMetadataFormControls />);
    const privateMetadataFields = getByTestId('private-metadata-fields');
    expect(privateMetadataFields).toBeInTheDocument();
  });

  it('handles metadata change', () => {
    const { getByTestId } = render(<useMetadataFormControls />);
    const metadataField = getByTestId('metadata-field-0');
    fireEvent.change(metadataField, { target: { value: 'New value' } });
    expect(metadataField).toHaveValue('New value');
  });

  it('handles private metadata change', () => {
    const { getByTestId } = render(<useMetadataFormControls />);
    const privateMetadataField = getByTestId('private-metadata-field-0');
    fireEvent.change(privateMetadataField, { target: { value: 'New private value' } });
    expect(privateMetadataField).toHaveValue('New private value');
  });

  it('updates form values on metadata change', () => {
    const { getByTestId } = render(<useMetadataFormControls />);
    const metadataField = getByTestId('metadata-field-0');
    fireEvent.change(metadataField, { target: { value: 'New value' } });
    const formValues = getByTestId('form-values');
    expect(formValues).toHaveValue('New value');
  });

  it('updates form values on private metadata change', () => {
    const { getByTestId } = render(<useMetadataFormControls />);
    const privateMetadataField = getByTestId('private-metadata-field-0');
    fireEvent.change(privateMetadataField, { target: { value: 'New private value' } });
    const formValues = getByTestId('form-values');
    expect(formValues).toHaveValue('New private value');
  });
});
