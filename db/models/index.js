import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import { config } from '../../config/config.js'; 

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const modelsDirectory = path.join(__dirname);

const models = fs
  .readdirSync(modelsDirectory)
  .filter(file => (
    !file.startsWith('.') &&
    file !== basename &&
    file.endsWith('.js') &&
    !file.endsWith('.test.js')
  ))
  .reduce((acc, file) => {
    const modelPath = path.join(modelsDirectory, file);
    const model = import(modelPath).then(module => module.default(sequelize, Sequelize.DataTypes));
    acc[model.name] = model;
    return acc;
  }, {});

Promise.all(Object.values(models))
  .then(() => {
    Object.keys(models).forEach(modelName => {
      if (models[modelName].associate) {
        models[modelName].associate(models);
      }
    });
  });


db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
