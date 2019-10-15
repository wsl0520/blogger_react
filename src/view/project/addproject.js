import React, { Component } from 'react';
import { Row, Col } from 'antd';
import {  message,Table, Divider, Tag ,Button,Modal,Form, Icon, Input,  Checkbox} from 'antd';
import { Upload} from 'antd';
import { DatePicker } from 'antd';
import E from 'wangeditor'  
import axios from 'axios';
const { TextArea } = Input;
let id = 0;



class AddProject extends Component {
  constructor(props) {
      super(props);
      this.state = {
          editorContent:'',
          pid:0,
          comps: [
            {
              problem:'',
              solution: ''
            }
          ],
          difficulties:[],
          loading: false,
          enableUploadImg:false,
          photoArr:[],
      };
  }
  componentDidMount() {
      const elemMenu = this.refs.editorElemMenu;
      this.elemBody = this.refs.editorElemBody;
      this.editor = new E(elemMenu,this.elemBody)
      // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
      this.editor.customConfig.onchange = html => {
          console.log( this.editor.txt.html())
          this.setState({
              // editorContent: editor.txt.text()
              editorContent:  this.editor.txt.html()
          })
      }
      this.editor.customConfig.menus = [
          'head',  // 标题
          'bold',  // 粗体
          'fontSize',  // 字号
          'fontName',  // 字体
          'italic',  // 斜体
          'underline',  // 下划线
          'strikeThrough',  // 删除线
          'foreColor',  // 文字颜色
          'backColor',  // 背景颜色
          'link',  // 插入链接
          'list',  // 列表
          'justify',  // 对齐方式
          'quote',  // 引用
          'emoticon',  // 表情
          'image',  // 插入图片
          'table',  // 表格
          'video',  // 插入视频
          'code',  // 插入代码
          'undo',  // 撤销
          'redo'  // 重复
      ]
      this.editor.customConfig.uploadImgShowBase64 = true
      this.editor.create()
  };
  // 上传图片
   getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  // 上传图片
   beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }
  // 上传图片
  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };
  // 上传图片,调用接口
  uploadimg=(e)=>{
    let formData = new FormData();
    formData.append("file",e);
    console.log(e);
    console.log(formData);
    axios.post("http://172.31.51.251:8050/Projectpicture/uploadImg?pid="+this.state.pid,formData)
    .then((res)=>{
      console.log(res)
      this.state.photoArr.push(res.data)
      this.setState({
          loading:false
      })
      console.log(this.state.photoArr)
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  // 增加完跳转到项目列表页
  tiaozhuan=()=>{
     const w=window.open('about:blank');
     w.location.href='/project/projectlist'
  }
  // 添加项目保存提交按钮
  handleSubmit = e => {
    e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const { keys, names } = values;
          console.log('Received values of form: ', values);
          console.log('Merged values:', keys.map(key => names[key]));
          const body={
            "synopsis": values.detail,
            "endtime": values.starttime.format('YYYY-MM-DD HH:mm:ss'),
            "starttime": values.endtime.format('YYYY-MM-DD HH:mm:ss'),
            "projectname":values.projectname,
            "url":values.linkurl,
            "technology":values.points,
            "mywork":this.state.editorContent
          }
          console.log(body)
          axios.post('http://172.31.51.251:8050/Projectexperience/insertExperience',body)
          .then((res)=>{
                this.setState({
                  pid:res.data
                })
                console.log(res)
                console.log('OK');
                // message.info('添加成功！');
                const arr=keys.map(key => names[key])
                for(var i=0;i<arr.length;i++){
                  arr[i].pid=this.state.pid
                }
                console.log(arr)
                axios.post('http://172.31.51.251:8050/Difficulties/insertDifficulties',arr)
                .then((res)=>{
                      console.log(res)
                      message.info('添加成功！');
                      this.handleClearContent();
                      this.setState({
                        enableUploadImg:true
                      })
                      // const w=window.open('about:blank');
                      // w.location.href='/project/projectlist'    
                })
                .catch((err)=>{
                      console.log(err)
                })
                this.props.form.resetFields();
                this.editor.txt.html('') ;
          })
          .catch((err)=>{
                console.log(err)
          })
        }
      });
      this.setState({
        editorContent:''
      })
    };
    // 清空富文本编辑器的内容
    　handleClearContent = ()=>{
      　this.setState({
              editorContent:''
      　})
      }
    // 删除项目难点
    remove = k => {
      const { form } = this.props;
      const keys = form.getFieldValue('keys');
      if (keys.length === 1) {
        return;
      }
  
      form.setFieldsValue({
        keys: keys.filter(key => key !== k),
      });
    };
  // 添加项目难点
    add = () => {
      const { form } = this.props;
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(id++);
      form.setFieldsValue({
        keys: nextKeys,
      });
    };
   
    render() {
      const { getFieldDecorator, getFieldValue } = this.props.form;
      const uploadButton = (
        <div>
          <Icon type={this.state.loading ? 'loading' : 'plus'} />
          <div className="ant-upload-text">Upload</div>
        </div>
      );
      const { imageUrl } = this.state;
      
      const formItemLayoutWithOutLabel = {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 24, offset: 0 },
        },
      };
      getFieldDecorator('keys', { initialValue: [] });
      const keys = getFieldValue('keys');
      const formItems = keys.map((k, index) => (
        <Form.Item
          required={false}
          key={k}
        >
          {getFieldDecorator(`names[${k}].problem`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "请输入难点描述...",
              },
            ],
          })(<div style={{ width: '60%', marginRight: 8 }}>
            难点描述： <TextArea placeholder="请输入难点描述..." autosize />
          </div>)}
          {getFieldDecorator(`names[${k}].solution`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "请输入解决办法...",
              },
            ],
          })(<div style={{ width: '60%', marginRight: 8 }}>
            解决办法： <TextArea placeholder="请输入解决办法..." autosize />
          </div>)}
          {keys.length > 1 ? (
            <Button type="danger" onClick={() => this.remove(k)}>删除</Button>
          ) : null}
        </Form.Item>
      ));
      return (
        <div id="add" >
          <br/>
          <Row>
            <Col span={2}><h2>添加项目</h2> </Col>
          </Row><br/>
          <Form onSubmit={this.handleSubmit} className={this.state.enableUploadImg?'hidden':'show'}>
                  <Form.Item label="项目名称：">
                      {getFieldDecorator('projectname', {
                        rules: [{ required: true, message: '请输入项目名称!' }],
                      })(
                        <Input placeholder="请输入项目名称"/>
                      )}
                  </Form.Item>
                  <Form.Item  label="源码地址：">
                      {getFieldDecorator('linkurl', {
                        rules: [{ required: true, message: '请输入源码下载地址!' }],
                      })(
                        <Input placeholder="请输入源码下载地址"/>
                      )}
                  </Form.Item>
                  <Form.Item  label="开始时间：">
                      {getFieldDecorator('starttime', {
                        rules: [{ required: true, message: '请输入开始时间!' }],
                      })(
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                      )}
                  </Form.Item>
                  <Form.Item  label="结束时间">
                      {getFieldDecorator('endtime', {
                        rules: [{ required: true, message: '请输入结束时间!' }],
                      })(
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                      )}
                  </Form.Item>
                  <Form.Item  label="用到的技术：">
                      {getFieldDecorator('points', {
                        rules: [{ required: true, message: '请输入用到的技术!' }],
                      })(
                        <TextArea placeholder="技术之间用','隔开" autosize />
                      )}
                  </Form.Item>
                  <Form.Item  label="功能简介：">
                      {getFieldDecorator('detail', {
                        rules: [{ required: true, message: '请输入功能简介!' }],
                      })(
                        <TextArea placeholder="请输入功能简介" autosize />
                      )}
                  </Form.Item>
                  <Form.Item  label="我的工作：">
                          <div className="text-area" >
                            <div ref="editorElemMenu"
                                style={{backgroundColor:'#f1f1f1',border:"1px solid #ccc"}}
                                className="editorElem-menu">
                            </div>
                            <div
                                style={{
                                    padding:"0 10px",
                                    overflowY:"scroll",
                                    height:300,
                                    border:"1px solid #ccc",
                                    borderTop:"none"
                                }}
                                ref="editorElemBody" className="editorElem-body">
                            </div>
                        </div>
                  </Form.Item>
                  <Row>
                    <Col span={2}><h2>项目难点</h2> </Col>                   
                  </Row><br/>
                  {formItems}
                  <Form.Item {...formItemLayoutWithOutLabel}>
                    <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                      <Icon type="plus" /> 添加难点
                    </Button>
                  </Form.Item>
                    <Form.Item>
                      <Row>
                        <Col span={12}>
                          <Button type="primary" htmlType="submit" > 确定</Button>
                        </Col>
                      </Row>
                  </Form.Item>        
                </Form>
                
                  <div className="clearfix" className={this.state.enableUploadImg?'show':'hidden'}>
                    <Row>
                        <Col span={4}><h2>项目图片信息</h2> </Col>
                    </Row>
                      {this.state.photoArr.map((item,index) => (
                        <div key={item.index} >                       
                            <p>图片{index+1}</p>
                            <img src={item} className="img"/><br/>                      
                        </div>
                      ))}
                    <br/> 
                    <Row>
                      <Col > <strong>图片上传</strong></Col>
                    </Row>
                    <br/>
                      <Upload
                          name="avatar"
                          listType="picture-card"
                          className="avatar-uploader"
                          showUploadList={false}
                          action={this.uploadimg}
                           beforeUpload={this.beforeUpload}
                          onChange={this.handleChange}
                          >
                         {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                      </Upload>
                      <Row>
                        <Col span={12}>
                          <Button type="primary" onClick={this.tiaozhuan} >  确定</Button>
                        </Col>
                      </Row>
                    </div>
                <br/><br/>
        </div>
      );
    }
  }
  AddProject = Form.create({})(AddProject);
  export default AddProject;