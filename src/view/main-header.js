import React, { Component } from 'react';
import {Layout,Row,Col,Divider,Icon,Dropdown,Button} from 'antd'
const { Header} = Layout;
class MainHeader extends Component {
    render() {
      return (
        <div id="mainheader">
           <Layout>
            <Header ><h1 id="logo">博客的管理后台</h1></Header>
          </Layout>
        </div>
      );
    }
  }
  
  export default MainHeader;