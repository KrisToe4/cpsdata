import { Component, OnInit } from '@angular/core';

import { ActivatedRoute,
         Router, 
         Params } from '@angular/router';

import { LocalStorageModule } from 'angular-2-local-storage';

import { TechService } from '@services/tech.service';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  authToken: string;

  passwordValid: boolean = false;
  passwordMatch: boolean = false;

  constructor( private route: ActivatedRoute,
               private router: Router,
               private techService: TechService ) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {

      this.authToken = params['token'];
      if (this.authToken != "") {
        console.log(this.authToken);
      }
      else {
        // We'll navigate to an error route at some point
        this.router.navigate(['']);
      }
    });
  }

  isPasswordValid(password: string) {

    this.passwordValid = (password != "");
  }

  isPasswordMatch(password: string, confirmation: string) {

    this.passwordMatch = (password == confirmation);
  }

  onSubmitClick(password: string, confirmation: string) {

    if (this.passwordMatch) {
      let route: ActivatedRoute = this.route;
      let router: Router = this.router;

      this.techService.storePassword(this.authToken, password, "verify", function(error: string, auth: string, redirectUrl: string) {

        if (error) {
          alert("Error storing password. Message: " + error);
          return;
        }

        localStorage.setItem("auth", auth);
        router.navigate(['profile'], {relativeTo: route.parent});  
      });    
    }
  }

  onCancelClick() {

    console.log("Password update cancelled");
    this.router.navigate(['']);
  }

}
