import { Component,
         ElementRef,
         OnInit, 
         QueryList,
         ViewChildren } from '@angular/core';

import { ActivatedRoute,
         Router }            from '@angular/router';

import { FormBuilder, 
         FormGroup,
         Validators }  from '@angular/forms';

import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { SignatureFieldComponent } from "@parts/signature-field/signature-field.component";

import { InspectionService } from '@services/inspection.service';
import { MenuService }       from '@services/menu.service';

@Component({
  templateUrl: './waiver.component.html',
  styleUrls: ['./waiver.component.css']
})
export class InspectionWaiverComponent implements OnInit {

  @ViewChildren(SignatureFieldComponent) public sigs: QueryList<SignatureFieldComponent>;
  @ViewChildren('sigContainer') public sigContainer1: QueryList<ElementRef>;

  constructor( private route: ActivatedRoute,
               private inspectionService: InspectionService,
               private menuService: MenuService,
               private router: Router ) { }

  ngOnInit() {

    this.menuService.watchForTrigger("accept").subscribe(newRoute => {

      this.inspectionService.acceptWaiver("Test", "Signature");
      if (newRoute) {
        
        this.router.navigate([newRoute + '/general']);
      }

    });

    this.menuService.watchForTrigger("reject").subscribe(newRoute => {

      if (newRoute) {
        this.router.navigate([newRoute]);
      }
    });
  }

  ngAfterViewInit() {

    this.beResponsive();
    this.setOptions();
  }

  // set the dimensions of the signature pad canvas
  beResponsive() {

    console.log('Resizing signature pad canvas to suit container size')
    this.size(this.sigContainer1.first, this.sigs.first);
  }

  size(container: ElementRef, sig: SignatureFieldComponent){

    sig.signaturePad.set('canvasWidth', container.nativeElement.clientWidth);
    sig.signaturePad.set('canvasHeight', container.nativeElement.clientHeight);
  }

  setOptions() {

    this.sigs.first.signaturePad.set('penColor', 'rgb(0, 0, 0)');
    this.sigs.last.signaturePad.clear(); // clearing is needed to set the background colour
  }

  submit() {

    console.log('CAPTURED SIGS:');
    console.log(this.sigs.first.signature);
    console.log(this.sigs.last.signature);
  }

  clear() {

    this.sigs.first.clear();
    this.sigs.last.clear();
  }
}
