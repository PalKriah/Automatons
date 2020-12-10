import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PushdownAutomatonComponent } from './pushdown-automaton/pushdown-automaton.component';

const routes: Routes = [
  { path: '', component: PushdownAutomatonComponent },
  { path: 'pushdown_automaton', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
