import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../Student.service';

@Component({
    templateUrl: 'StudentCompumption.html',
})
export class StudentCompumptionComponent implements OnInit {

    constructor(
        public studentSerice: StudentService,
        private router: Router,
        private route: ActivatedRoute
    ) {

    }

    ngOnInit(): void {

    }

    Return() {
        let id = this.route.snapshot.paramMap.get('id');
        this.router.navigate(['../../', id], { relativeTo: this.route });
    }

}