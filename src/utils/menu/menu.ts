interface IBaseMenuItem<TMenuData = {}, TValue = string> {
  label: React.ReactNode;
  value?: TValue;
  data: TMenuData | null;
}
export type IFlatMenuItem<TMenuData = {}, TValue = string> = IBaseMenuItem<
  TMenuData,
  TValue
> & {
  id: string;
  parent: string | null;
  sort: number;
};
export type IMenuItem<TMenuData = {}, TValue = string> = IBaseMenuItem<
  TMenuData,
  TValue
> & {
  children: Array<IMenuItem<TMenuData, TValue>>;
};
export type IMenu<TMenuData = {}, TValue = string> = Array<
  IMenuItem<TMenuData, TValue>
>;
export type IFlatMenu<TMenuData = {}, TValue = string> = Array<
  IFlatMenuItem<TMenuData, TValue>
>;

export function validateMenuOptions<TMenuData = {}, TValue = string>(
  menu: IMenu<TMenuData, TValue>,
): boolean {
  const values: TValue[] = toFlat(menu)
    .map(menuItem => menuItem.value)
    .filter(value => value !== undefined);
  const uniqueValues = Array.from(new Set(values));
  return uniqueValues.length === values.length;
}

function _getMenuItemByPath<TMenuData = {}, TValue = string>(
  menuItem: IMenuItem<TMenuData, TValue>,
  path: number[],
): IMenuItem<TMenuData, TValue> {
  if (path.length === 0) {
    return menuItem;
  }
  return _getMenuItemByPath(menuItem.children[path[0]], path.slice(1));
}

export function getMenuItemByPath<TMenuData = {}, TValue = string>(
  menu: IMenu<TMenuData, TValue>,
  path: number[],
): IMenuItem<TMenuData, TValue> {
  return _getMenuItemByPath(menu[path[0]], path.slice(1));
}

export function getMenuItemByValue<TMenuData = {}, TValue = string>(
  menu: IMenu<TMenuData, TValue>,
  value: TValue,
): IMenuItem<TMenuData, TValue> {
  const flatMenu = toFlat(menu);
  const flatMenuItem: IFlatMenuItem<TMenuData, TValue> = flatMenu.find(
    menuItem => menuItem.value === value,
  );

  if (flatMenuItem === undefined) {
    throw new Error(`Value ${value} does not exist in menu`);
  }

  return _fromFlat(flatMenu, flatMenuItem);
}

function _walkToMenuItem<TMenuData = {}, TValue = string>(
  menuItem: IMenuItem<TMenuData, TValue>,
  path: number[],
): IMenu<TMenuData, TValue> {
  const node = menuItem.children[path[0]];

  if (path.length === 1) {
    return [node];
  }

  return [node, ..._walkToMenuItem(node, path.slice(1))];
}

export function walkToMenuItem<TMenuData = {}, TValue = string>(
  menu: IMenu<TMenuData, TValue>,
  path: number[],
): IMenu<TMenuData, TValue> {
  const walkByNode = menu[path[0]];
  return [walkByNode, ..._walkToMenuItem(walkByNode, path.slice(1))];
}

function _walkToRoot<TMenuData = {}, TValue = string>(
  flatMenu: IFlatMenu<TMenuData, TValue>,
  parent: string,
): IFlatMenu<TMenuData, TValue> {
  const menuItem = flatMenu.find(menuItem => menuItem.id === parent);

  if (menuItem.parent === null) {
    return [menuItem];
  }

  return [menuItem, ..._walkToRoot(flatMenu, menuItem.parent)];
}
export function walkToRoot<TMenuData = {}, TValue = string>(
  menu: IMenu<TMenuData, TValue>,
  value: TValue,
): IMenu<TMenuData, TValue> {
  const flatMenu = toFlat(menu);
  const menuItem = flatMenu.find(menuItem => menuItem.value === value);

  return (menuItem.parent === null
    ? [menuItem]
    : [menuItem, ..._walkToRoot(flatMenu, menuItem.parent)]
  ).map(flatMenuItem => _fromFlat(flatMenu, flatMenuItem));
}

function _toFlat<TMenuData = {}, TValue = string>(
  menuItem: IMenuItem<TMenuData, TValue>,
  sort: number,
  parent: string,
): IFlatMenu<TMenuData, TValue> {
  const id = parent ? [parent, sort].join(":") : sort.toString();
  const flatMenuItem: IFlatMenuItem<TMenuData, TValue> = {
    data: menuItem.data,
    id,
    label: menuItem.label,
    parent,
    sort,
    value: menuItem.value,
  };
  return [
    flatMenuItem,
    ...menuItem.children
      .map((child, childIndex) => _toFlat(child, childIndex, id))
      .reduce(
        (acc, curr) => [...acc, ...curr],
        [] as IFlatMenu<TMenuData, TValue>,
      ),
  ];
}
export function toFlat<TMenuData = {}, TValue = string>(
  menu: IMenu<TMenuData, TValue>,
): IFlatMenu<TMenuData, TValue> {
  return menu
    .map((menuItem, menuItemIndex) => _toFlat(menuItem, menuItemIndex, null))
    .reduce(
      (acc, curr) => [...acc, ...curr],
      [] as IFlatMenu<TMenuData, TValue>,
    );
}

function _fromFlat<TMenuData = {}, TValue = string>(
  menu: IFlatMenu<TMenuData, TValue>,
  flatMenuItem: IFlatMenuItem<TMenuData, TValue>,
): IMenuItem<TMenuData, TValue> {
  const children: Array<IMenuItem<TMenuData, TValue>> = menu
    .filter(menuItem => menuItem.parent === flatMenuItem.id)
    .map(menuItem => _fromFlat(menu, menuItem));

  return {
    children,
    data: flatMenuItem.data,
    label: flatMenuItem.label,
    value: flatMenuItem.value,
  };
}
export function fromFlat<TMenuData = {}, TValue = string>(
  menu: IFlatMenu<TMenuData, TValue>,
): IMenu<TMenuData, TValue> {
  return menu
    .filter(menuItem => menuItem.parent === null)
    .map(menuItem => _fromFlat(menu, menuItem));
}

export function isLeaf<TMenuData = {}, TValue = string>(
  menuItem: IMenuItem<TMenuData, TValue>,
): boolean {
  return menuItem.children.length === 0;
}
