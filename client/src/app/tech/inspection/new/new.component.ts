import { Component, OnInit } from '@angular/core';

import { ActivatedRoute,
         Router } from '@angular/router';

import { FormBuilder,
         FormControl,
         FormGroup,
         ReactiveFormsModule } from '@angular/forms';

import { Inspection, 
         Client,
         Vehicle,
         Restraint } from '@server-src/data-classes/inspection-model';
import { InspectionService } from '@services/inspection.service';

import { MenuService } from '@services/menu.service'; 

@Component({
  selector: 'app-inspection-create',
  templateUrl: './new.component.html',
  styleUrls: [
    // The Order here is important for proper layering of the flex-flow attribute
    '../../tech.view.css',
    './new.component.css'
  ]
})
export class InspectionNewComponent implements OnInit {

  form: FormGroup;
  unsavedChanges: boolean = false;

  constructor( private route: ActivatedRoute,
               private formBuilder: FormBuilder,
               private inspectionService: InspectionService,
               private menuService: MenuService,
               private router: Router ) { }

  ngOnInit() {

    let component: InspectionNewComponent = this;

    this.buildForm();
  }

  private buildForm() {

    this.form = this.formBuilder.group({    
      client: this.formBuilder.group(new Client()),
      date: new Date().toISOString().substring(0, 10),
      location: "",
      vehicle: this.formBuilder.group(new Vehicle()),
      restraint: this.formBuilder.group(new Restraint())
    });

    this.form.valueChanges.subscribe(() => {
      this.unsavedChanges = true;
    });
  }

  private createInspection(route: string) {

    let component = this;

    if (this.unsavedChanges) {

      // We'll eventually want some validation but for now don't bother
      this.inspectionService.createInspection(this.form.value, function(error: string) {

        if (error) {

        }
        else {

          alert("Inspection Created");
          component.navigateAway(route);
        }
      });
    }
  }

  private navigateAway(route: string) {

    if (route != "") {

      this.router.navigate([route]);
    }
  }

  private scheduleBtnClicked() {

    this.createInspection("/tech/inspection");
  }

  private startBtnClicked() {

    this.createInspection("/tech/inspection/general");
  }
}
