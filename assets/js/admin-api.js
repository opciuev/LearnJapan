// 管理界面API客户端类
class AdminAPI {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }

    /**
     * 发送HTTP请求
     * @private
     */
    async _request(url, options = {}) {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        const response = await fetch(`${this.baseUrl}${url}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        return data;
    }

    /**
     * 获取语法数据
     */
    async getGrammar(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this._request(`/api/get-grammar${queryString ? '?' + queryString : ''}`);
    }

    /**
     * 更新语法数据
     */
    async updateGrammar(action, data, sha) {
        return this._request('/api/update-grammar', {
            method: 'POST',
            body: JSON.stringify({ action, data, sha })
        });
    }

    /**
     * 获取表达式数据
     */
    async getExpressions(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this._request(`/api/get-expressions${queryString ? '?' + queryString : ''}`);
    }

    /**
     * 更新表达式数据
     */
    async updateExpressions(action, data, sha) {
        return this._request('/api/update-expressions', {
            method: 'POST',
            body: JSON.stringify({ action, data, sha })
        });
    }

    /**
     * 健康检查
     */
    async getHealth() {
        return this._request('/api/health');
    }
}
