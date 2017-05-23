import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,
         Router }            from '@angular/router';

import { LocalStorageModule } from 'angular-2-local-storage';

import { Tech } from '@server-src/data-classes/tech';
import { TechService } from '@services/tech.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: [
    // The Order here is important for proper layering of the flex-flow attribute
    '../tech.view.css',
    './login.component.css'
  ]
})
export class LoginComponent implements OnInit {

  constructor( private techService: TechService,
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
        router.navigate(['profile']);
      }
    });

    return;
  }

  onRegisterClick(email: string) {

    let route: ActivatedRoute = this.route;
    let router: Router = this.router;

    this.techService.register(email, function(error: string, auth: string) {
      if (error) {

        //Display the error somehow
      }
      else {

        console.log(auth);
        router.navigate(['password', auth], {relativeTo: route.parent});
      }
    })
  }
}
