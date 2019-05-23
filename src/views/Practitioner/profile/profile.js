import React, { Component } from 'react'
import styles from './profile.css';
import LoadingScreen from 'react-loading-screen';
import Moment from 'react-moment';
import jwt_decode from 'jwt-decode';
import classnames from 'classnames';
import { TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter, Button , Table,Row, Col} from 'reactstrap';
export default class profile extends Component {
  _isMounted = false;
constructor(props){
  super(props);
  const token= localStorage.getItem('jwtToken');
  const decoded = jwt_decode(token);
  this.toggle = this.toggle.bind(this);
  this.state = {
    activeTab: '1',
    testObesite:false,
    id:decoded.patientId,
    items: '',
    isLoaded: false,
    sick:'[]',
    chronicDiseasess:[],
    waiting:false,
    doctors:[], 
    drugspharmacy:[],
    drugspractitioner:[],
    drugs:[],
    mri:[],
    labtest:[],
    prescription:[],
    alergies:[],
    chronicD:[],
      DrugsModel:false,
      editProfile: false,
      editProfileData:{
        height:'',
        weight:''
      }
 }
}
componentWillMount(){
  this._isMounted = false;
}
toggle(tab) {
  if (this.state.activeTab !== tab) {
    this.setState({
      activeTab: tab
    });
  }
}
componentDidMount(){
  this._isMounted = true;
  fetch('http://34.247.209.188:3000/api/Patient/'+this.state.id)
  .then(res => res.json())
  .then(json => {
  
    this.setState({
      isLoaded: true,
      items:json,
    }); });
    fetch('http://34.247.209.188:3000/api/Patient/'+this.state.id)
      .then(response => response.json())
      .then(data => {
        this.setState({
          drugspharmacy:data.pharmacyDrugs,
          drugspractitioner:data.practitionerDrugs,
          mri:data.mriResults,
          alergies:data.allergies,
          labtest:data.labTestResults,
          chronicD:data.chronicDiseases
        });
        
     
    //console.log(json);
  });
}




toggleEditProfileModal() {
  this.setState({
    editProfile: ! this.state.editProfile
  });

  console.log('hello')
}


