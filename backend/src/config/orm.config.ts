import { ConnectionOptions } from 'typeorm';
const ormConfig: ConnectionOptions = {
  type: 'mysql',
  host: 'localhost'  ,
  port: 3306,
  username: 'root',
  password: '',
  database: 'medevia_cms',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false,
  migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default ormConfig;
