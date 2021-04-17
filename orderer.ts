export class Orderer {
    constructor(

        public name : string,
        public count:number,
        public orderername:Array<any>,
        public numberOfOrgs:number,
        public orgname : Array<any>,
        public numberofpeers:Array<any>,
        public peernames:Array<any>,
        public peerports:Array<any>,
        public numberOfChannels:number,
        public channelname:Array<any>,
        public channelorg:Array<any>,
        public channelpeer:Array<any>

    ){
        //this.orderername = orderername
        const arr=this.orderername
        arr.join()
        const arr1 = this.orgname
        arr1.join()
        const arr2 = this.numberofpeers
        arr2.join()
        const arr3 = this.peernames
        arr3.join()
        const arr4 = this.peerports
        arr4.join()
        const arr5 = this.channelname
        arr5.join()
        const arr6 = this.channelorg
        arr6.join()
        const arr7 = this.channelpeer
        arr7.join()
        
    }
    
}