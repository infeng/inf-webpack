"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var strip_json_comments_1 = __importDefault(require("strip-json-comments"));
var fs_1 = require("fs");
var assert_1 = __importDefault(require("assert"));
function getRcConfig(rcFile) {
    assert_1.default(fs_1.existsSync(rcFile), "can not find " + rcFile);
    return JSON.parse(strip_json_comments_1.default(fs_1.readFileSync(rcFile, 'utf-8')));
}
exports.getRcConfig = getRcConfig;
