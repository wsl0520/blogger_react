import React, { Component } from 'react';
import {Pagination} from 'antd'
import {Row,Col} from 'antd'
import IndexMenu from '../indexMenu'
import NoteList from '../../view/note/notelist'
import SchoolList from '../../view/school/schoollist'
import AddProject from '../../view/project/addproject'
import EditProject from '../../view/project/editproject'
import ProjectList from '../../view/project/projectlist'
import Info from '../../view/info/info'
import Welcome from '../../view/welcome'
import { BrowserRouter as Router, Route, Switch,Redirect } from "react-router-dom"

class Index extends Component {
    render() {
      return (
        <Row className="wrap">
          <Col md={4} xs={0} >
              <IndexMenu  mode="inline"/>            
          </Col>
          <Col md={0} xs={24}>
              <IndexMenu  mode="horizontal"/>            
          </Col>
          
          <Col md={18} xs={24} >
            <div id="content" >
                 <Route  path="/index/note/notelist" component={NoteList}></Route>
                 <Route  path="/index/school/schoollist" component={SchoolList}></Route>
                 <Route  path="/index/project/projectlist" component={ProjectList}></Route>
                 <Route  path="/index/project/editproject/:pid" component={EditProject}></Route>
                 <Route  path="/index/project/addproject" component={AddProject}></Route>
                 <Route  path="/index/info" component={Info}></Route>
                 <Route  path="/index/welcome" component={Welcome}></Route>
            </div>
          </Col>
        </Row>
       
      );
    }
  }
  
  export default Index;