import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import ArticlesList from '../views/article/ArticlesList.vue'
import ArticleTest from '../views/test/ArticleTest.vue'
import ArticleListTest from '../views/test/ArticleList.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ArticlesList,
    },
    {
      path: '/test/article',
      name: 'articleTest',
      component: () => import('../views/test/ArticleTest.vue'),
    },
    {
      path: '/test/article-list',
      name: 'articleListTest',
      component: () => import('../views/test/ArticleList.vue'),
    }
  ],
})

export default router
