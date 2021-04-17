const fs = require("fs");
const S = require('string');
const shell = require('shelljs');
const { exit } = require("process");

exports.first=function(orderer_no,orderer_name,org_names,peer_nos){
   fs.readFile("./lead/crypto-config.yaml",'utf8',(err,data)=>{
      var temp='';
      var temp1='';
      for(i=0; i<orderer_no ; i++){
          temp =temp + '- Hostname: ' + orderer_name[i] + '\n      '; 
         }

      for(i=0; i<org_names.length ; i++){

         temp1 = temp1 + '- Name: '+org_names[i]+'\n    Domain: '+org_names[i]+'.example.com\n    Template:\n      Count: 1\n    Users:\n      Count: '+peer_nos[i]+'\n  ';
      }

       fi = S(data).replaceAll("^",temp).s;
       fi = S(fi).replaceAll("ORG_SERVICE",temp1).s;
       fs.writeFileSync('./fabric-samples/second-network/crypto-config.yaml',fi,(err)=>{
          if (err) console.error(err);
       });
      
});
};



exports.second=function(orderer_no,orderer_name,orderer_type,org_names,peer_names,body){
   fs.readFile("./lead/configtx.yaml",'utf8',(err,data)=>{

      if(orderer_type=='etcdraft'){
         var orderer_types= 'EtcdRaft';
      }else{
         var orderer_types= 'kafka';
      }


      var temp1= orderer_types + ':\n        Consenters:\n            ';
      var temp2='';
      var add2 = '';
      var temp3 = '';
      var temp4 ='' ;
      for(i=0; i<orderer_no ; i++){
          temp1 =temp1  + '- Host: ' + orderer_name[i] + '.example.com\n              Port: 7050\n              ClientTLSCert: crypto-config/ordererOrganizations/example.com/orderers/'+ orderer_name[i] + '.example.com/tls/server.crt\n              ServerTLSCert: crypto-config/ordererOrganizations/example.com/orderers/'+ orderer_name[i] +'.example.com/tls/server.crt\n            ';
          temp2 =temp2 + '- Host: ' + orderer_name[i] + '.example.com\n                  Port: 7050\n                  ClientTLSCert: crypto-config/ordererOrganizations/example.com/orderers/'+ orderer_name[i] + '.example.com/tls/server.crt\n                  ServerTLSCert: crypto-config/ordererOrganizations/example.com/orderers/'+ orderer_name[i] +'.example.com/tls/server.crt\n                ';
          add2 = add2+ '-' + orderer_name[i]+'.example.com:7050\n                ';
         }
         
        var add1 = '-' + orderer_name[0]+'.example.com:7050\n                ';
       fi = S(data).replaceAll("^",temp1).s;
       fi =  S(fi).replaceAll("!",temp2).s;
       fi =  S(fi).replaceAll("$",add1).s;
       fi =  S(fi).replaceAll("%",add2).s;
       fi =  S(fi).replaceAll("ORDERER_TYPE",orderer_type).s;


       var port = 7051;
         
       for(i=0; i<org_names.length; i++){ 
         temp3 = temp3 + '- &'+org_names[i]+'\n         Name: '+org_names[i]+'MSP\n         ID: '+org_names[i]+'MSP\n         MSPDir: crypto-config/peerOrganizations/'+org_names[i]+'.example.com/msp\n         Policies:\n             Readers:\n                 Type: Signature\n                 Rule: "OR'+"('"+org_names[i]+"MSP.admin', '"+org_names[i]+"MSP.peer', '"+org_names[i]+"MSP.client')"+'"\n             Writers:\n                 Type: Signature\n                 Rule: "OR'+"('"+org_names[i]+"MSP.admin', '"+org_names[i]+"MSP.client')"+'"\n             Admins:\n                 Type: Signature\n                 Rule: "OR'+"('"+org_names[i]+"MSP.admin')"+'"\n         AnchorPeers:\n             - Host: '+peer_names[i][0]+'.'+org_names[i]+'.example.com\n               Port: '+port+'\n    ';
         temp4 = temp4 + '- *'+org_names[i]+'\n                    ';
         port = port + 1000;
      }
      fi =  S(fi).replaceAll("ORG_CONFIG",temp3).s;
      fi =  S(fi).replaceAll("GENESIS",temp4).s;
      //

         var temp='';
         //channel count
         var ChannelCount=parseInt(body.ChannelCount)
         //org count
         
         for(j=0;j<ChannelCount;j++){
         var OrgCount=parseInt(body.ChannelDetails[j].OrgCount)    
         var ChannelName=body.ChannelDetails[j].ChannelName;   
         temp =temp +ChannelName+':'+'\n        '+'Consortium: SampleConsortium'+'\n        '+'<<: *ChannelDefaults'+'\n        '+'Application:'+'\n            '+'<<: *ApplicationDefaults'+ '\n            '+'Capabilities:'+'\n                '+'<<: *ApplicationCapabilities'+'\n            '+'Organizations:';
         for(i=0; i<OrgCount ; i++){
             var OrgName=body.ChannelDetails[j].OrgDetails[i].OrgName
             temp=temp+'\n                '+'- *'+OrgName
         }   
         temp=temp+'\n    '
      }
         fi = S(fi).replaceAll("channel_setup",temp).s;

       fs.writeFileSync('./fabric-samples/second-network/configtx.yaml',fi,(err)=>{
          if (err) console.error(err);
       });
       
});
};



