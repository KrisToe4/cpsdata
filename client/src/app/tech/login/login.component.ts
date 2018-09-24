import { Component, 
         OnInit }            from '@angular/core';
import { ActivatedRoute,
         Router }            from '@angular/router';
import { MatDialog, 
         MatDialogRef }      from '@angular/material';

import { LocalStorageModule } from 'angular-2-local-storage';

import { Tech } from '@server-src/data-classes/tech';
import { TechService } from '@services/tech.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor( public dialog: MatDialog,
               private techService: TechService,
               private route: ActivatedRoute,
               private router: Router ) { }

  ngOnInit() {

  }

  onLoginClick(email: string, password: string) {

    let route: ActivatedRoute = this.route;
    let router: Router = this.router;

    this.techService.authWithLocal(email, password, function (error: string, auth: string, redirectUrl: string) {
      if (error) {
        return;
      }

      localStorage.setItem("auth", auth);

      if (redirectUrl) {
        router.navigate([redirectUrl], { relativeTo: route });
      }
      else {
        router.navigate(['']);
      }
    });

    return;
  }

  resetPassword(email: string) {

    let component: LoginComponent = this;

    this.techService.lostPassword(email, function(error: string) {
      console.log("Lost password request sent");

      let dialogRef = component.dialog.open(LoginLostPasswordDialog, {
        width: '250px'
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    });
  }

  onRegisterClick(email: string) {

    let component: LoginComponent = this;

    this.techService.register(email, function(error: string) {
      if (error) {

        //Display the error somehow
      }
      else {
        console.log("Registration sent");

        let dialogRef = component.dialog.open(LoginRegisterDialog, {
          width: '250px'
        });
    
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      }
    })
  }
}

@Component({
  selector: 'app-login-register-dialog',
  templateUrl: 'login.register.dialog.html',
})
export class LoginRegisterDialog {

  constructor( public dialogRef: MatDialogRef<LoginRegisterDialog> ) { }

  onClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-login-lostpassword-dialog',
  templateUrl: 'login.lostpassword.dialog.html',
})
export class LoginLostPasswordDialog {

  constructor( public dialogRef: MatDialogRef<LoginLostPasswordDialog> ) { }

  onClick(): void {
    this.dialogRef.close();
  }

}