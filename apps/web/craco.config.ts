import webpack from "webpack";
import path from "path";
import "react-scripts/config/env";

export default {
    devServer: {
        port: 9000,
    },
    webpack: {
        configure: (webpackConfig: any, { env, paths }: any) => {
            webpackConfig.plugins = [
                ...webpackConfig.plugins,
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
                },
            };
            paths.appBuild = webpackConfig.output.path = path.resolve("dist");
            return webpackConfig;
        },
    },
};
