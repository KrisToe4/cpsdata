import { createTransport,
         Transporter } from 'nodemailer'

var config = require('config-json');

/**
 * @class MailManager
 */
export class MailManager {

    private static smtp: Transporter;

  /**
   * Create mail client if not already created
   *
   * @class MailManager
   * @method getClient
   * @static
   * @return Transporter after creation
   */
  private static getClient(): Transporter {

    if (this.smtp == null) {

        config.load('settings.json');
        let mailServer = config.get('mail');

        this.smtp = createTransport(mailServer);

        this.smtp.verify(function (error: Error, success?: boolean) {

            if (error) {
                console.log(error);
            }

            if (!success) {

                console.log("Error creating smtp connection");
            }
            
        });
    }

    return this.smtp;
  }

  public static sendEmail(email: any) {

      let smtp = this.getClient();
      smtp.sendMail(email, (error, info) => {

          if (error) {

              console.log(error);
          }
          else {

              console.log("Email sent. Id: %s Msg: %s", info.messageId, info.response);
          }
      });
  }

  public static sendPasswordReset(emailAddress: string, token: string) {
      
    config.load('settings.json');
    let url: string = config.get("server") + '/tech/password/';

    let emailText: string = 'Lost password reset requested. Copy and paste  ' + url + token + '  into a web-browser to complete registration';
    let emailHtml: string = 'If you requested a password reset for CPS-DATA, please <a href="' + url + token + '">Click Here</a> to enter a new password.';

    let emailOptions = {
        from: 'no-reply@cps-data.com',
        to: emailAddress,
        subject: 'CPS-Data Tech lost password',
        text: emailText,
        html: emailHtml
    };

    let smtp = this.getClient();
    smtp.sendMail(emailOptions, (error, info) => {

        if (error) {

            console.log(error);
        }
        else {

            console.log("Email sent. Id: %s Msg: %s", info.messageId, info.response);
        }
    });
}

  public static sendVerification(emailAddress: string, token: string) {
      
      config.load('settings.json');
      let url: string = config.get("server") + '/tech/register/';

      let emailText: string = 'Registration requested. Copy and paste  ' + url + token + '  into a web-browser to complete registration';
      let emailHtml: string = 'Click here to complete registration. <a href="' + url + token + '">Click Here</a>.';

      let emailOptions = {
          from: 'no-reply@cps-data.com',
          to: emailAddress,
          subject: 'CPS-Data Tech registration request',
          text: emailText,
          html: emailHtml
      };

      let smtp = this.getClient();
      smtp.sendMail(emailOptions, (error, info) => {

          if (error) {

              console.log(error);
          }
          else {

              console.log("Email sent. Id: %s Msg: %s", info.messageId, info.response);
          }
      });
  }

  public static sendCertConfirmation(emailAddress: string, details: any) {
      
      config.load('settings.json');
      let url: string = config.get("server") + '/tech/register/';

      let emailText: string = 'A tech has added a new certification. ' + 
                              details.name + "(" + details.email + ") was certified by " + 
                              details.certOrg + " as a " + details.certType + " on " + details.certDate + '. ' +
                              'You can confirm this certification by going to LINK';
    
      let emailHtml: string = emailText;

      let emailOptions = {
          from: 'no-reply@cps-data.com',
          to: emailAddress,
          subject: 'CPS-Data Tech certification request',
          text: emailText,
          html: emailHtml
      };

      let smtp = this.getClient();
      smtp.sendMail(emailOptions, (error, info) => {

          if (error) {

              console.log(error);
          }
          else {

              console.log("Email sent. Id: %s Msg: %s", info.messageId, info.response);
          }
      });
  }
}