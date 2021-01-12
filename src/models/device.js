import { DataTypes } from "sequelize";
import sequelize from "../db/sequelizeMySql";
import CONFIG from "../config";
import {v4 as uuidv4 } from "uuid";

const device =  sequelize.define('device', {
  id: {
    primaryKey: true,
    type: DataTypes.STRING(500)
  },
  name: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  roomId: {
    type: DataTypes.STRING(500),
    field: 'room_id',
    allowNull: false
  },
  deviceTypeId: {
    type: DataTypes.STRING(500),
    field: 'device_type_id',
    allowNull: false
  }
},{
  tableName: 'device',
  timestamps: false,
  hooks: {
    beforeCreate: async (device) =>{
      device.id = `${CONFIG["HOME_ID"]}-${uuidv4()}`
    }
  }
});
export default device;
