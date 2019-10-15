import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { Table, Divider, Tag ,Button,Modal,Form, Icon, Input,  Checkbox} from 'antd';
import { DatePicker } from 'antd';
import moment from 'moment'
import axios from 'axios';
const { TextArea } = Input;

class SchoolList extends Component {
  // 校园经历表格的列名
  columns = [
    {
      title: '学校名称',
      dataIndex: 'schoolname',
      key: 'schoolname',
      render: text => <a>{text}</a>,
    },
    {
      title: '专业名称',
      dataIndex: 'majorname',
      key: 'majorname',
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
      title: '详细',
      dataIndex: 'detail',
      key: 'detail',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button type="primary" size="small" icon="edit" onClick={()=>this.editSchool(record)}>修改</Button>&nbsp;&nbsp;&nbsp;
          <Button type="danger" size="small" icon="delete" onClick={()=>this.deleteSchool(record.eid)} >删除</Button>
        </span>
      ),
    },
  ];
  constructor(props) {
    super(props);
    this.state = {
      schoolList:[],
      visible: false ,
      visible2: false,
      detail: '',
      eid:'',
      endtime: '',
      majorname: '',
      schoolname: '',
      starttime:'',
    };
}

componentDidMount(){
  this.getData()
}
// 修改校园经历
editSchool(record){
  console.log(record)
  this.setState({
      detail:record.detail,
      eid:record.eid,
      endtime: moment(record.endtime, 'YYYY-MM-DD HH:mm:ss'),
      majorname: record.majorname,
      schoolname: record.schoolname,
      starttime:moment(record.starttime, 'YYYY-MM-DD HH:mm:ss'),
  })
  this.showModal2()
}
// 删除校园经历
deleteSchool(id){
  console.log(id)
  axios.post('http://172.31.51.251:8050/Schoolexperience/delete?eid='+id)
  .then((res)=>{
    console.log(res)
    this.getData()
  })
  .catch((err)=>{
    console.log(err)
  })
}
  
  // 获得校园经历列表
  getData=()=>{
    axios.get('http://172.31.51.251:8050/Schoolexperience/getAll')
    .then((res)=>{
      console.log(res)

      this.setState({
        schoolList:res.data
    
      })
      console.log(this.state.schoolList)
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  // 修改校园经历保存提交按钮
  handleSubmit2=()=>{
    const body={
      "eid":this.state.eid,
      "detail": this.state.detail,
     "starttime":this.state.starttime.format('YYYY-MM-DD HH:mm:ss'),
     "majorname": this.state.majorname,
     "schoolname":this.state.schoolname,
     "endtime": this.state.endtime.format('YYYY-MM-DD HH:mm:ss')
    }
    console.log(body)
      axios.post('http://172.31.51.251:8050/Schoolexperience/update',body)
      .then((res)=>{
            console.log(res)
            console.log('OK');
            this.getData();
            this.handleResetClick()
      })
      .catch((err)=>{
            console.log(err)
      })
  }
  // 重置表单内容
  handleResetClick = e => {
    this.props.form.resetFields();
  };
  // 添加校园经历保存提交按钮
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const body={
           "detail": values.detail,
          "endtime": values.starttime.format('YYYY-MM-DD HH:mm:ss'),
          "majorname": values.majorname,
          "schoolname":values.schoolname,
          "starttime": values.endtime.format('YYYY-MM-DD HH:mm:ss')
      }
      console.log(body)
        axios.post('http://172.31.51.251:8050/Schoolexperience/insertExperience',body)
        .then((res)=>{
              console.log(res)
              console.log('OK');
              this.setState({
                visible:false
              })
              this.getData();
              this.handleResetClick()
        })
        .catch((err)=>{
              console.log(err)
        })
      }
    });
  };
  // 点击添加,出现添加校园经历模态框
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  // 点击编辑,出现编辑校园经历模态框
  showModal2 = () => {
    this.setState({
      visible2: true,
    });
  };