exports.third=function(orderer_no,orderer_name,org_names,peer_names,network_name){
   fs.readFile("./lead/docker-compose-etcdraft2.yaml",'utf8',(err,data)=>{
      var temp='';
      var temp1='';
      var temp2='';
      var temp3='';
      var temp4='';
      var temp5='';
      var temp6 ='';
      
      var port = 7050;
      var cport = 5984;
      
      for(i=0; i<orderer_no ; i++){
          temp =temp + orderer_name[i] + '.example.com:\n  ';
          temp1 = temp1 + orderer_name[i] + '.example.com:\n    container_name: '+ orderer_name[i] +'.example.com\n    image: hyperledger/fabric-orderer\n    environment:\n      - FABRIC_LOGGING_SPEC=INFO\n      - ORDERER_GENERAL_LISTENADDRESS=0.0.0.0\n      - ORDERER_GENERAL_GENESISMETHOD=file\n      - ORDERER_GENERAL_GENESISFILE=/var/hyperledger/orderer/orderer.genesis.block\n      - ORDERER_GENERAL_LOCALMSPID=OrdererMSP\n      - ORDERER_GENERAL_LOCALMSPDIR=/var/hyperledger/orderer/msp\n      - ORDERER_GENERAL_TLS_ENABLED=true\n      - ORDERER_GENERAL_TLS_PRIVATEKEY=/var/hyperledger/orderer/tls/server.key\n      - ORDERER_GENERAL_TLS_CERTIFICATE=/var/hyperledger/orderer/tls/server.crt\n      - ORDERER_GENERAL_TLS_ROOTCAS=[/var/hyperledger/orderer/tls/ca.crt]\n      - ORDERER_KAFKA_TOPIC_REPLICATIONFACTOR=1\n      - ORDERER_KAFKA_VERBOSE=true\n      - ORDERER_GENERAL_CLUSTER_CLIENTCERTIFICATE=/var/hyperledger/orderer/tls/server.crt\n      - ORDERER_GENERAL_CLUSTER_CLIENTPRIVATEKEY=/var/hyperledger/orderer/tls/server.key\n      - ORDERER_GENERAL_CLUSTER_ROOTCAS=[/var/hyperledger/orderer/tls/ca.crt]\n    working_dir: /opt/gopath/src/github.com/hyperledger/fabric/orderer\n    command: orderer\n    ports:\n      - '+port+':7050\n    volumes:\n        - ./channel-artifacts/genesis.block:/var/hyperledger/orderer/orderer.genesis.block\n        - ./crypto-config/ordererOrganizations/example.com/orderers/'+orderer_name[i]+'.example.com/msp:/var/hyperledger/orderer/msp\n        - ./crypto-config/ordererOrganizations/example.com/orderers/'+orderer_name[i]+'.example.com/tls/:/var/hyperledger/orderer/tls\n    networks:\n      - byfn\n  ';
          port = port + 1000;
          
          temp6 = temp6 +'      - '+orderer_name[i]+'.example.com\n';
         }
         
         var port = 7051;
         var caport = 7054;
         
      for(i=0; i<org_names.length ; i++){
         var name=network_name;
         console.log(name);
         for(j=0; j<peer_names[i].length ; j++){
          temp2 = temp2 + peer_names[i][j] +'.'+ org_names[i] +'.example.com:\n    container_name: '+ peer_names[i][j] +'.'+ org_names[i] +'.example.com\n    image: hyperledger/fabric-peer\n    environment:\n      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock\n      - CORE_VM_DOCKER_HOSTCONFIG_NETWORKMODE=secondnetwork_'+name+'\n      - FABRIC_LOGGING_SPEC=info\n      - CORE_PEER_TLS_ENABLED=true\n      - CORE_PEER_GOSSIP_USELEADERELECTION=true\n      - CORE_PEER_GOSSIP_ORGLEADER=false\n      - CORE_PEER_PROFILE_ENABLED=true\n      - CORE_PEER_TLS_CERT_FILE=/etc/hyperledger/fabric/tls/server.crt\n      - CORE_PEER_TLS_KEY_FILE=/etc/hyperledger/fabric/tls/server.key\n      - CORE_PEER_TLS_ROOTCERT_FILE=/etc/hyperledger/fabric/tls/ca.crt\n      - CORE_PEER_ID='+ peer_names[i][j] +'.'+ org_names[i] +'.example.com\n      - CORE_PEER_ADDRESS='+ peer_names[i][j] +'.'+ org_names[i] +'.example.com:'+port+'\n      - CORE_PEER_LISTENADDRESS=0.0.0.0:'+port+'\n      - CORE_PEER_CHAINCODEADDRESS='+ peer_names[i][j] +'.'+ org_names[i] +'.example.com:'+(port+1)+'\n      - CORE_PEER_CHAINCODELISTENADDRESS=0.0.0.0:'+(port+1)+'\n      - CORE_PEER_GOSSIP_EXTERNALENDPOINT='+ peer_names[i][j] +'.'+ org_names[i] +'.example.com:'+port+'\n      - CORE_CHAINCODE_LOGGING_LEVEL=info\n      - CORE_PEER_LOCALMSPID='+ org_names[i] +'MSP\n      - CORE_LEDGER_STATE_STATEDATABASE=CouchDB\n      - CORE_LEDGER_STATE_COUCHDBCONFIG_COUCHDBADDRESS=couchdb'+(i+1)+':5984\n      - CORE_LEDGER_STATE_COUCHDBCONFIG_USERNAME=\n      - CORE_LEDGER_STATE_COUCHDBCONFIG_PASSWORD=\n    working_dir: /opt/gopath/src/github.com/hyperledger/fabric\n    command: peer node start\n    # command: peer node start --peer-chaincodedev=true\n    ports:\n     - '+port+':'+port+'\n     - '+(port+2)+':'+(port+2)+'\n    volumes:\n        - /var/run/:/host/var/run/\n        - ./crypto-config/peerOrganizations/'+ org_names[i] +'.example.com/peers/'+ peer_names[i][j] +'.'+ org_names[i] +'.example.com/msp:/etc/hyperledger/fabric/msp\n        - ./crypto-config/peerOrganizations/'+ org_names[i] +'.example.com/peers/'+ peer_names[i][j] +'.'+ org_names[i] +'.example.com/tls:/etc/hyperledger/fabric/tls\n        - ./channel-artifacts:/etc/hyperledger/configtx\n    depends_on:\n      - couchdb'+ (i+1) +'\n    networks:\n      - byfn\n  ';
         port = port + 1000; 
         temp6 = temp6 +'      - '+peer_names[i][j] +'.'+ org_names[i]+'.example.com\n';
         }
         
         temp3 = temp3 + 'couchdb'+(i+1)+':\n    container_name: couchdb'+(i+1)+'\n    image: hyperledger/fabric-couchdb\n    environment:\n      - COUCHDB_USER=\n      - COUCHDB_PASSWORD=\n    ports:\n      - '+cport+':5984\n    networks:\n      - byfn\n  ';
         
        
          temp4 = temp4 + 'ca'+(i+1)+'.example.com:\n    image: hyperledger/fabric-ca\n    environment:\n      - FABRIC_CA_HOME=/etc/hyperledger/fabric-ca-server\n      - FABRIC_CA_SERVER_CA_NAME=ca'+(i+1)+'.example.com\n      - FABRIC_CA_SERVER_TLS_ENABLED=true\n      - FABRIC_CA_SERVER_CA_CERTFILE=/etc/hyperledger/fabric-ca-server-config/ca'+(i+1)+'.'+ org_names[i] +'.example.com-cert.pem\n      - FABRIC_CA_SERVER_CA_KEYFILE=/etc/hyperledger/fabric-ca-server-config/CA'+(i+1)+'_PRIVATE_KEY\n      - FABRIC_CA_SERVER_PORT='+caport+'\n    ports:\n      - "'+caport+':'+caport+'"\n    command: sh -c '+"'"+'fabric-ca-server start --ca.certfile /etc/hyperledger/fabric-ca-server-config/ca.org'+(i+1)+'.example.com-cert.pem --ca.keyfile /etc/hyperledger/fabric-ca-server-config/CA'+(i+1)+'_PRIVATE_KEY -b admin:adminpw -d'+"'"+'\n    volumes:\n      - ./crypto-config/peerOrganizations/'+ org_names[i] +'.example.com/ca/:/etc/hyperledger/fabric-ca-server-config\n    container_name: ca'+(i+1)+'.example.com\n    networks:\n      - byfn\n  ';
         
         
         cport = cport +1000;
         caport = caport +1000;
      }
      temp5='cli:\n    container_name: cli\n    image: hyperledger/fabric-tools\n    tty: true\n    stdin_open: true\n    environment:\n      - SYS_CHANNEL=$SYS_CHANNEL\n      - GOPATH=/opt/gopath\n      - CORE_VM_ENDPOINT=unix:///host/var/run/docker.sock\n      #- FABRIC_LOGGING_SPEC=DEBUG\n      - FABRIC_LOGGING_SPEC=INFO\n      - CORE_PEER_ID=cli\n      - CORE_PEER_ADDRESS='+peer_names[0][0]+'.'+org_names[0]+'.example.com:7051\n      - CORE_PEER_LOCALMSPID='+org_names[0]+'MSP\n      - CORE_PEER_TLS_ENABLED=true\n      - CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/'+org_names[0]+'.example.com/peers/'+peer_names[0][0]+'.'+org_names[0]+'.example.com/tls/server.crt\n      - CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/'+org_names[0]+'.example.com/peers/'+peer_names[0][0]+'.'+org_names[0]+'.example.com/tls/server.key\n      - CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/'+org_names[0]+'.example.com/peers/'+peer_names[0][0]+'.'+org_names[0]+'.example.com/tls/ca.crt\n      - CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/'+org_names[0]+'.example.com/users/Admin@'+org_names[0]+'.example.com/msp\n    working_dir: /opt/gopath/src/github.com/hyperledger/fabric/peer\n    command: /bin/bash\n    volumes:\n        - /var/run/:/host/var/run/\n        - ./../chaincode/:/opt/gopath/src/github.com/chaincode\n        - ./crypto-config:/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/\n        - ./scripts:/opt/gopath/src/github.com/hyperledger/fabric/peer/scripts/\n        - ./channel-artifacts:/opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts\n    depends_on:\n'+temp6+'    networks:\n      - byfn';
      
      
       fi = S(data).replaceAll("ORDERER_VOLUME",temp).s;
       fi = S(fi).replaceAll("ORDERER_SERVICE",temp1).s;
       fi = S(fi).replaceAll("PEER_SERVICE",temp2).s;
       fi = S(fi).replaceAll("COUCHDB_SERVICE",temp3).s;
       fi = S(fi).replaceAll("CA_SERVICE",temp4).s;
       fi = S(fi).replaceAll("CLI_SERVICE",temp5).s;
       fs.writeFileSync('./fabric-samples/second-network/docker-compose-e2e-template.yaml',fi,(err)=>{
          if (err) console.error(err);
       });
       
});
};


