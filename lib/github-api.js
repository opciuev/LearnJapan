// GitHub API 操作封装类
class GitHubAPI {
    constructor(token, owner, repo) {
        this.token = token;
        this.owner = owner;
        this.repo = repo;
        this.baseUrl = 'https://api.github.com';
        this.headers = {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'User-Agent': 'LearnJapan-Admin'
        };
    }

    /**
     * 获取文件内容
     * @param {string} path - 文件路径
     * @returns {Promise<{content: string, sha: string}>}
     */
    async getFileContent(path) {
        const response = await fetch(
            `${this.baseUrl}/repos/${this.owner}/${this.repo}/contents/${path}`,
            { headers: this.headers }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`获取文件失败: ${response.status} - ${error.message || response.statusText}`);
        }

        const data = await response.json();
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        
        return {
            content,
            sha: data.sha
        };
    }

    /**
     * 更新文件内容
     * @param {string} path - 文件路径
     * @param {string} content - 新内容
     * @param {string} sha - 文件的SHA值
     * @param {string} message - 提交信息
     * @returns {Promise<Object>}
     */
    async updateFileContent(path, content, sha, message) {
        const response = await fetch(
            `${this.baseUrl}/repos/${this.owner}/${this.repo}/contents/${path}`,
            {
                method: 'PUT',
                headers: this.headers,
                body: JSON.stringify({
                    message,
                    content: Buffer.from(content).toString('base64'),
                    sha
                })
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`更新文件失败: ${response.status} - ${error.message || response.statusText}`);
        }

        return await response.json();
    }

    /**
     * 验证API连接
     * @returns {Promise<boolean>}
     */
    async validateConnection() {
        try {
            const response = await fetch(
                `${this.baseUrl}/repos/${this.owner}/${this.repo}`,
                { headers: this.headers }
            );
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}

module.exports = GitHubAPI;
