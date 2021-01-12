import { DataTypes } from "sequelize";
import sequelize from "../db/sequelizeMySql";
import CONFIG from "../config";
import {v4 as uuidv4} from "uuid";

const deviceType =  sequelize.define('deviceType', {
  id: {
    primaryKey: true,
    type: DataTypes.STRING(500)
  },
  name: {
    type: DataTypes.STRING(500),
    allowNull: true,
  }
},{
  tableName: 'device_type',
  timestamps: false,
  hooks: {
    beforeCreate: async (deviceType) =>{
      deviceType.id = `${CONFIG["HOME_ID"]}-${uuidv4()}`
    }
  }
})
export default deviceType;