exports.fourth=function(org_names){
   var temp2 = '';

   for(i=0; i<org_names.length ; i++){
      temp2  = temp2 + 'cd crypto-config/peerOrganizations/'+org_names[i]+'.example.com/ca/\n  PRIV_KEY=$(ls *_sk)\n  cd "$CURRENT_DIR"\n  sed $OPTS "s/CA'+(i+1)+'_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose.yaml\n  ';
   }
fs.readFile("./lead/generate.sh",'utf8',(err,data)=>{
    fi1 = S(data).replaceAll("REPLACE_FUNCTIONS",temp2).s;
    fs.writeFileSync('./fabric-samples/second-network/byfn.sh',fi1,(err)=>{
      if (err) console.error(err);
      console.log("Done");
   });
});

};
exports.fifth=function(body){
    console.log(body);
    //generate configtx pass in channelname and orgs
    //testing complete till here
    //run scripts  
    fs.readFile("./lead/channel_setup.sh",'utf8',(err,data)=>{
      //fi1 = S(data).replaceAll("REPLACE_FUNCTIONS",temp2).s;
      fs.writeFileSync('./fabric-samples/second-network/channel.sh',data,(err)=>{
        if (err) console.error(err);
        console.log("Done");
     })
     if (err) console.error(err);
     channel_setup(body,run_script);
});
   
}


