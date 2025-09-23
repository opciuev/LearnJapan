// 数据管理类
const yaml = require('js-yaml');
const GitHubAPI = require('./github-api');

class DataManager {
    constructor(githubAPI) {
        this.github = githubAPI;
    }

    /**
     * 获取语法数据
     * @param {Object} options - 查询选项
     * @returns {Promise<Object>}
     */
    async getGrammarData(options = {}) {
        const { search = '', page = 1, limit = 10 } = options;
        
        try {
            const { content, sha } = await this.github.getFileContent('_data/grammar.yml');
            const grammarData = yaml.load(content) || [];
            
            return this._processData(grammarData, { search, page, limit, sha });
        } catch (error) {
            throw new Error(`获取语法数据失败: ${error.message}`);
        }
    }

    /**
     * 获取表达式数据
     * @param {Object} options - 查询选项
     * @returns {Promise<Object>}
     */
    async getExpressionsData(options = {}) {
        const { search = '', page = 1, limit = 10 } = options;
        
        try {
            const { content, sha } = await this.github.getFileContent('_data/expressions.yml');
            const expressionsData = yaml.load(content) || [];
            
            return this._processData(expressionsData, { search, page, limit, sha });
        } catch (error) {
            throw new Error(`获取表达式数据失败: ${error.message}`);
        }
    }

    /**
     * 更新语法数据
     * @param {string} action - 操作类型 (add/update/delete)
     * @param {Object} itemData - 项目数据
     * @param {string} sha - 文件SHA值
     * @returns {Promise<Object>}
     */
    async updateGrammarData(action, itemData, sha) {
        try {
            const { content } = await this.github.getFileContent('_data/grammar.yml');
            let grammarData = yaml.load(content) || [];
            
            grammarData = this._performAction(grammarData, action, itemData);
            
            const newContent = this._serializeYAML(grammarData);
            const message = this._getCommitMessage('语法', action, itemData);
            
            const result = await this.github.updateFileContent(
                '_data/grammar.yml',
                newContent,
                sha,
                message
            );
            
            return {
                success: true,
                message: `${this._getActionText(action)}语法项目成功`,
                commit: result.commit
            };
        } catch (error) {
            throw new Error(`更新语法数据失败: ${error.message}`);
        }
    }

    /**
     * 更新表达式数据
     * @param {string} action - 操作类型 (add/update/delete)
     * @param {Object} itemData - 项目数据
     * @param {string} sha - 文件SHA值
     * @returns {Promise<Object>}
     */
    async updateExpressionsData(action, itemData, sha) {
        try {
            const { content } = await this.github.getFileContent('_data/expressions.yml');
            let expressionsData = yaml.load(content) || [];
            
            expressionsData = this._performAction(expressionsData, action, itemData);
            
            const newContent = this._serializeYAML(expressionsData);
            const message = this._getCommitMessage('表达式', action, itemData);
            
            const result = await this.github.updateFileContent(
                '_data/expressions.yml',
                newContent,
                sha,
                message
            );
            
            return {
                success: true,
                message: `${this._getActionText(action)}表达式成功`,
                commit: result.commit
            };
        } catch (error) {
            throw new Error(`更新表达式数据失败: ${error.message}`);
        }
    }

    /**
     * 处理数据（搜索、分页等）
     * @private
     */
    _processData(data, options) {
        const { search, page, limit, sha } = options;
        let filteredData = data;
        
        // 搜索过滤
        if (search) {
            const searchLower = search.toLowerCase();
            filteredData = data.filter(item => 
                (item.expression && item.expression.toLowerCase().includes(searchLower)) ||
                (item.explanation && item.explanation.toLowerCase().includes(searchLower))
            );
        }
        
        // 分页处理
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedData = filteredData.slice(startIndex, endIndex);
        
        return {
            data: paginatedData,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: filteredData.length,
                pages: Math.ceil(filteredData.length / limit)
            },
            sha
        };
    }

    /**
     * 执行数据操作
     * @private
     */
    _performAction(data, action, itemData) {
        switch (action) {
            case 'add':
                const maxIdx = Math.max(...data.map(item => item.idx || 0), 0);
                const newItem = {
                    idx: maxIdx + 1,
                    lesson: itemData.lesson,
                    expression: itemData.expression,
                    shortexplain: itemData.shortexplain || '',
                    explanation: itemData.explanation,
                    examples: itemData.examples || []
                };
                return [...data, newItem];
                
            case 'update':
                const updateIndex = data.findIndex(item => item.idx === itemData.idx);
                if (updateIndex === -1) {
                    throw new Error('要更新的项目不存在');
                }
                
                data[updateIndex] = {
                    ...data[updateIndex],
                    lesson: itemData.lesson,
                    expression: itemData.expression,
                    shortexplain: itemData.shortexplain || '',
                    explanation: itemData.explanation,
                    examples: itemData.examples || []
                };
                return data;
                
            case 'delete':
                return data.filter(item => item.idx !== itemData.idx);
                
            default:
                throw new Error(`不支持的操作类型: ${action}`);
        }
    }

    /**
     * 序列化为YAML格式
     * @private
     */
    _serializeYAML(data) {
        return yaml.dump(data, {
            defaultFlowStyle: false,
            lineWidth: -1,
            noRefs: true,
            sortKeys: false
        });
    }

    /**
     * 生成提交信息
     * @private
     */
    _getCommitMessage(type, action, itemData) {
        const actionText = this._getActionText(action);
        const expression = itemData.expression || '';
        return `${actionText}${type}: ${expression}`;
    }

    /**
     * 获取操作文本
     * @private
     */
    _getActionText(action) {
        const actionMap = {
            'add': '添加',
            'update': '更新',
            'delete': '删除'
        };
        return actionMap[action] || action;
    }
}

module.exports = DataManager;
