import React, { Component } from 'react';
import { message,Form, Icon, Input, Button, Checkbox ,Row, Col} from 'antd';
import axios from 'axios';
const { TextArea } = Input;
class Info extends Component {
  constructor(props) {
      super(props);
      this.state = {
        name: '',
        position: '',
        selfevaluation:'',
        nowstate:'',
        qq:'',
        email:'',
        wx:'',
        tel:''
      };
  }
  componentDidMount(){
    this.getData()
  }
  // 获得我的基本信息
  getData=()=>{
    axios.get('http://172.31.51.251:8050/Aboutme/me')
    .then((res)=>{
      console.log(res)
      this.setState({
        name: res.data.name,
        position: res.data.position,
        selfevaluation:res.data.selfevaluation,
        nowstate:res.data.state,
        qq:res.data.qq,
        email:res.data.email,
        wx:res.data.wx,
        tel:res.data.phone
      })
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  // 保存提交修改信息
  submitMyInfo=()=>{
    const body={
      name: this.state.name,
        position: this.state.position,
        selfevaluation:this.state.selfevaluation,
        qq:this.state.qq,
        email:this.state.email,
        wx:this.state.wx,
        phone:this.state.tel,
        state:this.state.nowstate

    }
    axios.post('http://172.31.51.251:8050/Aboutme/update',body)
    .then((res)=>{
      console.log(res)
      message.info('修改成功！');
      
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
              <Col span={2}><h2>我的信息</h2> </Col>
            </Row><br/>
              <Row>
                  <Col span={2} >
                    姓名：
                  </Col>
                  <Col span={5}>
                  <Input placeholder="请输入姓名" value={this.state.name} onChange={e => this.setState({name:e.target.value})}/>
                  </Col>
              </Row><br/>
              <Row>
                  <Col span={2} >
                    状态：
                  </Col>
                  <Col span={5}>
                  <Input placeholder="请输入状态" value={this.state.nowstate} onChange={e => this.setState({nowstate:e.target.value})}/>
                  </Col>
              </Row><br/>
              <Row>
                  <Col span={2} >
                    职位：
                  </Col>
                  <Col span={5}>
                  <Input placeholder="请输入职位" value={this.state.position} onChange={e => this.setState({position:e.target.value})}/>
                  </Col>
              </Row><br/>
              <Row>
                  <Col span={2} >
                    邮箱：
                  </Col>
                  <Col span={5}>
                  <Input placeholder="请输入邮箱" value={this.state.email} onChange={e => this.setState({email:e.target.value})}/>
                  </Col>
              </Row><br/>  
              <Row>
                  <Col span={2} >
                    QQ：
                  </Col>
                  <Col span={5}>
                  <Input placeholder="请输入QQ" value={this.state.qq} onChange={e => this.setState({qq:e.target.value})}/>
                  </Col>
              </Row><br/>
              <Row>
                  <Col span={2} >
                    微信：
                  </Col>
                  <Col span={5}>
                  <Input placeholder="请输入微信" value={this.state.wx} onChange={e => this.setState({wx:e.target.value})}/>
                  </Col>
              </Row><br/>
              <Row>
                  <Col span={2} >
                    联系电话：
                  </Col>
                  <Col span={5}>
                  <Input placeholder="请输入联系电话" value={this.state.tel} onChange={e => this.setState({tel:e.target.value})}/>
                  </Col>
              </Row><br/>
              <Row>
                  <Col span={2} >
                    自我评价：
                  </Col>
                  <Col span={5}>
                    <TextArea placeholder="请输入自我评价" autosize value={this.state.selfevaluation} onChange={e => this.setState({selfevaluation:e.target.value})}/>
                  </Col>
              </Row><br/>
              <Row>
                  <Col span={7} >
                    <Button type="primary" onClick={this.submitMyInfo}>确认修改</Button>
                  </Col>
              </Row>
        </div>
      );
    }
  }
  
  export default Info;