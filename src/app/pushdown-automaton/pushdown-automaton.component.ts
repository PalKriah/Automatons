import { Component, OnInit } from '@angular/core';
import { faPlus, faMinus, faCheckCircle, faShareSquare, faBookOpen, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { AutomatonStep, LambdaGrammar, PushDownAutomaton, TableGrammar } from 'src/classes/PushDownAutomaton';

@Component({
  selector: 'app-pushdown-automaton',
  templateUrl: './pushdown-automaton.component.html',
  styleUrls: ['./pushdown-automaton.component.css']
})
export class PushdownAutomatonComponent implements OnInit {

  faPlus = faPlus;
  faMinus = faMinus;
  faCheckCircle = faCheckCircle;
  faShareSquare = faShareSquare;
  faBookOpen = faBookOpen;
  faTimesCircle = faTimesCircle;

  save: boolean = true;
  showGrammar: boolean = true;
  useTable: boolean = true;
  convertNumber: boolean = true;

  terminalSymbolCount: number = 5;
  nonterminalSymbolCount: number = 5;

  startSymbol: string = "S";
  epsilonSymbol: string = "e";
  converNumberTo: string = "i";

  terminalSymbols: string[] = [];
  nonterminalSymbols: string[] = [];
  cells: string[][] = [];

  savedGrammar: LambdaGrammar[] | TableGrammar;

  expression: string;
  result: boolean = null;
  resultSteps: AutomatonStep[];

  constructor() { }

  ngOnInit(): void {
    this.nonterminalSymbols[0] = this.startSymbol;
    for (let i = this.terminalSymbols.length; i < this.terminalSymbolCount + this.nonterminalSymbolCount; i++) {
      this.cells[i] = [];
    }

    this.loadDefault();
  }

  adjustTable() {
    this.save = true;
    if (this.terminalSymbolCount > 15) {
      this.terminalSymbolCount = 15;
    }

    this.terminalSymbols = this.terminalSymbols.slice(0, this.terminalSymbolCount);
    this.nonterminalSymbols = this.nonterminalSymbols.slice(0, this.nonterminalSymbolCount);

    if (this.cells.length < this.terminalSymbolCount + this.nonterminalSymbolCount) {
      for (let i = this.cells.length; i < this.terminalSymbolCount + this.nonterminalSymbolCount; i++) {
        this.cells[i] = [];
      }
    }
    else {
      this.cells = this.cells.slice(0, this.terminalSymbolCount + this.nonterminalSymbolCount);
      this.cells.forEach((cell, index) => {
        this.cells[index] = this.cells[index].slice(0, this.terminalSymbolCount + 1);
      });
    }
  }

  saveGrammar() {
    this.save = false;
    let nonTerminalLength: number = 1;
    this.nonterminalSymbols.forEach(symbol => {
      nonTerminalLength = symbol.length > nonTerminalLength ? symbol.length : nonTerminalLength;
    });

    // Validation

    if (this.useTable) {
      this.saveAsTable(nonTerminalLength);
    }
    else {
      this.saveAsLambda(nonTerminalLength);
    }

    // console.log(this.savedGrammar);
  }

  saveAsTable(nonTerminalLength: number) {
    let cells: string[][][] = [];
    for (let i = 0; i < this.nonterminalSymbolCount; i++) {
      cells[i] = [];
      for (let j = 0; j < this.terminalSymbolCount + 1; j++) {
        if (this.cells[i][j] == null) {
          cells[i][j] = null;
        }
        else if (this.cells[i][j] == this.epsilonSymbol) {
          cells[i][j] = [];
        }
        else {
          cells[i][j] = this.getSteps(this.cells[i][j], nonTerminalLength);
        }
      }
    }

    this.savedGrammar = {
      terminalSymbols: this.terminalSymbols.concat("#"),
      nonterminalSymbols: this.nonterminalSymbols,
      cells: cells
    };
  }

  saveAsLambda(nonTerminalLength: number) {
    this.savedGrammar = [];

    for (let i = 0; i < this.nonterminalSymbolCount; i++) {
      for (let j = 0; j < this.terminalSymbolCount + 1; j++) {
        if (this.cells[i][j] != null) {
          let content: string[];
          if (this.cells[i][j] == this.epsilonSymbol) {
            content = [];
          }
          else {
            content = this.getSteps(this.cells[i][j], nonTerminalLength);
          }

          let lambdaExpr: LambdaGrammar = {
            pointer: {
              terminalSymbol: j == this.terminalSymbolCount ? "#" : this.terminalSymbols[j],
              nonTerminalSymbol: this.nonterminalSymbols[i]
            },
            content: content
          };

          this.savedGrammar.push(lambdaExpr);
        }
      }
    }
  }

  getSteps(string: string, nonTerminalLength: number): string[] {
    let index: number = 0;
    let list: string[] = [];

    while (index != string.length) {
      let lookAhead: number = string.length - index > nonTerminalLength ? nonTerminalLength : string.length - index;
      for (let i = lookAhead; i > 0; i--) {
        let substring = string.substr(index, i);
        if (this.nonterminalSymbols.includes(substring) || this.terminalSymbols.includes(substring)) {
          list.push(substring);
          index += substring.length;
          break;
        }
      }
    }
    return list;
  }

  validateExpression() {
    let newExpression: string = this.convertNumber ? this.expression.replace(new RegExp("[0-9]+", 'g'), this.converNumberTo) : this.expression;
    let pushdownAutomaton: PushDownAutomaton = new PushDownAutomaton(this.startSymbol, newExpression, this.savedGrammar, this.useTable);
    this.result = pushdownAutomaton.accepted;
    this.resultSteps = pushdownAutomaton.steps;
  }

  getResult() {
    if (this.result == null) {
      return '';
    }
    return this.result ? 'is-valid' : 'is-invalid';
  }

  loadDefault() {
    this.terminalSymbols = ["+", "*", "(", ")", "i"];
    this.nonterminalSymbols = ["S", "S'", "T", "T'", "F"];

    this.cells = [
      [null, null, "TS'", null, "TS'", null],
      ["+TS'", null, null, this.epsilonSymbol, null, this.epsilonSymbol],
      [null, null, "FT'", null, "FT'", null],
      [this.epsilonSymbol, "*FT'", null, this.epsilonSymbol, null, this.epsilonSymbol],
      [null, null, "(S)", null, "i", null]
    ]

    this.expression = "(i+i)*i"
  }
}
