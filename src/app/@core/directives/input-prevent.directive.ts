import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appInputPrevent]'
})
export class InputPreventDirective {
  

  constructor() {
   
    // regex
  }
  
  arabicRegex = /[^!@#$%^&/0-9\u0600-\u06ff\u0750-\u077f\ufb50-\ufbc1\ufbd3-\ufd3f\ufd50-\ufd8f\ufd50-\ufd8f\ufe70-\ufefc\uFDF0-\uFDFD]/g;
  englishRegex =/[^!@#$%^&/A-Za-z1-9]/g
  @Input('appInputPrevent') appInputPrevent: string = '';

  @HostListener('keypress', ['$event']) onKeyPress(event: KeyboardEvent) {

    if (this.appInputPrevent === 'English') {
      
      this.checkarabicOnly(event);
    } else if (this.appInputPrevent === 'Arabic') {
       this.englishOnly(event);
    }
  }

  @HostListener('paste', ['$event']) onPaste(event:any) {
   
    let regex=/[^!@#$%^&/A-Za-z1-9]/g;
    if (this.appInputPrevent === 'Arabic') {
        regex = /[^!@#$%^&/0-9\u0600-\u06ff\u0750-\u077f\ufb50-\ufbc1\ufbd3-\ufd3f\ufd50-\ufd8f\ufd50-\ufd8f\ufe70-\ufefc\uFDF0-\uFDFD]/g;
    }
    const e = event.clipboardData;
    const pasteData = event.clipboardData.getData('text/plain');
    let m;
    let matches = 0;
    while ((m = regex.exec(pasteData)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            matches++;
        });
    }
    if (matches === pasteData.length) {
        return;
    } else {
      event.preventDefault();
    }
}

checkarabicOnly(event: KeyboardEvent) {
    if (event.key === 'Tab' || event.key === 'TAB') {
      return;
    }
    const ch = String.fromCharCode(event.keyCode);
    const regEx = new RegExp(this.arabicRegex);
    if (regEx.test(ch)) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
  
 
  }
  englishOnly(event: KeyboardEvent){
    if (event.key === 'Tab' || event.key === 'TAB') {
      return;
    }
  
   
    const ch = String.fromCharCode(event.keyCode);
   
    const regEx = new RegExp(this.englishRegex);
    
    if (regEx.test(ch)) {
      
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    
  }


}