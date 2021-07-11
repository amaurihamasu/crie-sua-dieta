import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'componente-modal',
    templateUrl: 'componente-modal.html',
    styleUrls: ['componente-modal.css'],
})
export class ModalCaloriasMacronutrientes {

    CALORIAS_POR_GRAMA_PROTEINA = 4;

    CALORIAS_POR_GRAMA_CARBOIDRATOS = 4;

    CALORIAS_POR_GRAMA_GORDURA = 9;

    quantidadeRefeicoesSelecionada: number = 3;

    porcentagemProteinaPorRefeicao: number = 40;

    porcentagemGorduraPorRefeicao: number = 20;

    porcentagemCarboidratoPorRefeicao: number = 40;

    totalCaloriasNoDia: number = 1200;

    valorCalculadoCaloriasPorRefeicao: number;

    refeicoes: any[] = [{
        descricao: '3 Refeições',
        valor: 3
    },
    {
        descricao: '4 Refeições',
        valor: 4
    },
    {
        descricao: '5 Refeições',
        valor: 5
    },
    {
        descricao: '6 Refeições',
        valor: 6
    }];

    constructor(public modal: MatDialogRef<ModalCaloriasMacronutrientes>) {
        modal.disableClose = true;
    }

    obterTotalCaloriasPorRefeicao = () => this.totalCaloriasNoDia / this.quantidadeRefeicoesSelecionada;

    calcularValorCaloriasPorPorcentagem = (porcentagem: number) => (this.obterTotalCaloriasPorRefeicao() * porcentagem) / 100;

    calcularValorCaloriasPorPorcentagemProteina = () => this.calcularValorCaloriasPorPorcentagem(this.porcentagemProteinaPorRefeicao);

    calcularValorCaloriasPorPorcentagemGordura = () => this.calcularValorCaloriasPorPorcentagem(this.porcentagemGorduraPorRefeicao);

    calcularValorCaloriasPorPorcentagemCarboidrato = () => this.calcularValorCaloriasPorPorcentagem(this.porcentagemCarboidratoPorRefeicao);

    converterValorCaloriaMacronutrienteEmGramas = (porcentagem: number, caloriasPorGrama: number) => {
        let resultado = this.calcularValorCaloriasPorPorcentagem(porcentagem);
        return resultado / caloriasPorGrama;
    };

    converterValorCaloriaProteinaEmGramas = () => this.converterValorCaloriaMacronutrienteEmGramas(this.porcentagemProteinaPorRefeicao, this.CALORIAS_POR_GRAMA_PROTEINA);

    converterValorCaloriaGorduraEmGramas = () => this.converterValorCaloriaMacronutrienteEmGramas(this.porcentagemGorduraPorRefeicao, this.CALORIAS_POR_GRAMA_GORDURA);

    converterValorCaloriaCarboidratoEmGramas = () => this.converterValorCaloriaMacronutrienteEmGramas(this.porcentagemCarboidratoPorRefeicao, this.CALORIAS_POR_GRAMA_CARBOIDRATOS);

    enviarInformacoes = () => {
        return {
            totalProteinaGramasPorRefeicao: this.converterValorCaloriaProteinaEmGramas(),
            totalGorduraGramasPorRefeicao: this.converterValorCaloriaGorduraEmGramas(),
            totalCarboidratoGramasPorRefeicao: this.converterValorCaloriaCarboidratoEmGramas(),
        };
    }

}
