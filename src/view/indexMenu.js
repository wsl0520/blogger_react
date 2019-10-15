import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import {Link,withRouter} from "react-router-dom"

const { SubMenu } = Menu;
class Nav extends Component {
    rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

    state = {
      openKeys: ['sub1'],
    };

    onOpenChange = openKeys => {
      const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.setState({ openKeys });
      } else {
        this.setState({
          openKeys: latestOpenKey ? [latestOpenKey] : [],
        });
      }
    };

    render() {
      return (
        <Menu
          mode="inline"
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange}
          style={{ width: 256}}
          id="indexmenu"
        >
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="mail" />
                <span>
                   个人笔记
                </span>
              </span>
            }
          >
            <Menu.Item key="1">
              <Link to="/index/note/notelist">笔记列表</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="appstore" />
                <span>项目实战</span>
              </span>
            }
          >
            <Menu.Item key="5"> 
               <Link to="/index/project/projectlist">项目列表</Link>
            </Menu.Item>
            <Menu.Item key="6"> 
               <Link to="/index/project/addproject">添加项目</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub4"
            title={
              <span>
                <Icon type="deployment-unit" />
                <span>校园经历</span>
              </span>
            }
          >
            <Menu.Item key="9">
              <Link to="/index/school/schoollist">校园经历</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub5"
            title={
              <span>
                <Icon type="user" />
                <span>我的信息</span>
              </span>
            }
          >
            <Menu.Item key="11">
                <Link to="/index/info/info">修改个人信息</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      );
    }
  }
  
  export default Nav;