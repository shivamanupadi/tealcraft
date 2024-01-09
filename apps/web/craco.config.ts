import webpack from "webpack";
import path from "path";
import { realpathSync } from "node:fs";
import ESLintWebpackPlugin from "eslint-webpack-plugin";

const appDirectory = realpathSync(process.cwd());
const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath);

export default {
  devServer: {
    port: 9000,
  },
  plugins: [
    {
      plugin: require("craco-babel-loader"),
      options: {
        includes: [
          resolveApp("../../packages/algocore"),
          resolveApp("../../packages/theme"),
          resolveApp("../../packages/tealcraft-sdk"),
          resolveApp("../../packages/utils"),
          resolveApp("../../packages/ui"),
        ],
      },
    },
  ],
  webpack: {
    configure: (webpackConfig: any, { env, paths }: any) => {
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new ESLintWebpackPlugin({
          extensions: ["ts", "tsx", "js", "jsx"],
          exclude: ["node_modules"],
          eslintPath: require.resolve("eslint"),
          context: ".",
          cache: true,
        }),
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
        }),
        new webpack.DefinePlugin({
          "process.env.APP_VERSION": JSON.stringify(
            process.env.npm_package_version,
          ),
        }),
      ];
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        fallback: {
          ...webpackConfig.resolve.fallback,
          stream: require.resolve("stream"),
          buffer: require.resolve("buffer"),
          path: require.resolve("path-browserify"),
          process: require.resolve("process/browser"),
          perf_hooks: false,
        },
      };
      webpackConfig.module = {
        ...webpackConfig.module,
        noParse: [require.resolve("@ts-morph/common/dist/typescript.js")],
      };
      paths.appBuild = webpackConfig.output.path = path.resolve("dist");
      return webpackConfig;
    },
  },
};
