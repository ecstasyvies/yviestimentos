# Yviestimentos - Calculadora de Juros Compostos

[Licença: CC BY 4.0]
[Versão: 1.0.0]

Calculadora web simples e responsiva para simular investimentos com juros compostos, focada em usabilidade, acessibilidade e visualização clara dos dados.

## Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Requisitos](#requisitos)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Exemplos](#exemplos)
- [Estrutura](#estrutura)
- [Contribuição](#contribuição)
- [Licença](#licença)
- [Contato](#contato)

## Visão Geral

Yviestimentos ajuda investidores a calcular e visualizar projeções de investimentos com juros compostos, oferecendo uma interface intuitiva e recursos visuais para planejamento financeiro.

## Funcionalidades

- Cálculo de juros compostos com valor inicial, aportes mensais, taxa mensal ou anual, e período personalizado
- Gráfico interativo e tabela detalhada com paginação
- Exportação dos dados para CSV
- Layout responsivo e otimizado para dispositivos móveis
- Design acessível e suporte a gestos touch

## Tecnologias

- HTML5, CSS3 (Flexbox/Grid)
- JavaScript (ES6+)
- Canvas API para gráficos
- Intl.LocaleString para formatação monetária

## Requisitos

Navegador moderno com suporte a JavaScript ES6+, CSS Flexbox/Grid, Canvas API e Local Storage.

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/ecstasyvies/yviestimentos.git
```

2. Navegue até o diretório do projeto:
```bash
cd yviestimentos
```

3. Inicie um servidor local. Por exemplo, usando Python:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

4. Acesse a aplicação no navegador:
```
http://localhost:8000
```

## Como Usar

1. Preencha o valor inicial (obrigatório), aporte mensal (opcional), taxa de juros e período.
2. Escolha o tipo de taxa (mensal ou anual) e o tipo de período (meses ou anos).
3. Clique em "Calcular" para ver o resultado, gráfico e tabela.
4. Use o botão "Exportar CSV" para baixar os dados, navegue na tabela e interaja com o gráfico.

## Exemplos

- Valor inicial: R$ 1.000,00 | Juros: 1% ao mês | Período: 12 meses | Resultado: R$ 1.126,82
- Valor inicial: R$ 5.000,00 | Aporte mensal: R$ 500,00 | Juros: 12% ao ano | Período: 5 anos | Resultado: R$ 46.914,91

## Estrutura

```
yviestimentos/
├── index.html
├── styles.css
├── script.js
├── menu.js
└── README.md
```

## Contribuição

1. Faça um fork
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Descrição'`)
4. Push para sua branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

Mantenha o código limpo, documentado e teste antes de enviar.

## Licença

Licenciado sob Creative Commons Attribution 4.0 International. Veja [LICENSE](https://creativecommons.org/licenses/by/4.0/).

## Contato

Yvies — [E-mail](mailto:yviesflowers@proton.me)
[GitHub](https://github.com/ecstasyvies/yviestimentos)

---

Desenvolvido por [Yvies](https://colorid.es/@yvies)