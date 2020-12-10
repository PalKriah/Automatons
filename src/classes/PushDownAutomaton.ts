import { Stack } from "./Stack";

export class PushDownAutomaton {
    private stack: Stack<string>;
    private startSymbol: string;
    private expression: string;
    private grammar: LambdaGrammar[] | TableGrammar;
    private useTable: boolean;
    public accepted: boolean;
    public steps: AutomatonStep[] = [];

    public constructor(startSymbol: string, expression: string, grammar: LambdaGrammar[] | TableGrammar, useTable: boolean) {
        this.stack = new Stack<string>();
        this.startSymbol = startSymbol;
        this.useTable = useTable;
        this.grammar = grammar;
        this.expression = expression + "#";
        this.accepted = this.validate();
    }

    private validate(): boolean {
        this.stack.push("#");
        this.stack.push(this.startSymbol);

        let index: number = 0;

        while (this.stack.peek() != "#") {
            let pointer: CellPointer = {
                terminalSymbol: this.expression[index],
                nonTerminalSymbol: this.stack.peek()
            };

            let nextStep: AutomatonStep = {
                inputReminder: this.expression.substr(index, this.expression.length),
                stack: this.stack.toListCopy(),
                next: null
            }

            if (pointer.nonTerminalSymbol == pointer.terminalSymbol) {
                nextStep.next = ["pop"];
                this.steps.push(nextStep);
                this.stack.pop();
                index++;
                continue;
            }

            let content: string[];

            if (this.useTable) {
                content = this.getNextStepTable(pointer);
            }
            else {
                content = this.getNextStepGrammar(pointer);
            }

            if (content == null) {
                break;
            }

            this.stack.pop();
            for (let j = content.length - 1; j >= 0; j--) {
                this.stack.push(content[j]);
            }

            nextStep.next = content;
            this.steps.push(nextStep);
        }

        if (this.expression[index] == "#" && this.stack.peek() == "#") {
            let nextStep: AutomatonStep = {
                inputReminder: this.expression.substr(index, this.expression.length),
                stack: this.stack.toListCopy(),
                next: ["accept"]
            }
            this.steps.push(nextStep);
            return true;
        }
        let nextStep: AutomatonStep = {
            inputReminder: this.expression.substr(index, this.expression.length),
            stack: this.stack.toListCopy(),
            next: ["reject"]
        }
        this.steps.push(nextStep);
        return false;
    }

    private getNextStepTable(pointer: CellPointer): string[] | null {
        let grammarTable = this.grammar as TableGrammar;
        let x = grammarTable.nonterminalSymbols.findIndex(symbol => symbol == pointer.nonTerminalSymbol);
        let y = grammarTable.terminalSymbols.findIndex(symbol => symbol == pointer.terminalSymbol);
        return grammarTable.cells[x][y];
    }

    private getNextStepGrammar(pointer: CellPointer): string[] | null {
        let grammarRules = this.grammar as LambdaGrammar[];
        for (let i = 0; i < grammarRules.length; i++) {
            if (pointer.nonTerminalSymbol == grammarRules[i].pointer.nonTerminalSymbol &&
                pointer.terminalSymbol == grammarRules[i].pointer.terminalSymbol) {
                return grammarRules[i].content;
            }
        }
        return null;
    }
}

export interface CellPointer {
    terminalSymbol: string;
    nonTerminalSymbol: string;
}

export interface LambdaGrammar {
    pointer: CellPointer;
    content: string[];
}

export interface TableGrammar {
    terminalSymbols: string[];
    nonterminalSymbols: string[];
    cells: string[][][];
}

export interface AutomatonStep {
    inputReminder: string;
    stack: string[];
    next: string[];
}