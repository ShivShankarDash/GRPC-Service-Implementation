import path from 'path';
import * as grpc from '@grpc/grpc-js';
import  { GrpcObject, ServiceClientConstructor } from "@grpc/grpc-js"
import * as protoLoader from '@grpc/proto-loader';
import { ProtoGrpcType } from './generated/a';

const packageDefinition = protoLoader.loadSync(path.join(__dirname, '../src/a.proto'));

const personProto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

// in-memory variable
const PERSONS = [
    {
        name: "xyz",
        age: 45
    },
    {
      name: "abc",
      age: 45
    },
];

//@ts-ignore
// analogous to req, res
function addPerson(call, callback) {
  console.log(call)
    let person = {
      name: call.request.name,
      age: call.request.age
    }
    PERSONS.push(person);
    console.log(PERSONS);
    callback(null, person)
}

// function getPersonByName(call, callback){
//     const person = PERSONS.find(call.request.name);
//     callback(null,person);
// }

// const app = express()
const server = new grpc.Server();

//Adding a service (Similar to app.get('/service'))
server.addService((personProto.AddressBookService).service, { 
    addPerson: addPerson,
});



server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
});