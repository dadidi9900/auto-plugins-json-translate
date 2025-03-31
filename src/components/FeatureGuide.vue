<template>
  <div class="feature-guide">


    <div class="plugin-integration">
      <h2>插件集成</h2>
      <div class="plugin-content">
        <p>本工具需要搭配 <a href="https://github.com/wenps/auto-i18n-translation-plugins/" target="_blank">auto-i18n-translation-plugins</a> 插件使用</p> 
        <p class="plugin-desc">支持 webpack/vite/rollup 等主流构建工具，一键实现国际化翻译</p>
        <p class="plugin-desc">正常in18n国际化方案 建议使用 <a href="https://github.com/ViggoZ/json-translate" target="_blank">json-translate</a> 插件</p>
      </div>
    </div>

    <h2>功能指南</h2>
    <div class="feature-list">
      <div class="feature-item">
        <h3>AI驱动</h3>
        <p>使用deepseek大语言模型，提供高质量的翻译服务</p>
      </div>
      <div class="feature-item">
        <h3>多语言支持</h3>
        <p>支持多种目标语言的翻译</p>
      </div>
      <div class="feature-item">
        <h3>翻译精准</h3>
        <p>大语言模型，联系上下文, 翻译更精准</p>
      </div>
      <div class="feature-item">
        <h3>实时翻译</h3>
        <p>流式输出,实时显示翻译进度</p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
// 组件逻辑可以在这里添加
</script>

<style scoped>
.feature-guide {
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin: 20px 0;
  width: calc(100vw - 200px);
  box-sizing: border-box;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.feature-guide h2 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.feature-item {
  background-color: white;
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-item h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.feature-item p {
  color: #666;
  line-height: 1.5;
}

.feature-item a {
  color: #409EFF;
  text-decoration: none;
  font-weight: 500;
}

.feature-item a:hover {
  text-decoration: underline;
}

.plugin-integration {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e4e7ed;
}

.plugin-integration h2 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.plugin-content {
  background-color: #ecf5ff;
  padding: 20px;
  border-radius: 6px;
  text-align: center;
}

.plugin-content p {
  color: #666;
  line-height: 1.5;
  margin: 10px 0;
}

.plugin-content a {
  color: #409EFF;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1em;
}

.plugin-content a:hover {
  text-decoration: underline;
}

.plugin-desc {
  color: #909399;
  font-size: 0.9em;
}

@media (max-width: 1024px) {
  .feature-guide {
    width: 100%;
    margin: 20px 0;
  }
}
</style> 