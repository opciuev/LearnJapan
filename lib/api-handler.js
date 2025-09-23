// API处理器基类
class APIHandler {
    constructor() {
        this.corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        };
    }

    /**
     * 设置CORS头
     * @param {Object} res - 响应对象
     */
    setCORSHeaders(res) {
        Object.entries(this.corsHeaders).forEach(([key, value]) => {
            res.setHeader(key, value);
        });
    }

    /**
     * 处理OPTIONS请求
     * @param {Object} res - 响应对象
     */
    handleOptions(res) {
        this.setCORSHeaders(res);
        res.status(200).end();
    }

    /**
     * 验证环境变量
     * @returns {Object} 环境变量对象
     * @throws {Error} 如果缺少必要的环境变量
     */
    validateEnvironment() {
        const { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO } = process.env;
        
        if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
            const missing = [];
            if (!GITHUB_TOKEN) missing.push('GITHUB_TOKEN');
            if (!GITHUB_OWNER) missing.push('GITHUB_OWNER');
            if (!GITHUB_REPO) missing.push('GITHUB_REPO');
            
            throw new Error(`缺少环境变量: ${missing.join(', ')}`);
        }
        
        return { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO };
    }

    /**
     * 验证HTTP方法
     * @param {string} method - 请求方法
     * @param {Array} allowedMethods - 允许的方法列表
     * @throws {Error} 如果方法不被允许
     */
    validateMethod(method, allowedMethods) {
        if (!allowedMethods.includes(method)) {
            throw new Error(`方法不允许: ${method}. 允许的方法: ${allowedMethods.join(', ')}`);
        }
    }

    /**
     * 解析查询参数
     * @param {Object} query - 查询对象
     * @returns {Object} 解析后的参数
     */
    parseQueryParams(query) {
        return {
            search: query.search || '',
            page: parseInt(query.page) || 1,
            limit: parseInt(query.limit) || 10
        };
    }

    /**
     * 验证请求体
     * @param {Object} body - 请求体
     * @param {Array} requiredFields - 必需字段
     * @throws {Error} 如果缺少必需字段
     */
    validateRequestBody(body, requiredFields) {
        const missing = requiredFields.filter(field => !body.hasOwnProperty(field));
        if (missing.length > 0) {
            throw new Error(`缺少必需字段: ${missing.join(', ')}`);
        }
    }

    /**
     * 发送成功响应
     * @param {Object} res - 响应对象
     * @param {*} data - 响应数据
     * @param {number} status - 状态码
     */
    sendSuccess(res, data, status = 200) {
        this.setCORSHeaders(res);
        res.status(status).json(data);
    }

    /**
     * 发送错误响应
     * @param {Object} res - 响应对象
     * @param {Error|string} error - 错误信息
     * @param {number} status - 状态码
     */
    sendError(res, error, status = 500) {
        this.setCORSHeaders(res);
        
        const errorMessage = error instanceof Error ? error.message : error;
        const errorResponse = {
            error: errorMessage,
            timestamp: new Date().toISOString()
        };
        
        // 记录错误日志
        console.error(`API Error [${status}]:`, errorMessage);
        if (error instanceof Error && error.stack) {
            console.error('Stack trace:', error.stack);
        }
        
        res.status(status).json(errorResponse);
    }

    /**
     * 异步处理器包装器
     * @param {Function} handler - 处理函数
     * @returns {Function} 包装后的处理函数
     */
    asyncHandler(handler) {
        return async (req, res) => {
            try {
                await handler(req, res);
            } catch (error) {
                this.sendError(res, error);
            }
        };
    }
}

module.exports = APIHandler;
