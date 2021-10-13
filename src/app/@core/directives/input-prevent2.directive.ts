import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[appInput2Prevent]"
})
export class Input2PreventDirective {
  constructor(private _el: ElementRef) {
    // regex
  }

  arabicRegex = /[^!@#$%^&/0-9\u0600-\u06ff\u0750-\u077f\ufb50-\ufbc1\ufbd3-\ufd3f\ufd50-\ufd8f\ufd50-\ufd8f\ufe70-\ufefc\uFDF0-\uFDFD ]/g;
  englishRegex = /[^!@#$%^&/A-Za-z1-9 ]/g;
  @Input("appInput2Prevent") appInput2Prevent: string = "";

  @HostListener("keypress", ["$event"]) onKeyPress(event: KeyboardEvent) {
    this.checkLetters(event);
  }

  @HostListener("paste", ["$event"]) onPaste(event: any) {
    let regex = this.englishRegex;
    if (this.appInput2Prevent === "Arabic") {
      regex = this.arabicRegex;
    }
    const pasteData = event.clipboardData.getData("text/plain");
    let m;
    let matches = "";

    while ((m = regex.exec(pasteData)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        matches += match;
      });
      // now stop event and add add just new value
      event.preventDefault();
      this._el.nativeElement.value = matches;
    }
  }

  checkLetters(event: KeyboardEvent) {
    let regEx = new RegExp(this.arabicRegex);
    if (event.key.toLocaleLowerCase() == "tab") {
      return;
    }
    const ch = String.fromCharCode(event.keyCode);
    // This is to know value appInput2Prevent what will Prevent
    if (this.appInput2Prevent === "English") {
      regEx = new RegExp(this.arabicRegex);
    } else {
      regEx = new RegExp(this.englishRegex);
    }
    if (regEx.test(ch)) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
  }
}
