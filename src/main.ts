import './styles/tokens.css';
import './styles/base.css';
import './styles/v2.css';
import { initTheme, mountThemeSwitcher } from './theme/switcher';
import { createRouter } from './router';
import { renderHome } from './pages/home';
import { renderVocabulary } from './pages/vocabulary';
import { renderGrammar } from './pages/grammar';
import { renderReading } from './pages/reading';
import { renderListening } from './pages/listening';
import { renderWriting } from './pages/writing';
import { renderMistakes } from './pages/mistakes';
import { renderReport } from './pages/report';
import { renderChat } from './v2/chat';

const app = document.getElementById('app');
if (!app) throw new Error('未找到 #app 挂载点');

// 三档主题：应用持久化主题（index.html 内联脚本已预置首帧，此处兜底），
// 再挂全局切换入口（body 级，路由重渲染页面不丢失）
initTheme();
mountThemeSwitcher();

createRouter(app, [
  { path: '/', render: renderHome },
  { path: '/vocabulary', render: renderVocabulary },
  { path: '/grammar', render: renderGrammar },
  { path: '/reading', render: renderReading },
  { path: '/listening', render: renderListening },
  { path: '/writing', render: renderWriting },
  { path: '/mistakes', render: renderMistakes },
  { path: '/report', render: renderReport },
  // v2 对话式学习入口（独立壳层与模块，不影响上方 v1 页面）
  { path: '/v2', render: renderChat },
]);
