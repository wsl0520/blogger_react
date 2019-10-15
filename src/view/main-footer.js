import React, { Component } from 'react';
import {Layout,} from 'antd'
class MainFoote extends Component {
    render() {
      return (
        <div id="mainfooter">
          <Layout.Footer style={{textAlign:"center"}}>
            京ICP备08102442号-1 2007-2018 MIAVO.COM 版权所有
          </Layout.Footer>
        </div>
      );
    }
  }
  
  export default MainFoote;