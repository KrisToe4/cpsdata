import * as mysql from 'mysql';

var config = require('config-json');

/**
 * @class MySqlConnection
 */
export class DatabaseManager {

  private static connection: mysql.IConnection;
  private static legacyConn: mysql.IConnection;

  /**
   * Create connection to our Database if not already connected
   *
   * @class MySqlConnection
   * @method getConnection
   * @static
   * @return {mysql.IConnection} Returns the mysql connection
   */
  public static getConnection(): mysql.IConnection {

    if (this.connection == null) {

        config.load('settings.json');
        let db = config.get('db');

        this.connection = mysql.createConnection(db);
        this.connection.connect();
    }

    return this.connection;
  }

 /**
   * Create connection to our Database if not already connected
   *
   * @class MySqlConnection
   * @method getArchiveConnection
   * @static
   * @return {mysql.IConnection} Returns the mysql connection
   */
  public static getArchiveConnection(): mysql.IConnection {
    if (this.connection == null) {
        this.connection = mysql.createConnection({
          host     : 'localhost',
          user     : 'cpsdata',
          password : 'tT#9HFc5+AufMfk@_$chCqf*9+f$ct!V',
          database : 'cpsdata2'
        });

        this.connection.connect();
    }
    return this.connection;
  }

  public static closeConnection(): void {
    if (this.connection != null) {
      this.connection.end();
    }
  }
}
