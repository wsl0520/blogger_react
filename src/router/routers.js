import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch,Redirect } from "react-router-dom"
import EditProject from '../view/project/editproject'
import Index from '../view/index/index'
import Login from '../view/login'
import NoteList from '../view/note/notelist'
import SchoolList from '../view/school/schoollist'
import AddProject from '../view/project/addproject'
import ProjectList from '../view/project/projectlist'
import Info from '../view/info/info'
import Welcome from '../view/welcome'
class Routers extends Component {
    render() {
      
      return (
          <Router>
                <Switch>
                    <Route exact path="/" component={Login}/>

                    {/* <Route  path="/" component={Login}></Route> */}
                    <Index      path="/index" component={Index}>
                    <Route  path="/index/note/notelist" component={NoteList}></Route>
                    <Route  path="/index/project/editproject" component={EditProject}></Route>
                    <Route  path="/index/school/schoollist" component={SchoolList}></Route>
                    <Route  path="/index/index/project/projectlist" component={ProjectList}></Route>
                    <Route  path="/index/project/editproject/:pid" component={EditProject}></Route>
                    <Route  path="/index/project/addproject" component={AddProject}></Route>
                    <Route  path="/index/info" component={Info}></Route>
                    <Route  path="/index/welcome" component={Welcome}></Route>
                    </Index>
                </Switch>
          </Router>
        
      );
    }
  }
  
  export default Routers;