  render() { 

 


    //nsole.log("helloooooo "+this.state.sick.Conseils)
    var {isLoaded , items }= this.state;
    if(!isLoaded){
      return <div>Loading .... </div>
    }
    else{
    return (
      <div style={styles}>
  
        <div className="content">
           <div  className="flex">
            <div className="col-sm-2 col-1">
                <h4 className="page-title">My Profile</h4>
           </div>
       

    
         </div>
  <div className="card-box profile-header">
    <div className="row">
      <div className="col-md-12">
        <div className="profile-view">
          <div className="profile-img-wrap">
            <div className="profile-img">
            
              <img className="avatar" src={this.state.items.photo}   /> 
            </div>
          </div>
          <div className="profile-basic">
            <div className="row">
              <div className="col-md-5">
                <div className="profile-info-left">
                  <h3 className="user-name m-t-0 mb-0">{this.state.items.firstName} {this.state.items.lastName}</h3>
                  
                  {/* <small className="text-muted">Gynecologist</small> */}
                  <div className="staff-id"><span className="titleInfo">CIN :</span> <span className="titleInfoText">{this.state.items.cin}</span></div>
                  <div className="staff-id"><span className="titleInfo">CNSS/CNAM : </span><span className="titleInfoText">00000000</span></div>
                  <div className="staff-id"><span className="titleInfo">Blood Type:</span> <span className="titleInfoText">{this.state.items.bloodType}</span></div>
                  <div className="staff-id"><span className="titleInfo">Height: </span><span className="titleInfoText">{this.state.items.height}M</span></div>
                  <div className="staff-id"><span className="titleInfo">Weight:</span><span className="titleInfoText"> {this.state.items.weight}KG</span></div>
   
                </div>
              </div>
              <div className="col-md-7">
                <ul className="personal-info">
                  <li>
                    <span className="title">Phone:</span>
                    <span className="text"><a >{this.state.items.phone}</a></span>
                  </li>
                  <li>
                    <span className="title">Emergency Phone:</span>
                    <span className="text"><a >{this.state.items.emergencyPhone}</a></span>
                  </li>
                  <li>
                    <span className="title">Email:</span>
                    <span className="text"><a >{this.state.items.email}</a></span>
                  </li>
                  <li>
                    <span className="title">Birthday:</span>
                    <span className="text"><Moment format="YYYY/MM/DD">
                {this.state.items.dateOfBirth}
            </Moment></span>
                  </li>
                  <li>
                    <span className="title">Address:</span>
                    <span className="text">{this.state.items.address.addressLine}</span>
                  </li>
                  <li>
                    <span className="title">Gender:</span>
                    <span className="text">{this.state.items.gender}</span>
                  </li>
                   
                   
                </ul>
              </div>
            </div>
          </div>
        </div>                        
      </div>
    </div>
  </div>
   
        {/* -----new tab -----  */}
        <div className="profile-tabs">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
              Drugs
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              MRI
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}
            >
              Lab Test
            </NavLink>

          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '4' })}
              onClick={() => { this.toggle('4'); }}
            >
              Chronic Diseases
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '5' })}
              onClick={() => { this.toggle('5'); }}
            >
              Allergies
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}  className="tab-content" >
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
              <div className="tab-pane">
              <table border="2">
     <thead>
     <tr>
       <td>name</td>
       <td>manufacturer</td>
       <td>price</td>
       <td>lotNumber</td>
       </tr>
       </thead>
       <tbody>
       { this.state.drugspractitioner.map(drug => (
    <tr>
        <td>  {drug.name}</td>
        <td>  {drug.manufacturer}</td>
        <td>  {drug.price}</td>
        <td>  {drug.lotNumber}</td>
    </tr>
        ))}
        </tbody>
     </table></div>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
          
        <table border="2">
     <thead>
     <tr>
       <td>establishment</td>
       <td>reference</td>
       <td>testDate</td>
    
       </tr>
       </thead>
       <tbody>
       { this.state.mri.map(m => (
    <tr>
        <td>  {m.establishment}</td>
        <td>  {m.reference}</td>
        <td>  {m.testDate}</td>
       
    </tr>
        ))}
        </tbody>
     </table>
              </Col>
            </Row>
          </TabPane>

          <TabPane tabId="3">
            <Row>
              <Col sm="12">
          
        <table border="2">
     <thead>
     <tr>
       <td>establishment</td>
       <td>testDate</td>
       <td>reference</td>
    
       </tr>
       </thead>
       <tbody>
       { this.state.labtest.map(m => (
    <tr>
        <td>  {m.establishment}</td>
        <td>  {m.testDate}</td>
        <td>  {m.reference}</td>
       
    </tr>
        ))}
        </tbody>
     </table>
              </Col>
            </Row>
          </TabPane>

          <TabPane tabId="4">
            <Row>
              <Col sm="12">
          
        <table border="2">
     <thead>
     <tr>
       <td>name</td>
       <td>date</td>
       <td>notes</td>
       
    
       </tr>
       </thead>
       <tbody>
       { this.state.chronicD.map(m => (
    <tr>
        <td>  {m.name}</td>
        <td>  {m.date}</td>
        <td>  {m.notes}</td>
   
       
    </tr>
        ))}
        </tbody>
     </table>
              </Col>
            </Row>
          </TabPane>


          <TabPane tabId="5">
            <Row>
              <Col sm="12">
          
        <table border="2">
     <thead>
     <tr>
       <td>name</td>
       <td>treatmentBrief</td>
       </tr>
       </thead>
       <tbody>
       { this.state.alergies.map(m => (
    <tr>
        <td>  {m.name}</td>
        <td>  {m.treatmentBrief}</td>
   
       
    </tr>
        ))}
        </tbody>
     </table>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
        </div>




</div>

      </div>
    )
  }}
}

