import { DataTypes } from "sequelize";
import sequelize from "../db/sequelizeMySql";
import CONFIG from "../config";
import { v4 as uuidv4 } from 'uuid';
const room =  sequelize.define('room', {
  id: {
    primaryKey: true,
    type: DataTypes.STRING(500)
  },
  name: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  homeId: {
    type: DataTypes.STRING(500),
    field: 'home_id',
    allowNull: false,
    defaultValue: CONFIG["HOME_ID"]
  }
},{
  tableName: 'room',
  timestamps: false,
  hooks: {
    beforeCreate: async (room) =>{
      room.id = `${CONFIG["HOME_ID"]}-${uuidv4()}`
    }
  }
})
export default room;
