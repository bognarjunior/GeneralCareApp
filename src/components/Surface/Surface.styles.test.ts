describe('Surface styles - fallback de shadowColor', () => {
  const realNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = realNodeEnv;
  });

  afterAll(() => {
    process.env.NODE_ENV = realNodeEnv;
  });

  it('usa theme.colors.text quando colors.shadow e colors.black estão ausentes', () => {
    jest.doMock('@/theme', () => ({
      __esModule: true,
      default: {
        colors: {
          text: '#123456',
          border: '#eeeeee',
          surface: '#ffffff',
          primary: '#0055ff',
          muted: '#999999',
          danger: '#ff0000',
          white: '#ffffff',
          info: '#3178c6',
          success: '#00aa66',
          successLight: '#dff5ea',
          successDark: '#04764a',
          dangerLight: '#fde2e2',
          dangerDark: '#a40000',
          infoLight: '#e6f0fb',
          infoDark: '#245d96',
        },
        spacing: { sm: 4, md: 8, lg: 16, xl: 24 },
        radius: { md: 8, lg: 16 },
        border: { width: { hairline: 1 } },
        gradients: { surface: { soft: ['#ffffff', '#f5f7fa'] } },
        fonts: { size: { md: 14 }, family: {} },
        sizes: { icon: { xl: 32 } },
        shadows: { sm: {} },
      },
    }));

    jest.isolateModules(() => {
      const styles = require('./styles').default as any;
      const shadow = styles.shadow || {};
      expect(shadow.shadowColor).toBe('#123456');
    });
  });
});
