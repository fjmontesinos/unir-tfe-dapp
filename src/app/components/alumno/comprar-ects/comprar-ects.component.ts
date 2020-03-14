import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comprar-ects',
  templateUrl: './comprar-ects.component.html',
  styles: []
})
export class ComprarECTSComponent implements OnInit {

  @ViewChild('comprarEctsModal', {static: false}) modal: TemplateRef<any>;

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  comprarTokens() {
    this.modalService.open(this.modal).result.then( (r) => {
      if (r === 'ok') {
        console.log('Vamos a comprar Tokens');
      }

    }, error => {
      console.log(error);
    });
  }

}
