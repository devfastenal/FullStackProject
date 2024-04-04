import { Component, OnDestroy, OnInit } from '@angular/core';
import { BranchService } from '../branch.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrl: './branch-list.component.css'
})
export class BranchListComponent {
  search: string = "";

  constructor(public branchService: BranchService, private router: Router) { }

  isActive(code: string): boolean {
    const currentUrl = this.router.url;
    const urlSegments = currentUrl.split('/');
    const matchedCode = urlSegments.find(segment => segment === code);
    if (matchedCode == null)
      return false;
    return true;
  }

  isStatusClose(status: string): boolean {
    if (status === "Close") {
      return true;
    }
    return false;
  }

  isPrefix(str: string) {
    var temp = this.search.toUpperCase();
    if (temp.length > str.length)
      return false;
    var i = 0;
    while (i < temp.length && temp.charAt(i) === str.charAt(i))
      i++;
    if (i < temp.length)
      return false;
    return true;
  }

  isAnyBranchPrefix() {
    if (this.branchService === undefined || this.branchService.branches === undefined)
      return true;
    return this.branchService.branches.some(branch => this.isPrefix(branch.buCode));
  }
}
