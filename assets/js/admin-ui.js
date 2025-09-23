// 管理界面UI控制器类
class AdminUI {
    constructor() {
        this.api = new AdminAPI();
        this.currentTab = 'grammar';
        this.currentData = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.editingItem = null;
        this.currentSha = null;
        
        this.init();
    }

    /**
     * 初始化UI
     */
    init() {
        this.bindEvents();
        this.loadData('grammar');
        this.checkSystemHealth();
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 搜索功能
        document.getElementById('grammar-search')?.addEventListener('input', 
            this.debounce(() => {
                this.currentPage = 1;
                this.loadData('grammar');
            }, 500)
        );
        
        document.getElementById('expressions-search')?.addEventListener('input', 
            this.debounce(() => {
                this.currentPage = 1;
                this.loadData('expressions');
            }, 500)
        );

        // 表单提交
        document.getElementById('editForm')?.addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });

        // 模态框外部点击关闭
        window.addEventListener('click', (event) => {
            const modal = document.getElementById('editModal');
            if (event.target === modal) {
                this.closeModal();
            }
        });
    }

    /**
     * 防抖函数
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * 检查系统健康状态
     */
    async checkSystemHealth() {
        try {
            const health = await this.api.getHealth();
            this.displayHealthStatus(health);
        } catch (error) {
            this.displayHealthStatus({ status: 'error', error: error.message });
        }
    }

    /**
     * 显示健康状态
     */
    displayHealthStatus(health) {
        const statusElement = document.getElementById('system-status');
        if (!statusElement) return;

        const statusClass = health.status === 'ok' ? 'success' : 
                           health.status === 'degraded' ? 'warning' : 'error';
        
        statusElement.className = `system-status ${statusClass}`;
        statusElement.innerHTML = `
            <span>系统状态: ${health.status}</span>
            ${health.services?.github ? 
                `<span>GitHub: ${health.services.github.connected ? '已连接' : '连接失败'}</span>` : 
                '<span>GitHub: 未配置</span>'
            }
        `;
    }

    /**
     * 切换标签
     */
    switchTab(tab) {
        this.currentTab = tab;
        this.currentPage = 1;
        
        // 更新标签样式
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[onclick="adminUI.switchTab('${tab}')"]`)?.classList.add('active');
        
        // 显示对应内容
        document.getElementById('grammar-content').style.display = tab === 'grammar' ? 'block' : 'none';
        document.getElementById('expressions-content').style.display = tab === 'expressions' ? 'block' : 'none';
        
        // 加载数据
        this.loadData(tab);
    }

    /**
     * 加载数据
     */
    async loadData(type) {
        const listElement = document.getElementById(`${type}-list`);
        const paginationElement = document.getElementById(`${type}-pagination`);
        const searchValue = document.getElementById(`${type}-search`)?.value || '';
        
        if (listElement) {
            listElement.innerHTML = '<div class="loading">加载中...</div>';
        }
        
        try {
            const params = {
                search: searchValue,
                page: this.currentPage,
                limit: 10
            };

            const result = type === 'grammar' ? 
                await this.api.getGrammar(params) : 
                await this.api.getExpressions(params);
            
            this.currentData = result.data;
            this.currentSha = result.sha;
            this.totalPages = result.pagination.pages;
            
            this.renderList(type, result.data);
            this.renderPagination(type, result.pagination);
            
        } catch (error) {
            if (listElement) {
                listElement.innerHTML = `<div class="error">加载失败: ${error.message}</div>`;
            }
        }
    }

    /**
     * 渲染列表
     */
    renderList(type, data) {
        const listElement = document.getElementById(`${type}-list`);
        if (!listElement) return;
        
        if (data.length === 0) {
            listElement.innerHTML = '<div class="loading">暂无数据</div>';
            return;
        }
        
        const table = document.createElement('table');
        table.className = 'data-table';
        
        table.innerHTML = `
            <thead>
                <tr>
                    <th>课程</th>
                    <th>表达式</th>
                    <th>说明</th>
                    <th>例句数</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(item => `
                    <tr>
                        <td>${this.escapeHtml(item.lesson)}</td>
                        <td>
                            <div class="japanese-text" style="font-weight: bold;">${this.escapeHtml(item.expression)}</div>
                            ${item.shortexplain ? `<div style="font-size: 12px; color: #666;">${this.escapeHtml(item.shortexplain)}</div>` : ''}
                        </td>
                        <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                            ${this.escapeHtml(item.explanation)}
                        </td>
                        <td>${item.examples ? item.examples.length : 0}</td>
                        <td>
                            <button class="btn btn-primary" style="margin-right: 5px; padding: 5px 10px; font-size: 12px;" onclick="adminUI.openModal('${type}', 'edit', ${item.idx})">编辑</button>
                            <button class="btn btn-danger" style="padding: 5px 10px; font-size: 12px;" onclick="adminUI.deleteItem('${type}', ${item.idx}, '${this.escapeHtml(item.expression)}')">删除</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        
        listElement.innerHTML = '';
        listElement.appendChild(table);
    }

    /**
     * 渲染分页
     */
    renderPagination(type, pagination) {
        const paginationElement = document.getElementById(`${type}-pagination`);
        if (!paginationElement) return;
        
        if (pagination.pages <= 1) {
            paginationElement.innerHTML = '';
            return;
        }
        
        paginationElement.innerHTML = `
            <button ${pagination.page === 1 ? 'disabled' : ''} onclick="adminUI.changePage(${pagination.page - 1})">上一页</button>
            <span>第 ${pagination.page} 页，共 ${pagination.pages} 页</span>
            <button ${pagination.page === pagination.pages ? 'disabled' : ''} onclick="adminUI.changePage(${pagination.page + 1})">下一页</button>
        `;
    }

    /**
     * 切换页面
     */
    changePage(page) {
        this.currentPage = page;
        this.loadData(this.currentTab);
    }

    /**
     * 打开模态框
     */
    openModal(type, action, idx = null) {
        this.editingItem = null;
        
        if (action === 'edit' && idx) {
            this.editingItem = this.currentData.find(item => item.idx === idx);
            if (!this.editingItem) {
                alert('找不到要编辑的项目');
                return;
            }
        }
        
        const modalTitle = document.getElementById('modal-title');
        if (modalTitle) {
            modalTitle.textContent = action === 'add' ? 
                `添加${type === 'grammar' ? '语法' : '表达式'}` : 
                `编辑${type === 'grammar' ? '语法' : '表达式'}`;
        }
        
        // 填充表单
        this.populateForm();
        
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    /**
     * 填充表单
     */
    populateForm() {
        const form = document.getElementById('editForm');
        if (!form) return;

        if (this.editingItem) {
            document.getElementById('lesson').value = this.editingItem.lesson || '';
            document.getElementById('expression').value = this.editingItem.expression || '';
            document.getElementById('shortexplain').value = this.editingItem.shortexplain || '';
            document.getElementById('explanation').value = this.editingItem.explanation || '';
            this.renderExamples(this.editingItem.examples || []);
        } else {
            form.reset();
            this.renderExamples([]);
        }
    }

    /**
     * 关闭模态框
     */
    closeModal() {
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        const messageDiv = document.getElementById('modal-message');
        if (messageDiv) {
            messageDiv.innerHTML = '';
        }
    }

    /**
     * 渲染例句
     */
    renderExamples(examples) {
        const container = document.getElementById('examples-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        examples.forEach((example, index) => {
            this.addExampleElement(example, index);
        });
    }

    /**
     * 添加例句
     */
    addExample() {
        const container = document.getElementById('examples-container');
        if (!container) return;
        
        const index = container.children.length;
        this.addExampleElement({ japanese: '', chinese: '', type: 'sentence' }, index);
    }

    /**
     * 添加例句元素
     */
    addExampleElement(example, index) {
        const container = document.getElementById('examples-container');
        if (!container) return;
        
        const div = document.createElement('div');
        div.className = 'example-item';
        div.innerHTML = `
            <div class="example-header">
                <strong>例句 ${index + 1}</strong>
                <button type="button" class="btn btn-danger" style="padding: 2px 8px; font-size: 12px;" onclick="adminUI.removeExample(${index})">删除</button>
            </div>
            <div class="form-group">
                <label>日语例句:</label>
                <input type="text" name="example-japanese-${index}" class="japanese-text" value="${this.escapeHtml(example.japanese || '')}" placeholder="日语例句">
            </div>
            <div class="form-group">
                <label>中文翻译:</label>
                <input type="text" name="example-chinese-${index}" value="${this.escapeHtml(example.chinese || '')}" placeholder="中文翻译">
            </div>
            <div class="form-group">
                <label>类型:</label>
                <select name="example-type-${index}">
                    <option value="sentence" ${example.type === 'sentence' ? 'selected' : ''}>句子</option>
                    <option value="dialogue" ${example.type === 'dialogue' ? 'selected' : ''}>对话</option>
                    <option value="question-answers" ${example.type === 'question-answers' ? 'selected' : ''}>问答</option>
                </select>
            </div>
        `;
        container.appendChild(div);
    }

    /**
     * 删除例句
     */
    removeExample(index) {
        const container = document.getElementById('examples-container');
        if (!container) return;
        
        const examples = Array.from(container.children);
        if (examples[index]) {
            examples[index].remove();
            // 重新编号
            this.reindexExamples();
        }
    }

    /**
     * 重新编号例句
     */
    reindexExamples() {
        const container = document.getElementById('examples-container');
        if (!container) return;
        
        Array.from(container.children).forEach((item, newIndex) => {
            const header = item.querySelector('.example-header strong');
            if (header) {
                header.textContent = `例句 ${newIndex + 1}`;
            }
            
            const deleteBtn = item.querySelector('.btn-danger');
            if (deleteBtn) {
                deleteBtn.setAttribute('onclick', `adminUI.removeExample(${newIndex})`);
            }
            
            const inputs = item.querySelectorAll('input, select');
            inputs.forEach(input => {
                const name = input.name;
                if (name) {
                    const baseName = name.replace(/-\d+$/, '');
                    input.name = `${baseName}-${newIndex}`;
                }
            });
        });
    }

    /**
     * 处理表单提交
     */
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const messageDiv = document.getElementById('modal-message');
        const saveBtn = document.getElementById('save-btn');
        
        if (messageDiv) messageDiv.innerHTML = '';
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.textContent = '保存中...';
        }
        
        try {
            const formData = new FormData(e.target);
            const examples = this.collectExamples();
            
            const data = {
                lesson: formData.get('lesson'),
                expression: formData.get('expression'),
                shortexplain: formData.get('shortexplain'),
                explanation: formData.get('explanation'),
                examples: examples
            };
            
            if (this.editingItem) {
                data.idx = this.editingItem.idx;
            }
            
            const action = this.editingItem ? 'update' : 'add';
            
            const result = this.currentTab === 'grammar' ? 
                await this.api.updateGrammar(action, data, this.currentSha) :
                await this.api.updateExpressions(action, data, this.currentSha);
            
            if (messageDiv) {
                messageDiv.innerHTML = `<div class="success">${result.message}</div>`;
            }
            
            // 刷新列表
            setTimeout(() => {
                this.closeModal();
                this.loadData(this.currentTab);
            }, 1500);
            
        } catch (error) {
            if (messageDiv) {
                messageDiv.innerHTML = `<div class="error">保存失败: ${error.message}</div>`;
            }
        } finally {
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = '保存';
            }
        }
    }

    /**
     * 收集例句数据
     */
    collectExamples() {
        const container = document.getElementById('examples-container');
        if (!container) return [];
        
        const examples = [];
        Array.from(container.children).forEach((item, index) => {
            const japanese = item.querySelector(`input[name="example-japanese-${index}"]`)?.value || '';
            const chinese = item.querySelector(`input[name="example-chinese-${index}"]`)?.value || '';
            const type = item.querySelector(`select[name="example-type-${index}"]`)?.value || 'sentence';
            
            if (japanese || chinese) {
                examples.push({ japanese, chinese, type });
            }
        });
        
        return examples;
    }

    /**
     * 删除项目
     */
    async deleteItem(type, idx, expression) {
        if (!confirm(`确定要删除"${expression}"吗？`)) {
            return;
        }
        
        try {
            const result = type === 'grammar' ?
                await this.api.updateGrammar('delete', { idx }, this.currentSha) :
                await this.api.updateExpressions('delete', { idx }, this.currentSha);
            
            alert(result.message);
            this.loadData(type);
            
        } catch (error) {
            alert(`删除失败: ${error.message}`);
        }
    }

    /**
     * HTML转义
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text ? text.replace(/[&<>"']/g, m => map[m]) : '';
    }
}

// 全局实例
let adminUI;
