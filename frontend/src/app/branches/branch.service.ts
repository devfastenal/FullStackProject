import { Injectable } from "@angular/core";
import { Branch, CreateBranch } from "./branch.model";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { NgForm } from "@angular/forms";

@Injectable({ providedIn: 'root' })
export class BranchService {
    public branches: Branch[];

    constructor(private http: HttpClient) { }

    loadBranches() {
        return this.http.get<Branch[]>('https://localhost:7207/api/Branches');
    }

    getBranch(code: string) {
        var index = this.branches.findIndex(x => x.buCode === code);
        return this.branches[index];
    }

    addBranch(branch: CreateBranch) {
        return this.http.post('https://localhost:7207/api/Branches', branch);
    }

    updateBranch(Id: number, code: string, businessHours: string, form: NgForm) {
        return this.http.put('https://localhost:7207/api/Branches/' + Id, {
            id: Id,
            buCode: code,
            status: form.value.status,
            address: form.value.address,
            phone: form.value.phone,
            businessHours: businessHours
        });
    }
}