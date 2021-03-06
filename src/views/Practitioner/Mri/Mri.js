import React, { Component } from 'react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';
import FileBase64 from 'react-file-base64';
import swal from 'sweetalert';
import jwt_decode from 'jwt-decode';

class Mri extends Component {
  constructor(props) {
    super(props);
    const token= localStorage.getItem('jwtToken');
    const decoded = jwt_decode(token);
    this.toggle = this.toggle.bind(this);
    this.toggleFade = this.toggleFade.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.curr = new Date();
    this.date = this.curr.toISOString().substr(0,10);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      mri:"",
      date:this.date,
      data:null,
      select:"",
      practitionerName:decoded.firstName+" "+decoded.lastName,
      practitionerId:decoded.pratitionerId,
      patientName:null,
      patientId:decoded.patientId,
    };

  }
  componentWillMount() {
    fetch(`http://34.247.209.188:3000/api/PractitionerAddConsultation`)
    // We get the API response and receive data in JSON format...
    .then(response => response.json())
    // ...then we update the users state
    .then(data => {
      this.setState({data});
      console.log(this.state.data);
  })
    // Catch any errors we hit and update the app
    .catch(error => console.log(error));
    fetch('http://34.247.209.188:3000/api/Patient/'+this.state.patientId)
    .then(response => response.json())
    .then(data => {
      this.setState({
        patientName:data.firstName+" "+data.lastName
      })
    })
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  toggleFade() {
    this.setState((prevState) => { return { fadeIn: !prevState }});
  }
  getFiles(files){
    console.log(files.base64);
    this.setState({ mri: files.base64 })
  }
  handleChange(e){
    this.setState({
      [e.target.name]:e.target.value
    })
  }
  submit = (e) => {
    if(this.state.mri==="" || this.state.select==="" || this.state.date===""){
      swal("Error!", "Complete the form", "error");
    }
    else{
    swal({
      title: "Are you sure you want to add this MRI result ?",
      icon: "warning",
      buttons: true,
      dangerMode: true,

    }).then(willAdd => {
      if (willAdd) {
    let id = Math.floor(1000 + Math.random() * 9000);
    fetch('http://34.247.209.188:3000/api/PractitionerAddMri', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    "$class": "model.PractitionerAddMri",
    "mri": {
      "$class": "model.MriResults",
      "mriId": id+"",
      "establishment": "lab",
      "reference": this.state.mri,
      "testDate": this.state.date,
      "consultation": "resource:model.Consultation#"+this.state.select
    },
    "patient": "resource:model.Patient#"+this.state.patientId,
    "practitioner": "resource:model.Practitioner#"+this.state.practitionerId
  })
}).then(function(response) {
  if(response.status==200){
    swal("Added!", "MRI result added succefully to record", "success");
  }else{
    swal("Error!", "An error accured", "error");
  }
  console.log (response.text())
}, function(error) {
  console.log (error.message) //=> String
})
}
});
    }
  }
  formatDate(str){
return str.substr(0,10);
  }
  render() {
    if (this.state.data === null || this.state.patientName===null) {
      return("loading");
    } else {
    let{data}=this.state
    console.log(this.state)
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardHeader>
                <strong>Mri Results </strong>
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                  <FormGroup row>
                    <Col md="3">
                      <Label>Patient's name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="form-control-static">{this.state.patientName}</p>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label>Practitioner's name</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <p className="form-control-static">Dr {this.state.practitionerName}</p>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="date">Date of Consultataion</Label>
                    </Col>
                    <Col xs="12" md="9">

                      <Input type="date" id="date" name="date" placeholder="date" onChange={this.handleChange} defaultValue={this.date} />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="file-multiple-input">Select MRI Images</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <FileBase64 multiple={ false } onDone={ this.getFiles.bind(this) } />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="select">Consultation related to these results</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="select" name="select" id="select" onChange={this.handleChange}>
                      <option>select an option</option>
                      {
          data.map((val, idx)=> {
            return (
                        <option value={val.consultation.consultationId}>{this.formatDate(val.consultation.consultionDate)} reason : {val.consultation.reason}</option>
            )
                      })
                    }
                      </Input>
                    </Col>
                  </FormGroup>

                </Form>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary" onClick={this.submit}><i className="fa fa-dot-circle-o"></i> Submit</Button>
                <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
}

export default Mri;
