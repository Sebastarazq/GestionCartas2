import mongoose from 'mongoose';

const DB_URI = 'mongodb://nexusbattles2:VzLbMyQeTlfA40zQtpPc8zdG2tZSgJk5Jop2oWFpcVXJsH076LGZvwTDgeWbPDJmSRv2Hfqu58AEACDb3REjzg==@nexusbattles2.mongo.cosmos.azure.com:10255/nexusBattlesII?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@nexusbattles2@';


const connect = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexion correcta a la DB');
  } catch (error) {
    console.error('DB: ERROR', error);
  }
};

export default connect;
