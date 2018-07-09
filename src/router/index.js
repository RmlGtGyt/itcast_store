import Vue from 'vue';
import Router from 'vue-router';
// 导入组件
import Login from '@/views/Login';
import Home from '@/views/Home';
import Users from '@/views/users/Users';
import UsersAdd from '@/views/users/UsersAdd';

Vue.use(Router);

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {name: 'users',
          path: '/users',
          component: Users
        },
        {name: 'users',
          path: '/users/:uId/state/:type',
          component: Users
        },
        {
          name: 'usersAdd',
          path: '/users/add',
          component: UsersAdd
        }
      ]
    }
  ]
});
