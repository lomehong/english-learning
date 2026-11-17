import './styles/tokens.css';
import './styles/base.css';
import { createRouter } from './router';
import { renderHome } from './pages/home';
import { renderVocabulary } from './pages/vocabulary';
import { renderGrammar } from './pages/grammar';
import { renderReading } from './pages/reading';
import { renderMistakes } from './pages/mistakes';
import { renderReport } from './pages/report';

const app = document.getElementById('app');
if (!app) throw new Error('未找到 #app 挂载点');

createRouter(app, [
  { path: '/', render: renderHome },
  { path: '/vocabulary', render: renderVocabulary },
  { path: '/grammar', render: renderGrammar },
  { path: '/reading', render: renderReading },
  { path: '/mistakes', render: renderMistakes },
  { path: '/report', render: renderReport },
]);
