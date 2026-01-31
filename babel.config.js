module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@features': './src/features',
            '@navigation': './src/navigation',
            '@services': './src/services',
            '@stores': './src/stores',
            '@hooks': './src/hooks',
            '@utils': './src/utils',
            '@theme': './src/theme',
            '@types': './src/types',
            '@constants': './src/constants',
            '@assets': './assets',
            '@config': './src/config',
          },
        },
      ],
    ],
  };
};
