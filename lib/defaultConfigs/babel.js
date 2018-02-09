"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var browsers_1 = __importDefault(require("./browsers"));
exports.default = {
    cacheDirectory: false,
    presets: [
        [require.resolve("@babel/preset-env"), {
                "targets": {
                    "browsers": browsers_1.default,
                }
            }],
        require.resolve("@babel/preset-react")
    ],
    plugins: [
        require.resolve('@babel/plugin-transform-runtime'),
        require.resolve('@babel/plugin-proposal-export-default'),
    ],
};
