import React, { Component } from 'react';
import {  Button,Form, Icon, Input,message} from 'antd';
import axios from 'axios';
class Login extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        axios.post('http://172.31.51.251:8050/Admin/adminLogin?username='+values.username+"&password="+values.password)
        .then((res)=>{
              console.log(res)
              if(res.data){
                const w=window.open('about:blank');
                w.location.href='/index'
              }else{
                message.info('账号或者密码错误，请重新登录！');
              }
        })
        .catch((err)=>{
              console.log(err)
        })
      }
    });
  };
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <div className="loginform">
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item>
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '请输入用户名!' }],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Username"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码!' }],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Password"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  登录
                </Button>
              </Form.Item>
            </Form>
        </div>
        
      )
    }
  }
 Login = Form.create({ name: 'normal_login' })(Login);
  export default Login;