/**
 * npm 包发布流程：
 *  1. npm login
 *  2. npm publish
 *  3. npm version major | minor | patch
 *      3.1 major 大版本 1.0.0
 *      3.2 minor 小版本 0.1.0
 *      3.3 patch 补丁   0.0.1
 *  4. 先执行打包命令再 publish ，包没变化是不能上传的哈~
 *
 *  npm version patch
 *
 *  npm publish
 */
