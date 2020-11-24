"use strict";

const build = require("@microsoft/sp-build-web");

build.addSuppression(
    `Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`
);

build.initialize(require("gulp"));

//#region webpack config custom actions - CUSTOM
const webpack = require("webpack");
const fs = require("fs");

build.configureWebpack.mergeConfig({
    additionalConfiguration: (generatedConfig) => {
        // find the Define plugins
        let plugin, pluginDefine;
        for (var i = 0; i < generatedConfig.plugins.length; i++) {
            plugin = generatedConfig.plugins[i];
            if (plugin instanceof webpack.DefinePlugin) {
                pluginDefine = plugin;
            }
        }

        // determine if in debug / production build
        const isDebugMode = pluginDefine.definitions.DEBUG;

        // set env replacements values
        if (isDebugMode) {
            // set azure appinsights string replacements
            pluginDefine.definitions.AZURE_APPINSIGHTS_INSTRUMENTATIONKEY = JSON.stringify(
                "000000-0000-0000-0000-000000000"
            );
            // set webpart name string replacements
            pluginDefine.definitions.WEBPART_NAME = JSON.stringify(
                "MyWebPart_local"
            );
            // set webpart version string replacements
            pluginDefine.definitions.WEBPART_VERSION = JSON.stringify(
                "Local Version"
            );
        } else {
            pluginDefine.definitions.AZURE_APPINSIGHTS_INSTRUMENTATIONKEY = JSON.stringify(
                process.env.AZURE_APPINSIGHTS_INSTRUMENTATIONKEY
            );
            pluginDefine.definitions.WEBPART_NAME = JSON.stringify(
                process.env.WEBPART_NAME
            );
            pluginDefine.definitions.WEBPART_VERSION = JSON.stringify(
                process.env.WEBPART_VERSION
            );
        }

        // return modified config => SPFx build pipeline
        return generatedConfig;
    },
});
//#endregion
