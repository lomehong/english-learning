import './styles/tokens.css';
import './styles/base.css';
import { createRouter } from './router';
import { renderHome } from './pages/home';
import { renderVocabulary } from './pages/vocabulary';
import { renderGrammar } from './pages/grammar';

const app = document.getElementById('app');
if (!app) throw new Error('未找到 #app 挂载点');

createRouter(app, [
  { path: '/', render: renderHome },
  { path: '/vocabulary', render: renderVocabulary },
  { path: '/grammar', render: renderGrammar },
]);
