import { DatagridChange } from '@dashboard/components/Datagrid/useDatagridChange';

import { getAttributeData } from './attributes';

describe('getAttributeData', () => {
  test('should filter and map data to attribute format', () => {
    // Arrage
    const changeData: DatagridChange[] = [
      { column: 'attribute:1', row: 1, data: { value: { value: 'test' } } },
      { column: 'attribute:2', row: 1, data: { value: { value: 'test2' } } },
    ];

    // Act
    const attributes = getAttributeData(changeData, 1, []);

    // Assert
    expect(attributes).toEqual([
      { id: '1', values: ['test'] },
      { id: '2', values: ['test2'] },
    ]);
  });

  test('should return empty array when no changes for given row', () => {
    // Arrage
    const changeData: DatagridChange[] = [
      { column: 'attribute:1', row: 1, data: { value: { value: 'test' } } },
      { column: 'attribute:2', row: 1, data: { value: { value: 'test2' } } },
    ];

    // Act
    const attributes = getAttributeData(changeData, 2, []);

    // Assert
    expect(attributes).toEqual([]);
  });

  test('should return empty array when no changes for attributes column', () => {
    // Arrage
    const changeData: DatagridChange[] = [
      { column: 'channel:1', row: 1, data: { value: { value: 'test' } } },
      { column: 'channel:2', row: 1, data: { value: { value: 'test2' } } },
    ];

    // Act
    const attributes = getAttributeData(changeData, 1, []);

    // Assert
    expect(attributes).toEqual([]);
  });
});
