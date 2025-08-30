---
layout: page
title: "Expressions格式规范"
description: "expressions.yml文件生成规范"
category: tools
---

<div class="container">
  <h1>expressions.yml 格式规范</h1>
  <p class="lead">用于AI生成expressions.yml文件的标准格式</p>
</div>

<div class="ai-prompt-section">
  <div class="prompt-header">
    <h3>AI Prompt</h3>
    <button id="copyPromptBtn" class="btn btn-success">
      <i class="fa fa-copy"></i> 复制Prompt
    </button>
  </div>
  
  <div class="prompt-content" id="promptContent">
# expressions.yml Examples格式规范

## 支持的类型

### 1. sentence（普通句子）
```yaml
examples:
- japanese: '太郎{たろう}さん，こんにちは。'
  chinese: '太郎，你好。'
  type: sentence
```

### 2. dialogue（对话）
```yaml
examples:
- type: dialogue
  conversation:
  - speaker: 甲
    japanese: 'あなたは小野{おの}さんですか。'
    chinese: '你是小野女士吗？'
  - speaker: 乙
    japanese: 'はい，小野{おの}です。'
    chinese: '是的，我是小野。'
```

### 3. question-answers（问答）
```yaml
examples:
- type: question-answers
  question:
    japanese: '森{もり}さんは学生{がくせい}ですか。'
    chinese: '森先生是学生吗？'
  answers:
  - type: 肯定回答
    japanese: 'はい，そうです。'
    chinese: '是的，是这样。'
  - type: 否定回答
    japanese: 'いいえ，ちがいます。'
    chinese: '不，不是的。'
```

## 格式要求

1. 只能使用：sentence、dialogue、question-answers
2. 所有字符串必须用单引号包围
3. 缩进使用2个空格
4. 列表项以 "- " 开头
5. 日语注音保持 {假名} 格式

## 禁止使用
- type: question
- type: answer
- type: statement
- type: example

严格按照以上规范生成examples部分。
  </div>
</div>

## 使用说明

点击上方复制按钮获取完整AI prompt，用于指导AI生成符合规范的expressions.yml文件。

<script>
document.getElementById('copyPromptBtn').addEventListener('click', function() {
  const promptContent = document.getElementById('promptContent').textContent;
  
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(promptContent).then(function() {
      showCopySuccess();
    }).catch(function(err) {
      fallbackCopyTextToClipboard(promptContent);
    });
  } else {
    fallbackCopyTextToClipboard(promptContent);
  }
});

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showCopySuccess();
  } catch (err) {
    showCopyError();
  }
  
  document.body.removeChild(textArea);
}

function showCopySuccess() {
  const btn = document.getElementById('copyPromptBtn');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fa fa-check"></i> 复制成功';
  btn.className = 'btn btn-success';
  
  setTimeout(function() {
    btn.innerHTML = originalText;
  }, 2000);
}

function showCopyError() {
  const btn = document.getElementById('copyPromptBtn');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fa fa-exclamation"></i> 复制失败';
  btn.className = 'btn btn-danger';
  
  setTimeout(function() {
    btn.innerHTML = originalText;
    btn.className = 'btn btn-success';
  }, 2000);
}
</script>

<style>
  .container h1 {
    color: #2c3e50;
    margin-bottom: 20px;
  }
  
  .lead {
    color: #7f8c8d;
    margin-bottom: 30px;
  }
  
  .ai-prompt-section {
    background: #f4f4f4;
    border: 2px solid #007bff;
    border-radius: 8px;
    margin: 20px 0;
    padding: 0;
    overflow: hidden;
  }
  
  .prompt-header {
    background: #007bff;
    color: white;
    padding: 9px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .prompt-header h3 {
    margin: 0;
    color: white;
  }
  
  .prompt-content {
    background: #2d3748;
    color: #e2e8f0;
    padding: 20px;
    font-family: 'Courier New', monospace;
    line-height: 1.6;
    max-height: 500px;
    overflow-y: auto;
    white-space: pre-wrap;
    font-size: 0.9em;
  }
  
  #copyPromptBtn {
    background: #fff;
    color: #007bff;
    border: 2px solid #fff;
    font-weight: bold;
    transition: all 0.3s ease;
  }
  
  #copyPromptBtn:hover {
    background: #e3f2fd;
  }
</style> 