// 获取语法数据的API端点
const APIHandler = require('../lib/api-handler');
const GitHubAPI = require('../lib/github-api');
const DataManager = require('../lib/data-manager');

const handler = new APIHandler();

module.exports = handler.asyncHandler(async (req, res) => {
    // 处理OPTIONS请求
    if (req.method === 'OPTIONS') {
        return handler.handleOptions(res);
    }

    // 验证HTTP方法
    handler.validateMethod(req.method, ['GET']);

    // 验证环境变量
    const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = handler.validateEnvironment();

    // 解析查询参数
    const queryParams = handler.parseQueryParams(req.query);

    // 初始化服务
    const githubAPI = new GitHubAPI(GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO);
    const dataManager = new DataManager(githubAPI);

    // 获取语法数据
    const result = await dataManager.getGrammarData(queryParams);

    // 返回成功响应
    handler.sendSuccess(res, result);
});