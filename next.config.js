/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();


module.exports = withNextIntl({
  reactStrictMode: true,
  experimental: {
    esmExternals: "loose", // required to make Konva & react-konva work
  },
  webpack: (config) => {
    config.externals = [...config.externals, {canvas: "canvas"}]; // required to make Konva & react-konva work
    return config;
  },
});
