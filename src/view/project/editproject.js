import React, { Component } from 'react';
import { Row, Col } from 'antd';
import {  message,Table, Divider, Tag ,Button,Modal,Form, Icon, Input,  Checkbox} from 'antd';
import { DatePicker } from 'antd';
import E from 'wangeditor';  
import axios from 'axios';
import moment from 'moment';
import { Upload} from 'antd';
const { TextArea } = Input;
let id = 0;


class EditProject extends Component {
  constructor(props) {
      super(props);
      this.state = {
          editorContent:'',
          comps: [
            {
              problem:'',
              solution: ''
            }
          ],
          endtime: '',
          mywork:' ',
          pid: 0,
          projectname: '',
          starttime: '',
          synopsis: '',
          technology: '',
          url: '',
          arr:[],
          visible:false,
          problem:'',
          solution:'',
          did:0,
          urlNum:0,
          photoArr:[],
          photoUrl:'',
          loading: false,
      };
  }
  componentDidMount() {
    console.log(this.props.match.params.pid)
    this.getData(this.props.match.params.pid)
      const elemMenu = this.refs.editorElemMenu;
      this.elemBody = this.refs.editorElemBody;
       this.editor = new E(elemMenu,this.elemBody)
      // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
      this.editor.customConfig.onchange = html => {
          console.log(this.editor.txt.html())
          this.setState({
              // editorContent: editor.txt.text()
              editorContent: this.editor.txt.html(),
              
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
// 图片上传
  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  // 图片上传
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
  // 图片上传
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
  // 修改项目保存提交按钮
  handleSubmit = e => {
    e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const { keys, names } = values;
          console.log('Received values of form: ', values);
          console.log('Merged values:', keys.map(key => names[key]));
          const body={
            "pid":this.state.pid,
            "synopsis": values.detail?values.detail:this.state.synopsis,
            "endtime": values.endtime?values.endtime.format('YYYY-MM-DD HH:mm:ss'):this.state.endtime.format('YYYY-MM-DD HH:mm:ss'),
            "starttime": values.starttime?values.starttime.format('YYYY-MM-DD HH:mm:ss'):this.state.starttime.format('YYYY-MM-DD HH:mm:ss'),
            "projectname":values.projectname?values.projectname:this.state.projectname,
            "url":values.linkurl?values.linkurl:this.state.url,
            "technology":values.points?values.points:this.state.technology,
            "mywork":this.state.editorContent
          }
          console.log(body)
          axios.post('http://172.31.51.251:8050/Projectexperience/update',body)
          .then((res)=>{
                console.log(res)
                console.log('OK');
                const arr=keys.map(key => names[key])
                for(var i=0;i<arr.length;i++){
                  arr[i].pid=this.state.pid
                }
                console.log(arr)
                axios.post('http://172.31.51.251:8050/Difficulties/insertDifficulties',arr)//加入
                .then((res)=>{ 
                      console.log(res)
                      message.info('修改成功！');
                      // const w=window.open('about:blank');
                      // w.location.href='/project/projectlist'
                      axios.get("http://172.31.51.251:8050/Difficulties/getDifficulties?pid="+this.state.pid)    //edit by yu
                      .then((res)=>{
                        console.log(res)
                        this.setState({
                          arr:res.data
                        })
                      })
                })
                .catch((err)=>{
                      console.log(err)  
                      // this.handleClearContent()

                })
                this.props.form.resetFields();
              
          })
          .catch((err)=>{
                console.log(err)
          })

          
        }
      });
    };
    // 清空富文本编辑器内容    这个在这里的用处好像不大  好像不需要
    handleClearContent = ()=>{
      　　this.setState({
              editorContent:''
      　　})
    }
    // 删除难点
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
  // 添加难点
    add = () => {
      const { form } = this.props;
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(id++);
      form.setFieldsValue({
        keys: nextKeys,
      });
    };
    // 删除难点
    deleteDifficulty= index=>{
      axios.post("http://172.31.51.251:8050/Difficulties/deleteDifficulties?did="+this.state.arr[index].did)
      .then((res)=>{
        console.log(res)
          if(res.data==1){
          axios.get("http://172.31.51.251:8050/Difficulties/getDifficulties?pid="+this.state.arr[index].pid)
          .then((res)=>{
            console.log(res)
            this.setState({
              arr:res.data
            })
          })
        }
      })
    };
  // 获得项目的指定难点信息 edit by yu
    getDifficulty=index =>{
      let tmp =this.state.arr[index];
      this.setState({
        visible: true,
        problem: tmp.problem,
        solution: tmp.solution,
        did:tmp.did,
      });
    }
    // 删除项目图片
    deletePhoto=index=>{
        let tmp =this.state.photoArr[index];
        const body={
            "pid":this.state.pid,
            "url": tmp.url,
        }
        axios.post("http://172.31.51.251:8050/Projectpicture/deleteBybody",body)
        .then((res)=>{
            console.log(res)
            axios.get("http://172.31.51.251:8050/Projectpicture/getPicture?pid="+this.state.pid)
            .then((res)=>{
              console.log(res)
              this.setState({
                photoArr: res.data
              })
            })
            .catch((err)=>{
              console.log(err)
            })
        })
        .catch((err)=>{
          console.log(err)
        })
  };
  // 难点修改保存提交
    handleOk = e => {
      console.log(e);
      const body={
        "pid":this.state.pid,
        "problem": this.state.problem,
        "solution": this.state.solution,
        "did":  this.state.did,
      }
      console.log(11111111111111)
      console.log(body)
      axios.post('http://172.31.51.251:8050/Difficulties/update',body)
      .then((res)=>{
        console.log(res)
        axios.get("http://172.31.51.251:8050/Difficulties/getDifficulties?pid="+this.state.pid)
        .then((res)=>{
          console.log(res)
          this.setState({
            arr:res.data
          })
          this.setState({
            visible: false,
            problem: '',
            solution: '',
          });
        })
      })   
    };
  // 难点修改取消按钮
    handleCancel = e => {
      console.log(e);
      this.setState({
        visible: false,
        problem: '',
        solution: '',
      });
    };

// 上传图片,调用接口
    uploadimg=(e)=>{
      let formData = new FormData();
        formData.append("file",e);
      console.log(formData);     
      axios.post("http://172.31.51.251:8050/Projectpicture/uploadImg?pid="+this.state.pid,formData)
      .then((res)=>{
        console.log(res)
        this.setState({
          photoUrl:res.data,
          loading:false
        })
        axios.get("http://172.31.51.251:8050/Projectpicture/getPicture?pid="+this.state.pid)
            .then((res)=>{
                console.log(res)
                this.setState({
                  photoArr: res.data,
                    photoUrl:""
                });
            })
             .catch((err)=>{
                console.log(err)
             })        
      })
      .catch((err)=>{
        console.log(err)
      })
    }
// 获取对应项目的基本信息
   getData=(pid)=>{
     this.setState({
       pid:pid
     })
     console.log(pid)
      axios.get("http://172.31.51.251:8050/Projectexperience/experienceDetail?pid="+pid)
      .then((res)=>{
        console.log(res)
        this.setState({
            endtime:moment(res.data.endtime, 'YYYY-MM-DD HH:mm:ss'),
            editorContent:res.data.mywork,
            pid:res.data.pid,
            projectname: res.data.projectname,
            starttime:moment(res.data.starttime, 'YYYY-MM-DD HH:mm:ss'),
            synopsis: res.data.synopsis,
            technology: res.data.technology,
            url: res.data.url
        })
        this.editor.txt.html(res.data.mywork) 
      })
      .catch((err)=>{
        console.log(err)
      })
      axios.get("http://172.31.51.251:8050/Difficulties/getDifficulties?pid="+pid)
      .then((res)=>{
        console.log(res)
        this.setState({
          arr:res.data
        })
      })
      .catch((err)=>{
        console.log(err)
      })
      axios.get("http://172.31.51.251:8050/Projectpicture/getPicture?pid="+pid)
      .then((res)=>{
        console.log(res)
        this.setState({
          photoArr: res.data
        })
      })
      .catch((err)=>{
        console.log(err)
      })
   }
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
      /**
       * 图片
       */
     
      getFieldDecorator('keys1', { initialValue: [] });
      const keys1 = getFieldValue('keys1');
      const formPhotoItems = keys1.map((k1, index) => (
        <Form.Item
          required={false}
          key={k1}
        >
          {getFieldDecorator(`names[${k1}].url`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {
                required: true,
                whitespace: true,
                message: "请输入URL...",
              },
            ],
          })(<div style={{ width: '60%', marginRight: 8 }}>
            URL <TextArea placeholder="请输入URL..." autosize />
          </div>)}
          {keys1.length > 1 ? (
            <Button type="danger" onClick={() => this.photoRemove(k1)}>删除</Button>
          ) : null}
        </Form.Item>
      ));
      return (
      
        <div>
            <Modal
                title="难点修改"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
              >
              <h4>难点</h4>
              <Input  placeholder="请输入难点名称" value={this.state.problem} onChange={e => this.setState({problem:e.target.value})}/>  
              <h4>解决方法</h4>
              <Input  placeholder="请输入解决方法" value={this.state.solution} onChange={e => this.setState({solution:e.target.value})}/>
      
            </Modal>

        <div id="add">
          <br/>
          <Row>
            <Col span={2}><h2>修改项目</h2> </Col>
          </Row><br/>
          <Row>
            <Col span={4}><h2>项目基本信息</h2> </Col>
          </Row><br/>
          <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item label="项目名称：">
                    
                        <Input  placeholder="请输入项目名称" value={this.state.projectname} onChange={e => this.setState({projectname:e.target.value})}/>
                      
                    </Form.Item>
                    <Form.Item  label="链接地址：">
                      
                          <Input  placeholder="请输入链接地址" value={this.state.url} onChange={e => this.setState({url:e.target.value})}/>
                        
                        
                    </Form.Item>
                    <Form.Item  label="项目简介：">
                        
                            <Input  placeholder="请输入项目简介" value={this.state.synopsis} onChange={e => this.setState({synopsis:e.target.value})}/>
                          
                        
                    </Form.Item>
                    <Form.Item  label="所用技术：">
                        
                        <Input  placeholder="技术之间用','隔开" value={this.state.technology} onChange={e => this.setState({technology:e.target.value})}/>
                      
                  </Form.Item>
                  <Form.Item  label="我的工作：">
                            <p dangerouslySetInnerHTML={{__html:this.state.editorContent}}></p>
                            {/* <h3>若要修改，请在下面重新进行修改:</h3> */}
                            <div className="text-area" s  >
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
                                      borderTop:"none",
                                     
                                  }}
                                  ref="editorElemBody" className="editorElem-body">

                              </div>
                          </div>
                    </Form.Item>
                  <Form.Item  label="开始时间：">
                    
                          <DatePicker showTime  value={this.state.starttime} onChange={e => this.setState({starttime:e})}/>
                        
                    </Form.Item>
                    
                    <Form.Item  label="结束时间：" >
                    
                          <DatePicker className="tim" showTime  value={this.state.endtime} onChange={e => this.setState({endtime:e})}/>
            
                    </Form.Item>
                    
                   
                    <Row>
                      <Col span={2}><h2>项目难点</h2> </Col>
                      
                    </Row>
                    {this.state.arr.map((item,index) => (
                      <li key={item.did}>
                        <br/>
                        <p>问题{index+1}</p>
                        <p>问题描述：{item.problem}</p>
                        <p>解决办法：{item.solution}</p>
                        <Button type="danger" onClick={()=>this.deleteDifficulty(index)}>删除</Button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button primary  onClick={()=>this.getDifficulty(index)}>修改</Button><br/>
                      </li>
                    ))}<br/>
                    {formItems}
                    <Form.Item {...formItemLayoutWithOutLabel}>
                      <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                        <Icon type="plus" /> 添加难点
                      </Button>
                    </Form.Item>
          
                  {/* 图片 */}
                  <Row>
                      <Col span={4}><h2>项目图片信息</h2> </Col>
                  </Row>
                    {this.state.photoArr.map((item,index) => (
                      <div>
                        <li key={item.url} >
                        <p>图片{index+1}</p><br/>
                          <img src={item.url} className="img"/><br/><br/>
                          <Button type="danger" onClick={()=>this.deletePhoto(index)}>删除</Button>
                        
                        </li>
                        <br/>
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
                 
                  <br/>
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
                <br/><br/>
        </div>
      </div>
      );
    }
  }
  EditProject = Form.create({})(EditProject);
  export default EditProject;