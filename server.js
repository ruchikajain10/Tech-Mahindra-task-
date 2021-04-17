const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ts = require("./ts");
const shell = require('shelljs');
const { arrayify } = require('tslint/lib/utils');
const PORT = 3000;
fs=require('fs');

const app = express();
app.use(bodyParser.json());

app.use(cors());

app.get('/',function(req,res){
    res.send('Hello from server');
})
app.post('/enroll',function(req,res){
    var ChannelDetails=[];
    for(var i=0;i<req.body.numberOfChannels;i++){
        var oop = new Object;
        oop['ChannelName']=req.body.channelname[i];
        oop['OrgCount']=req.body.channelorg[i].length;
        oop['Chaincode']='mycc';
        oop['OrgDetails']=new Array;
        for(var j=0;j<req.body.channelorg[i].length;j++){
            var oop1=new Object;
            if (req.body.channelorg[i][j]){
            oop1['OrgName']=req.body.orgname[j];
            oop1['Peers']=findpeer(req.body.channelpeer[i][j],req.body.peernames[j]);
            oop1['PeerCount']=oop1['Peers'].length;
            oop['OrgDetails'][j]=oop1;
            }
            console.log(oop1);
        }
        ChannelDetails[i]=oop;
    }
    req.body.ChannelDetails=ChannelDetails;

    console.log(req.body.ChannelDetails);
    var ai = req.body.orderername;
    var orgname = req.body.orgname;
    var numberofpeers = req.body.numberofpeers;
    var peernames = req.body.peernames;
    var network_name=req.body.Network_Name;
    var name = req.body.name;
    ts.fifth(req.body);
    ts.first(ai.length,ai,orgname,numberofpeers);
    ts.second(ai.length,ai,name,orgname,peernames,req.body);
    ts.fourth(orgname);
    
    ts.third(ai.length,ai,orgname,peernames,network_name);
    
    console.log("network execution:");
    
    res.status(200).send({"message":"Data received"});
})
app.listen(PORT,function(){
    console.log("Server running on localhost" +PORT);
});


function findpeer(act_peer,org_peer){
    var fi_array=new Array;
    for (var z=0;z<org_peer.length;z++){
        if (act_peer[z]==true){
            fi_array.push(org_peer[z]);
        }
    }
    return fi_array;
}