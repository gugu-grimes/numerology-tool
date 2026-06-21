import ChartInputView from '../views/chart/ChartInputView.vue';
import ChartResultView from '../views/chart/ChartResultView.vue';
import WuxingView from '../views/analysis/WuxingView.vue';
import ShishenView from '../views/analysis/ShishenView.vue';
import GejuXijiView from '../views/analysis/GejuXijiView.vue';
import HechongView from '../views/hechong/HechongView.vue';
import BingDiagnosisView from '../views/bing/BingDiagnosisView.vue';
import YongshenView from '../views/bing/YongshenView.vue';
import JiXiongView from '../views/bing/JiXiongView.vue';

export const routes = [
  { path: '/', name: 'home', component: { template: '<div><h1>八字论断系统</h1><p>请从左侧菜单选择功能开始排盘。</p></div>' } },
  { path: '/chart', name: 'chart-input', component: ChartInputView },
  { path: '/chart/result', name: 'chart-result', component: ChartResultView },
  { path: '/analysis/wuxing', name: 'wuxing-analysis', component: WuxingView },
  { path: '/analysis/shishen', name: 'shishen-labeling', component: ShishenView },
  { path: '/analysis/geju', name: 'geju-xiji', component: GejuXijiView },
  { path: '/hechong', name: 'hechong-analysis', component: HechongView },
  { path: '/bing', name: 'bing-diagnosis', component: BingDiagnosisView },
  { path: '/yongshen', name: 'yongshen-xiji', component: YongshenView },
  { path: '/jixiong', name: 'ji-xiong', component: JiXiongView },
];