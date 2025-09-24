module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: { '@': './src' },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    ],
    '@babel/plugin-transform-export-namespace-from', // adiciona este
    'react-native-worklets/plugin', // mantenha por último
  ],
};
