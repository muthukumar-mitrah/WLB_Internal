/**
 * babel.config.js
 */
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.js', '.jsx', '.json'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@constants': './src/constants',
          '@theme': './src/theme',
          '@redux': './src/redux',
          '@api': './src/api',
          '@assets': './src/assets',
        },
      },
    ],
  ],
};
