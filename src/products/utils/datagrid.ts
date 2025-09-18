// @ts-strict-ignore
/**
 * 创建一个使用正则表达式从列名中提取数据的函数。
 *
 * @param {RegExp} regexp - 用于提取数据的正则表达式。
 * @returns {(column: string) => string | null} 一个接受列名并返回提取的数据或 null 的函数。
 */
export function makeGetColumnData(regexp: RegExp): (column: string) => string | null {
  return column => {
    if (!regexp.test(column)) {
      return null;
    }

    return column.match(regexp)[1];
  };
}

/**
 * 从列名中提取属性 ID。
 * @param {string} column - 列名。
 * @returns {string | null} 属性 ID 或 null。
 */
export const getColumnAttribute = makeGetColumnData(/^attribute:(.*)/);

/**
 * 从列名中提取渠道 ID。
 * @param {string} column - 列名。
 * @returns {string | null} 渠道 ID 或 null。
 */
export const getColumnChannel = makeGetColumnData(/^channel:(.*)/);

/**
 * 从可用性列名中提取渠道 ID。
 * @param {string} column - 列名。
 * @returns {string | null} 渠道 ID 或 null。
 */
export const getColumnChannelAvailability = makeGetColumnData(/^availableInChannel:(.*)/);

/**
 * 从列名中提取库存 ID。
 * @param {string} column - 列名。
 * @returns {string | null} 库存 ID 或 null。
 */
export const getColumnStock = makeGetColumnData(/^warehouse:(.*)/);

/**
 * 获取列的基本名称（第一个冒号之前的部分）。
 *
 * @param {string} column - 列名。
 * @returns {string} 列的基本名称。
 */
export const getColumnName = (column: string) => {
  const splited = column.split(":");

  return splited[0];
};

/**
 * 检查给定行是否为当前行。
 *
 * @param {number} datagridChangeIndex - 数据网格更改的索引。
 * @param {number} variantIndex - 变体的索引。
 * @returns {boolean} 该行是否为当前行。
 */
export const isCurrentRow = (datagridChangeIndex: number, variantIndex: number) =>
  datagridChangeIndex === variantIndex;
