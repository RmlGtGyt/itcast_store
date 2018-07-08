<template>
  <div class="login-wrap">
    <el-form
      class="login-form"
      label-position="top"
      label-width="80px"
      :model="formData">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="formData.password"></el-input>
      </el-form-item>
      <el-button @click="handleLogin" class="login-button" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        formData: {
          username: '',
          password: ''
        }
      };
    },
    methods: {
      // 点击按钮，登录
      async handleLogin() {
        const res = await this.$http.post('login', this.formData);
        // 相当于在回调函数中书写代码
        const data = res.data;
        console.log(res);
        console.log(data);
        const { meta: { status, msg}} = data;
        if (status === 200) {
          // 提示登录成功
          this.$message.success(msg);
          // 记录token  sessionStorage
          const { data: { token }} = data;
          sessionStorage.setItem('token', token);
          // 跳转到Home.Vue页面中
          this.$router.push({name: 'home'});
        } else {
          // 提示登录失败
          this.$message.error(msg);
        };
      },
    }
  };
</script>

<style lang="">
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}
.login-button {
  width: 100%;
}
</style>
