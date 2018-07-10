import Vue from 'vue';
import Router from 'vue-router';
// 导入组件
import Login from '@/views/Login';
import Home from '@/views/Home';
import Users from '@/views/users/Users';
import UsersAdd from '@/views/users/UsersAdd';
import UsersEdit from '@/views/users/UsersEdit';
import Roles from '@/views/roles/Roles';
import Rights from '@/views/roles/Rights';

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
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'usersAdd',
          path: '/users/add',
          component: UsersAdd
        },
        {
          name: 'usersEdit',
          path: '/users/edit/:id',
          component: UsersEdit
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        }
      ]
    }
  ]
});