function run_script(){

   shell.cd("./fabric-samples/second-network");
   shell.exec('./byfn.sh generate -o etcdraft',(error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        //console.log(`stdout: ${stdout}`);
    });
}
function channel_setup(body,run_script){
    //shell.cd("../../");
    var ChannelCount=parseInt(body.ChannelCount)
    for(i=0;i<ChannelCount;i++){
        var ChannelName=body.ChannelDetails[i].ChannelName
        
        var l_ChannelName=ChannelName.toLowerCase();
        var OrgCount=parseInt(body.ChannelDetails[i].OrgCount)
        fs.appendFile('./fabric-samples/second-network/channel.sh','\n'+"echo =======Submit channel transaction :"+" "+ChannelName+"======== echo", function (err) {
         if (err) throw err;
         console.log('Saved!');
       });
        fs.appendFile('./fabric-samples/second-network/channel.sh','\n'+'configtxgen -profile'+" "+ChannelName+' '+'-outputCreateChannelTx ./channel-artifacts/'+ChannelName+'.tx'+' '+'-channelID'+' '+l_ChannelName+'\n'+"if [ $? -ne 0 ]; then"+"\n"+"echo 'Failed to generate channel configuration transaction...'"+"\n"+"exit 1"+"\n"+"fi", function (err) {
         if (err) throw err;
         console.log('Saved!');
       });
        //create org array
        for(j=0;j<OrgCount;j++){ 
        fs.appendFile('./fabric-samples/second-network/channel.sh','\n'+"echo =================== Submit anchor transaction : org -"+" "+body.ChannelDetails[i].OrgDetails[j].OrgName+"================== echo", function (err) {
            if (err) throw err;
            console.log('Saved!');
          });     
        fs.appendFile('./fabric-samples/second-network/channel.sh','\n'+'configtxgen -profile'+" "+ChannelName+" "+'-outputAnchorPeersUpdate ./channel-artifacts/'+body.ChannelDetails[i].OrgDetails[j].OrgName+ChannelName+'MSPanchors.tx -channelID'+" "+l_ChannelName+" "+'-asOrg'+" "+body.ChannelDetails[i].OrgDetails[j].OrgName+'MSP'+'\n'+"if [ $? -ne 0 ]; then"+"\n"+"echo 'Failed to generate anchor peer transaction for org...'"+"\n"+"exit 1"+"\n"+"fi", function (err) {
        if (err) throw err;
      });
   
}
  
   fs.appendFile('./fabric-samples/second-network/channel.sh','\n'+"echo ===================Creating Channel"+" "+ChannelName+"================= echo", function (err) {
      if (err) throw err;
      console.log('Saved!');
    });     
    fs.appendFile('./fabric-samples/second-network/channel.sh','\n'+'docker exec -e \"CORE_PEER_ADDRESS='+body.ChannelDetails[i].OrgDetails[0].Peers[0]+"."+body.ChannelDetails[i].OrgDetails[0].OrgName+"."+"example.com"+":7051\""+" "+'-e \"CORE_PEER_LOCALMSPID='+body.ChannelDetails[i].OrgDetails[0].OrgName+"MSP\""+" "+'-e \"CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/'+body.ChannelDetails[i].OrgDetails[0].OrgName+".example.com/users/"+'Admin@'+body.ChannelDetails[i].OrgDetails[0].OrgName+'.example.com/msp\"'+" "+'-e \"CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/'+body.ChannelDetails[i].OrgDetails[0].OrgName+"."+"example.com"+"/peers/"+body.ChannelDetails[i].OrgDetails[0].Peers[0]+"."+body.ChannelDetails[i].OrgDetails[0].OrgName+"."+"example.com"+"/tls/ca.crt\""+" "+'cli peer channel create -o orderer.example.com:7050 -c'+" "+l_ChannelName+" "+'--outputBlock ./'+l_ChannelName+'.block --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/'+"example.com"+'/msp/tlscacerts/tlsca.'+"example.com"+'-cert.pem -f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/'+ChannelName+'.tx', function (err) {
      if (err) throw err;
      
    });
     
 
  
  //second flow
  for(k=0;k<OrgCount;k++){
      var PeerCount=body.ChannelDetails[i].OrgDetails[k].PeerCount;
      var OrgName=body.ChannelDetails[i].OrgDetails[k].OrgName;
      for(l=0;l<PeerCount;l++){
      fs.appendFile('./fabric-samples/second-network/channel.sh','\n'+"echo ===================Joining peer -"+" "+body.ChannelDetails[i].OrgDetails[k].Peers[l]+"================== echo", function (err) {
            if (err) throw err;
            console.log('Saved!');
          });     
        
      fs.appendFile('./fabric-samples/second-network/channel.sh','\n'+"docker exec -e \"CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/"+OrgName+".example.com"+"/users/Admin@"+OrgName+".example.com"+"/msp\""+" "+"-e \"CORE_PEER_ADDRESS="+body.ChannelDetails[i].OrgDetails[k].Peers[l]+"."+OrgName+"."+"example.com"+":7051\""+" "+"-e \"CORE_PEER_LOCALMSPID="+OrgName+"MSP\""+" "+"-e \"CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/"+OrgName+"."+"example.com"+"/peers/"+body.ChannelDetails[i].OrgDetails[k].Peers[l]+"."+OrgName+"."+"example.com"+"/tls/ca.crt\""+" "+"cli peer channel join -b ./"+l_ChannelName+".block", function (err) {
         if (err) throw err;
     });
  }
  fs.appendFile('./fabric-samples/second-network/channel.sh','\n'+"docker exec -e \"CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/"+OrgName+".example.com"+"/users/Admin@"+OrgName+".example.com"+"/msp\""+" "+"-e \"CORE_PEER_ADDRESS="+body.ChannelDetails[i].OrgDetails[k].Peers[0]+"."+OrgName+"."+"example.com"+":7051\""+" "+"-e \"CORE_PEER_LOCALMSPID="+OrgName+"MSP\""+" "+"-e \"CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/"+OrgName+"."+"example.com"+"/peers/"+body.ChannelDetails[i].OrgDetails[k].Peers[0]+"."+OrgName+"."+"example.com"+"/tls/ca.crt\""+" "+"cli peer channel update -o"+" "+"orderer"+"."+"example.com"+":7050"+" "+"-c"+" "+l_ChannelName+" "+"-f /opt/gopath/src/github.com/hyperledger/fabric/peer/channel-artifacts/"+OrgName+ChannelName+"MSPanchors.tx --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/"+"example.com"+"/orderers/"+"orderer"+"."+"example.com"+"/msp/tlscacerts/tlsca."+"example.com"+"-cert.pem",function(err){
  if (err) throw err;
  console.log('Saved!');
});   

}
} 
//chaincode setup

for(i=0;i<ChannelCount;i++){
    var ChannelName=body.ChannelDetails[i].ChannelName
    var l_ChannelName=ChannelName.toLowerCase();
    var OrgCount=parseInt(body.ChannelDetails[i].OrgCount)


//second flow
for(k=0;k<OrgCount;k++){
  var PeerCount=body.ChannelDetails[i].OrgDetails[k].PeerCount;
  var OrgName=body.ChannelDetails[i].OrgDetails[k].OrgName;
  for(l=0;l<PeerCount;l++){
  fs.appendFile('./fabric-samples/second-network/channel.sh','\n'+"echo ===================Installing chaincode on -"+" "+body.ChannelDetails[i].OrgDetails[k].Peers[l]+" "+"from"+" "+OrgName+"================== echo", function (err) {
        if (err) throw err;
        console.log('Saved!');
      });     
  if(body.ChannelDetails[i].Chaincode=="mycc") { 
  fs.appendFile('./fabric-samples/second-network/channel.sh','\n'+"docker exec -e \"CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/"+OrgName+".example.com"+"/users/Admin@"+OrgName+".example.com"+"/msp\""+" "+"-e \"CORE_PEER_ADDRESS="+body.ChannelDetails[i].OrgDetails[k].Peers[l]+"."+OrgName+"."+"example.com"+":7051\""+" "+"-e \"CORE_PEER_LOCALMSPID="+OrgName+"MSP\""+" "+"-e \"CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/"+OrgName+"."+"example.com"+"/peers/"+body.ChannelDetails[i].OrgDetails[k].Peers[l]+"."+OrgName+"."+"example.com"+"/tls/ca.crt\""+" "+"cli peer chaincode install -n"+" "+body.ChannelDetails[i].Chaincode+" "+"-v 1.0 -p github.com/chaincode/chaincode_example02/go/", function (err) {
     if (err) throw err;
 });
}
else if(body.ChannelDetails[i].Chaincode=="fabcar"){
   fs.appendFile('./fabric-samples/second-network/channel.sh','\n'+"docker exec -e \"CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/"+OrgName+".example.com"+"/users/Admin@"+OrgName+".example.com"+"/msp\""+" "+"-e \"CORE_PEER_ADDRESS="+body.ChannelDetails[i].OrgDetails[k].Peers[l]+"."+OrgName+"."+"example.com"+":7051\""+" "+"-e \"CORE_PEER_LOCALMSPID="+OrgName+"MSP\""+" "+"-e \"CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/"+OrgName+"."+"example.com"+"/peers/"+body.ChannelDetails[i].OrgDetails[k].Peers[l]+"."+OrgName+"."+"example.com"+"/tls/ca.crt\""+" "+"cli peer chaincode install -n"+" "+body.ChannelDetails[i].Chaincode+" "+"-v 1.1 -p github.com/chaincode/fabcar/go/", function (err) {
      if (err) throw err;
  });
}
else{
   throw new Error("INVALID CHAINCODE");
}
}
}
if(body.ChannelDetails[i].Chaincode=="mycc") {
fs.appendFile('./fabric-samples/second-network/channel.sh','\n'+"docker exec cli peer chaincode instantiate -o"+" "+"orderer"+"."+"example.com"+":7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/"+"example.com"+"/orderers/"+"orderer"+"."+"example.com"+"/msp/tlscacerts/tlsca.example.com-cert.pem -C"+" "+body.ChannelDetails[i].ChannelName+" "+"-n"+" "+body.ChannelDetails[i].Chaincode+" "+"-v 1.0 -c '{\"Args\":[\"init\",\"a\",\"100\",\"b\",\"200\"]}' -P \"AND ('Org1MSP.peer','Org3MSP.peer')\""+"\n"+"echo Chaincode Instantiated echo",function(err){
if (err) throw err;
console.log('Saved!');
});   
}
else if((body.ChannelDetails[i].OrgDetails[k].Chaincode=="fabcar")){
   fs.appendFile('./fabric-samples/second-network/channel.sh','\n'+"docker exec cli peer chaincode instantiate -o"+" "+"orderer"+"."+"example.com"+":7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/"+"example.com"+"/orderers/"+"orderer"+"."+"example.com"+"/msp/tlscacerts/tlsca.example.com-cert.pem -C"+" "+body.ChannelDetails[i].ChannelName+" "+"-n"+" "+body.ChannelDetails[i].OrgDetails[k].Chaincode+" "+"-v 1.1 -c '{\"Args\":[\"\"]}' -P \"OR ('Org1MSP.peer','Org2MSP.peer')\""+"\n"+"echo Chaincode Instantiated echo",function(err){
      if (err) throw err;
      console.log('Saved!');
      });  
}  
else{
  
      throw new Error("INVALID CHAINCODE");
   
}
}


/*

setTimeout(function() {
   console.log("first function executed");
   run_script();
 }, 3000);*/
}