// 健康检查和系统状态API端点
const APIHandler = require('../lib/api-handler');
const GitHubAPI = require('../lib/github-api');

const handler = new APIHandler();

module.exports = handler.asyncHandler(async (req, res) => {
    // 处理OPTIONS请求
    if (req.method === 'OPTIONS') {
        return handler.handleOptions(res);
    }

    // 验证HTTP方法
    handler.validateMethod(req.method, ['GET']);

    const status = {
        timestamp: new Date().toISOString(),
        status: 'ok',
        version: '1.0.0',
        environment: {
            nodeVersion: process.version,
            platform: process.platform
        },
        services: {}
    };

    try {
        // 验证环境变量
        const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = handler.validateEnvironment();
        
        status.services.github = {
            configured: true,
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO
        };

        // 测试GitHub连接
        const githubAPI = new GitHubAPI(GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO);
        const isConnected = await githubAPI.validateConnection();
        
        status.services.github.connected = isConnected;
        status.services.github.status = isConnected ? 'healthy' : 'error';

        if (!isConnected) {
            status.status = 'degraded';
        }

    } catch (error) {
        status.status = 'error';
        status.services.github = {
            configured: false,
            status: 'error',
            error: error.message
        };
    }

    // 根据整体状态设置HTTP状态码
    const httpStatus = status.status === 'ok' ? 200 : 
                      status.status === 'degraded' ? 200 : 503;

    handler.sendSuccess(res, status, httpStatus);
});
