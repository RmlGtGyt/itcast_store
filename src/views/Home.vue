<template>
  <el-container class="container">
    <!-- 头部样式 -->
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <img src="/static/images/logo.png" alt="">
        </el-col>
        <el-col :span="19" class="title">
          <h2>电商后台管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a class="logout" href="#" @click.prevent="handledLogout">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <!-- 侧边栏 -->
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu
          :router="true"
          :unique-opened="true"
          class="menu">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/users">
              <i class="el-icon-menu"></i>
              <span>用户列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/roles">
              <i class="el-icon-menu"></i>
              <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="/rights">
              <i class="el-icon-menu"></i>
              <span>权限列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-menu"></i>
              <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="3-1">
              <i class="el-icon-menu"></i>
              <span>商品参数</span>
            </el-menu-item>
            <el-menu-item index="3-1">
              <i class="el-icon-menu"></i>
              <span>商品分类</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-menu"></i>
              <span>订单列表</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="5-1">
              <i class="el-icon-menu"></i>
              <span>数据列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      </el-aside>
      <!-- 列表部分 -->
      <el-main class="main">
        <!-- 给匹配路由的组件占位 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    // 判断是否登录
    beforeCreate() {
      // 从sessionStorage中获取token，并判断是否有token
      const token = sessionStorage.getItem('token');
      if (!token) {
        // 如果没有token，返回登录页面
        this.$router.push({ name: 'login' });
        // 提示用户登录后再访问
        this.$message.warning('您尚未登陆，请登陆后访问');
      };
    },
    methods: {
      // 处理退出
      handledLogout() {
        // 删除sessionStorage中的token
        sessionStorage.clear();
        // 跳转到login页面
        this.$router.push({name: 'login'});
        this.$message.success('退出成功');
      }
    }
  };
</script>

<style lang="">
  .container {
    height: 100%
  }
  .header,
  .aside {
    background: #b3c0d1;
  }
  .header {
    padding: 0;
  }
  .header .title {
    color: #fff;
    text-align: center;
  }
  .header .title h2 {
    line-height: 60px;
  }
  .header .logout {
    color: orange;
    line-height: 60px;
  }
  .aside .menu {
    height: 100%;
  }
  .main {
    background-color: #e9eef3;
    height: 100%;
  }
</style>
