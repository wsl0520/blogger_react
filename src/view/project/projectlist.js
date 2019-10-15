import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { Table, Divider, Tag ,Button,Modal,Form, Icon, Input,  Checkbox} from 'antd';
import { DatePicker } from 'antd';
import axios from 'axios';
import E from 'wangeditor'  
import moment from 'moment'
import { BrowserRouter as Router, Route,Link, Switch,Redirect } from "react-router-dom"


class ProjectList extends Component {
  // 项目实战列表的列名
  columns = [
    {
      title: '项目名称',
      dataIndex: 'projectname',
      key: 'projectname',
      render: text => <a>{text}</a>,
    },
    {
      title: '源码下载地址',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '开始时间',
      dataIndex: 'starttime',
      key: 'starttime',
    },
    {
      title: '结束时间',
      dataIndex: 'endtime',
      key: 'endtime',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Link to={"/index/project/editproject/"+record.pid}><Button type="primary" size="small" icon="edit" >修改</Button></Link>
          &nbsp;&nbsp;&nbsp;
          <Button type="danger" size="small" icon="delete" onClick={()=>this.deleteProject(record.pid)} >删除</Button>
        </span>
      ),
    },
  ];
  constructor(props) {
      super(props);
      this.state = {
        projectList:[],
        
      };
  }
  // 点击编辑跳转到编辑页面
editProject=(pid)=>{
  this.props.history.push({pathname:'/project/editproject',query:{pid:pid}})
  console.log(pid)
  
}
// 删除项目实战
deleteProject=(pid)=>{
  axios.post('http://172.31.51.251:8050/Projectexperience/delete?pid='+pid)
  .then((res)=>{
    console.log(res)
    this.getData()
  })
  .catch((err)=>{
    console.log(err)
  })
}

  componentDidMount(){
    this.getData()
  }
  // 获得项目实战列表信息
  getData=()=>{
    axios.get('http://172.31.51.251:8050/Projectexperience/experience')
    .then((res)=>{
      console.log(res)
      this.setState({
        projectList:res.data
      })
      console.log(this.state.projectList)
    })
    .catch((err)=>{
      console.log(err)
    })
  }
    render() {
      return (
        <div >            
          <br/>
          <Row>
            <Col span={2}><h2>项目列表</h2> </Col>
          </Row>
          <br/>
          <Table columns={this.columns} dataSource={this.state.projectList} />
        </div>
      );
    }
  }
  
  export default ProjectList;