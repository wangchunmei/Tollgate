import oracledb from 'oracledb';
import oracleService from '../../config/application';

class ConnectRenderObj {

  constructor() {
    this.connectionAttrs = {
      user: oracleService.RenderObjUserName,
      password: oracleService.RenderObjPassword,
      connectString: oracleService.connectRenderObjUrl
    };
    this.releaseConnections = this.releaseConnections.bind(this);
  }

  executeSql (sql, params){
    oracledb.autoCommit = true;
    return new Promise((resolve, reject) => {
      oracledb
        .getConnection(this.connectionAttrs)
        .then(connection => {
          return connection
            .execute(sql, params, {fetchInfo: {'GEOMETRY': {type: oracledb.STRING}}})
            .then(results => {
              resolve(results);
              this.releaseConnections(results.outBinds.UserDetailsCursor, connection);
            })
            .catch(err => {
              reject(err);
              this.releaseConnections(null, connection)
            })
        })
        .catch(err => {
          reject(err)
        })
    })}

    executeSql2 (sql){
      let _self = this;
      oracledb.autoCommit = true;
      return new Promise((resolve, reject) => {
        oracledb
          .getConnection(this.connectionAttrs)
          .then(connection => {
            return connection
              .execute(sql)
              .then(results => {
                resolve(results);
                this.releaseConnections(results.outBinds.UserDetailsCursor, connection);
              })
              .catch(err => {
                reject(err);
                this.releaseConnections(null, connection)
              })
          })
          .catch(err => {
            reject(err)
          })
      })}

  releaseConnections(resultSet, connection){
    process.nextTick(() => {
      if (resultSet) {
        resultSet
          .close()
          .then(() => {
            connection
              .release()
              .catch(err => {
                throw err
              })
          })
          .catch(err => {
            throw err
          })
      } else {
        connection
          .release()
          .catch(err => {
            throw err
          })
      }
    })
  }
}

export default new ConnectRenderObj();