// 添加校园经历的取消按钮
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  // 修改校园经历的取消按钮
  handleCancel2 = e => {
    console.log(e);
    this.setState({
      visible2: false,
    });
  };
  changetime=e=>{
    console.log(e)
  }
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <div >
          <br/>
          {/* 校园经历table */}
          <Row>
            <Col span={2}><h2>校园经历</h2> </Col>
            <Col span={8} offset={14}>
                <Button type="primary" icon="plus" onClick={this.showModal}>添加</Button>
            </Col>
          </Row>
          <br/>
          <Table columns={this.columns} dataSource={this.state.schoolList} />
         {/* 点击添加,出现添加校园经历模态框 */}
          <Modal
            title="添加经历"
            cancelText="取消"
            okText="确定"
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={
              [] // 设置footer为空，去掉 取消 确定默认按钮
            }
          >
            <Form onSubmit={this.handleSubmit} className="login-form">
                  <Form.Item label="学校名称：">
                    {getFieldDecorator('schoolname', {
                        rules: [{ required: true, message: '请输入学校名称!' }],
                      })(
                        <Input  placeholder="请输入学校名称" />
                      )}
                  </Form.Item>
                  <Form.Item  label="专业名称：">
                      {getFieldDecorator('majorname', {
                        rules: [{ required: true, message: '请输入专业名称!' }],
                      })(
                        <Input  placeholder="请输入专业名称" />
                      )}
                  </Form.Item>
                  <Form.Item  label="详细：">
                      {getFieldDecorator('detail', {
                        rules: [{ required: true, message: '请输入详细描述!' }],
                      })(
                        <TextArea placeholder="请输入详细描述" autosize />
                      )}
                  </Form.Item>
                  <Form.Item  label="开始时间：">
                      {getFieldDecorator('starttime', {
                        rules: [{ required: true, message: '请输入开始时间!' }],
                      })(
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                      )}
                  </Form.Item>
                  <Form.Item  label="结束时间：">
                      {getFieldDecorator('endtime', {
                        rules: [{ required: true, message: '请输入结束时间!' }],
                      })(
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                      )}
                  </Form.Item>
                  <Form.Item>
                    <Row>
                      <Col span={12}>
                        <Button type="primary" htmlType="submit" >  确定</Button>
                      </Col>
                      <Col span={12} >
                         <Button type="primary" onClick={this.handleCancel} >取消 </Button>
                      </Col>
                    </Row>
                </Form.Item>
                </Form>
          </Modal>
          {/* 点击修改,出现修改经历模态框 */}
          <Modal
            title="修改经历"
            cancelText="取消"
            okText="确定"
            visible={this.state.visible2}
            onCancel={this.handleCancel2}
            footer={
              [] // 设置footer为空，去掉 取消 确定默认按钮
            }
          >
            <Form onSubmit={this.handleSubmit2} className="login-form">
                  <Form.Item label="学校名称：">
                        <Input  placeholder="请输入学校名称" value={this.state.schoolname} onChange={e => this.setState({schoolname:e.target.value})}/>
                  </Form.Item>
                  <Form.Item  label="专业名称：">
                        <Input  placeholder="请输入专业名称" value={this.state.majorname} onChange={e => this.setState({majorname:e.target.value})}/>
                  </Form.Item>
                  <Form.Item  label="详细：">
                        <TextArea placeholder="请输入详细描述" autosize value={this.state.detail} onChange={e => this.setState({detail:e.target.value})} />                   
                  </Form.Item>
                  <Form.Item  label="开始时间：">                   
                        <DatePicker showTime  value={this.state.starttime} onChange={e => this.setState({starttime:e})}/>                       
                  </Form.Item>
                  <Form.Item  label="结束时间：">                 
                        <DatePicker showTime  value={this.state.endtime} onChange={e => this.setState({endtime:e})}/>          
                  </Form.Item>                  
                  <Form.Item>
                    <Row>
                      <Col span={12}>
                        <Button type="primary" htmlType="submit" >  确定</Button>
                      </Col>
                      <Col span={12} >
                         <Button type="primary" onClick={this.handleCancel2} >取消 </Button>
                      </Col>
                    </Row>                     
                </Form.Item>
                </Form>
          </Modal>
        </div>
      );
    }
            
  }
  SchoolList = Form.create({})(SchoolList);
  export default SchoolList;