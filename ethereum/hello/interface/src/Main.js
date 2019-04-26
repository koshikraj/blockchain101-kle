import React, { Component } from 'react';
import crypto from 'crypto';
import Dropzone from 'react-dropzone';
import Web3 from 'web3';
import getWeb3 from "./utils/getWeb3";
import { Button, Modal, Badge, Card, InputGroup, FormControl} from 'react-bootstrap';
import { default as contract } from 'truffle-contract';
import contract_artifacts from './contracts/Hello.json';




String.prototype.hexEncode = function(){
    let hex, i;

    let result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += (hex).slice(-4);
    }

    return result
};

String.prototype.hexDecode = function(){
    let j;
    let hexes = this.match(/.{1,2}/g) || [];
    let back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
};


class Main extends Component {
    constructor(props) {
        super(props);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {isConnected: false,
                        show: false,
                    userName: null};


    }
    componentWillMount() {
        if(this.web3 && this.web3.isConnected()) {
            this.setState({isConnected: true});

        }
    }

    async componentDidMount(){
        await this.initWeb3Connection();
        this.hello = contract(contract_artifacts);
        this.hello.setProvider(this.web3.currentProvider);
        this.queryName();
    }

    async initWeb3Connection() {
        // const web3 = window.web3;
        // Get network provider and web3 instance.
        this.web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await this.web3.eth.getAccounts();
        this.user_address = accounts[0];
    }




    storeName(assetID)
    {

        try {
            let user_address = this.user_address;
            this.hello.deployed().then(function(contractInstance) {

                contractInstance.storeName(assetID, {gas: 1400000, from: user_address}).then(function(c) {
                    console.log(c.toLocaleString());
                });
            });
        }

        catch (err) {
            console.log(err);
        }

    }


    queryName()
    {


        try {
            let user_address = this.user_address;

            this.hello.deployed().then((contractInstance)=>{

                contractInstance.queryName( {from: user_address}).then((c)=>{
                    if (c) {
                        this.setState({userName: c.toLocaleString().slice(2).hexDecode()})
                    }
                });


            });
        } catch (err) {
            console.log(err);
        }
    }

    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
        // this.storeName("0x1222");
        this.queryName();
    }



    handleChange(event) {
    this.setState({userName: event.target.value});
}
    handleSubmit() {

        this.storeName("0x"+ this.state.userName.hexEncode());
        this.setState({ show: false });
    }


    render() {
        return (
            <div style={{display: "flex", alignItems: "center",
                justifyContent: "center", flexDirection: "column",
                "padding": 100}}>

                <Card className="text-center">
                    <Card.Header>Greeting! Simple Hello Word DApp</Card.Header>
                    <Card.Body>
                        <Card.Title><Badge variant="info">Hello!</Badge></Card.Title>
                        <Card.Text>
                            <h3>
                                {this.state.userName}
                            </h3>  </Card.Text>
                        <Button variant="primary" onClick={this.handleShow}>
                            {this.state.userName ? "Update name" : "Add name"}
                        </Button>
                    </Card.Body>
                    <Card.Footer className="text-muted">Amity online</Card.Footer>
                </Card>


                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Please provide your name</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-default">Name</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl onChange={this.handleChange}
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                                value={this.state.userName}
                            />
                        </InputGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
    );
    }
}
export default Main;
