import { useContentHeight } from './useContentHeight';

describe('useContentHeight', () => {
  it('should return the correct height without savebar', () => {
    const { withoutSaveBar } = useContentHeight();
    const height = withoutSaveBar();

    expect(height).toEqual('calc(100vh - 77px - 1px)');
  });

  it('should return the correct height with savebar', () => {
    const { withSaveBar } = useContentHeight();
    const height = withSaveBar({ noTopNav: false });

    expect(height).toEqual('calc(100vh - 77px - 64px - 1px)');
  });

  it('should return the correct height with savebar and no top nav', () => {
    const { withSaveBar } = useContentHeight();
    const height = withSaveBar({ noTopNav: true });

    expect(height).toEqual('calc(100vh - 0px - 64px - 1px)');
  });
});
