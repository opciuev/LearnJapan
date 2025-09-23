// 更新表达式数据的API端点
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
    handler.validateMethod(req.method, ['POST', 'PUT']);

    // 验证环境变量
    const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = handler.validateEnvironment();

    // 验证请求体
    handler.validateRequestBody(req.body, ['action', 'data']);

    const { action, data: itemData, sha } = req.body;

    // 验证操作类型
    const validActions = ['add', 'update', 'delete'];
    if (!validActions.includes(action)) {
        return handler.sendError(res, `无效的操作类型: ${action}`, 400);
    }

    // 验证项目数据
    if (action === 'add' || action === 'update') {
        const requiredFields = ['lesson', 'expression', 'explanation'];
        const missingFields = requiredFields.filter(field => !itemData[field]);
        if (missingFields.length > 0) {
            return handler.sendError(res, `项目数据缺少必需字段: ${missingFields.join(', ')}`, 400);
        }
    }

    if (action === 'update' || action === 'delete') {
        if (!itemData.idx) {
            return handler.sendError(res, '更新或删除操作需要提供idx', 400);
        }
    }

    // 初始化服务
    const githubAPI = new GitHubAPI(GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO);
    const dataManager = new DataManager(githubAPI);

    // 执行更新操作
    const result = await dataManager.updateExpressionsData(action, itemData, sha);

    // 返回成功响应
    handler.sendSuccess(res, result, action === 'add' ? 201 : 200);
});