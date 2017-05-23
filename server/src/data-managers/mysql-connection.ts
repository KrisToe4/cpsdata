import * as mysql from 'mysql';

/**
 * @class MySqlConnection
 */
export class MySqlConnection {

  private static connection: mysql.IConnection;

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
        this.connection = mysql.createConnection({
          host     : 'localhost',
          user     : 'c0cpsdata',
          password : 'obaMBBTs85y@',
          database : 'cpsdata'
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