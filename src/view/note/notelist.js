import React, { Component } from 'react';
import {Layout} from 'antd'
import { Row, Col } from 'antd';
import { message,Table, Divider, Tag ,Button,Modal,Form, Icon, Input,  Checkbox} from 'antd';
import axios from 'axios';

class NoteList extends Component {
// 笔记列表的列名
   columns = [
    {
      title: '笔记名称',
      dataIndex: 'title',
      key: 'title',
      render: text => <a>{text}</a>,
    },
    {
      title: '链接地址',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '创建时间',  
      dataIndex: 'creattime',
      key: 'creattime',
    },
    {
      title: '类别',
      key: 'points',
      dataIndex: 'points',
      render: tags => (
        <span>
          {tags.split(',').map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag}
              </Tag>
            );
          })
        }
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button type="primary" size="small" icon="edit" onClick={() => this.editNote(record)}>修改</Button>&nbsp;&nbsp;&nbsp;
          <Button type="danger" size="small" icon="delete" onClick={() => this.showDeleteConfirm(record.nid)} >删除</Button>
        </span>
      ),
    },
  ];
  constructor(props) {
    super(props);
    this.state = {
        notelist:[],
        visible2:false,
        visible3:false,
        notename:'',
        linkurl:'',
        points:'',
        nid:''
    };
}
// 点击编辑按钮，进行编辑
  editNote=(record)=>{
    console.log(record)
    var record=record
    this.setState({
      notename:record.title,
        linkurl:record.url,
        points:record.points,
        nid:record.nid
    })
    this.showModal2();
    console.log("1111...."+this.state.notename)
  }
// 点击删除，删除笔记
 showDeleteConfirm=(nid) =>{
  axios.post('http://172.31.51.251:8050/Notes/delete?nid='+nid)
  .then((res)=>{
    console.log(res)
    console.log('OK')
    this.getData()
    message.info('删除成功！');
  })
  .catch((err)=>{
    console.log(err)
    message.info('删除成功！');
  })  
}
// 编辑笔记模态框的确定按钮
handleSubmit2 = e => {
  e.preventDefault();
  this.setState({
    visible2: false
  });
   const body={
        "points":this.state.points,
        "title": this.state.notename,
        "url": this.state.linkurl,
         "nid": this.state.nid
    }
    console.log(body)
      axios.post('http://172.31.51.251:8050/Notes/update',body)
      .then((res)=>{
            console.log(res)
            console.log('OK');
            this.getData()
      })
      .catch((err)=>{
            console.log(err)
      })
};
// 添加笔记模态框的确定按钮
  handleSubmit = e => {
    e.preventDefault();
    
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const body={
          "points":values.points,
          "title": values.notename,
          "url": values.linkurl
        }
        console.log(body)
        axios.post('http://172.31.51.251:8050/Notes/insertNotes',body)
        .then(res=>{
          this.getData();
          console.log(res);
          this.setState({
            visible: false,
          });
          this.handleResetClick()
        })
        .catch(err=>{
          console.log(err)
        })
      }
    });
  };
  // 清空表单内容
  handleResetClick = e => {
    this.props.form.resetFields();
  };
  // 显示添加笔记模态框
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  // 显示编辑笔记模态框
  showModal2 = () => {
    this.setState({
      visible2: true,
    });
  };
  // 显示删除笔记模态框
  showModal3 = (nid) => {
    this.tmpNid = nid;
    this.setState({
      visible3: true,
    });
  };
// 添加笔记模态框的取消
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  // 编辑笔记模态框的取消
  handleCancel2 = e => {
    console.log(e);
    this.setState({
      visible2: false,
    });
  };
  // 删除笔记模态框的取消
  handleCancel3 = e => {
    console.log(e);
    this.setState({
      visible3: false,
    });
  };
// 获得所有笔记列表
  getData=()=>{
    axios.get('http://172.31.51.251:8050/Notes/allNotes?title=&page=1&limit=9999')
    .then(res=>{
      console.log(res)
      this.setState({
        notelist:res.data
      })
      
      console.log(this.state.notelist)
    })
    .catch(err=>{
      console.log(err)
    })
  }
  componentDidMount(){
    this.getData()
  }
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <div >
          {/* 点击删除出现的模态框 */}
        <Modal
          title="警告"
          visible={this.state.visible3}
          onOk={this.getDateAfterDelete}
          onCancel={this.handleCancel3}
          okText="确认"
          cancelText="取消"
        >

          <p>删除之后无法撤销</p>
          <p>确定要删除吗？</p>

        </Modal>
          <br/>
          {/* 笔记列表table */}
          <Row>
            <Col span={2}><h2>笔记列表</h2> </Col>
            <Col span={8} offset={14}>
                <Button type="primary" icon="plus" onClick={this.showModal}>添加</Button>
            </Col>
          </Row>
          <br/>
          <Table columns={this.columns} dataSource={this.state.notelist} />
          {/* 点击添加，出现添加笔记模态框 */}
          <Modal
            title="添加笔记"
            cancelText="取消"
            okText="确定"
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={
              [] // 设置footer为空，去掉 取消 确定默认按钮
            }  
          >
            <Form onSubmit={this.handleSubmit} className="login-form">
                  <Form.Item label="笔记名称：">
                  {getFieldDecorator('notename', {
                      rules: [{ required: true, message: '请输入笔记名称!' }],
                    })(
                      <Input  placeholder="请输入笔记名称" />
                    )}
                  </Form.Item>
                  <Form.Item  label="链接地址：">
                    {getFieldDecorator('linkurl', {
                        rules: [{ required: true, message: '请输入笔记链接地址!' }],
                      })(
                        <Input  placeholder="请输入链接地址"/>
                      )}
                  </Form.Item>
                  <Form.Item  label="所属分类：">
                      {getFieldDecorator('points', {
                          rules: [{ required: true, message: '请输入所属分类!' }],
                        })(
                          <Input  placeholder="技术之间用','隔开"/>
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
          {/* 点击编辑，出现编辑笔记模态框 */}
          <Modal
            title="修改笔记"
            cancelText="取消"
            okText="确定"
            visible={this.state.visible2}
            onOk={this.handleOk2}
            onCancel={this.handleCancel2}
            footer={
              [] // 设置footer为空，去掉 取消 确定默认按钮
            }
          >
            <Form onSubmit={this.handleSubmit2} className="login-form">
                  <Form.Item label="笔记名称：">                  
                      <Input  placeholder="请输入笔记名称" value={this.state.notename} onChange={e => this.setState({notename:e.target.value})}/>                  
                  </Form.Item>
                  <Form.Item  label="链接地址：">                    
                        <Input  placeholder="请输入链接地址" value={this.state.linkurl} onChange={e => this.setState({linkurl:e.target.value})}/>                     
                  </Form.Item>
                  <Form.Item  label="所属分类：">
                        <Input  placeholder="技术之间用','隔开" value={this.state.points} onChange={e => this.setState({points:e.target.value})}/>                     
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
  NoteList = Form.create({})(NoteList);
  export default NoteList;