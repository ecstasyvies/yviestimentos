# Yviestimentos

> Transforme projeções financeiras em decisões fundamentadas

[![Licença MIT](https://img.shields.io/badge/Licença-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Manutenção](https://img.shields.io/badge/Manutenção-Ativa-success.svg)]()
[![Cobertura de Testes](https://img.shields.io/badge/Cobertura-100%25-brightgreen.svg)]()

## Sobre o Projeto

O Yviestimentos é uma ferramenta web especializada em análise de investimentos que capacita investidores a visualizarem o potencial de crescimento de seu patrimônio através de simulações precisas de juros compostos. Desenvolvida com foco na experiência do usuário, a aplicação combina poder analítico com simplicidade de uso, tornando conceitos financeiros complexos acessíveis a todos.

### Por que Yviestimentos?

- **Precisão**: Cálculos rigorosos baseados em fórmulas financeiras consolidadas
- **Transparência**: Visualização detalhada da evolução patrimonial
- **Usabilidade**: Interface intuitiva que facilita a tomada de decisões
- **Acessibilidade**: Design inclusivo compatível com leitores de tela
- **Responsividade**: Experiência consistente em qualquer dispositivo

## Características Principais

### Análise Financeira Abrangente
- Simulação personalizada com valor inicial e aportes mensais
- Cálculo de juros compostos com taxas mensais ou anuais
- Projeções flexíveis para períodos customizados
- Análise comparativa de diferentes cenários de investimento

### Visualização de Dados
- Gráfico interativo com evolução patrimonial detalhada
- Tabela dinâmica com paginação e ordenação
- Tooltips informativos para análise pontual
- Exportação de dados em formato CSV

### Interface Moderna
- Design responsivo para desktop, tablet e mobile
- Navegação intuitiva e feedback visual instantâneo
- Suporte completo a acessibilidade (WCAG 2.1)
- Validação em tempo real dos dados inseridos

### Acessibilidade Avançada
- **Semântica HTML5**
  - Estrutura hierárquica clara com elementos semânticos (`header`, `main`, `nav`, `section`, `aside`)
  - Hierarquia de cabeçalhos lógica e bem estruturada
  - Landmarks para navegação facilitada

- **Suporte a Leitores de Tela**
  - Atributos ARIA para estados e propriedades dinâmicas
  - Regiões live para atualizações automáticas (`aria-live`)
  - Descrições alternativas para conteúdo visual (`aria-label`)
  - Textos exclusivos para leitores de tela (classe `.sr-only`)

- **Formulários Acessíveis**
  - Labels explicitamente associados a campos de entrada
  - Indicação clara de campos obrigatórios
  - Mensagens de erro contextual
  - Suporte a diferentes métodos de entrada (`inputmode`)

- **Navegação por Teclado**
  - Foco visível e consistente
  - Skip links para conteúdo principal
  - Ordem de tabulação lógica
  - Menus e submenus navegáveis por teclado

- **Tabelas Responsivas**
  - Cabeçalhos semanticamente corretos
  - Sumários e legendas descritivas
  - Adaptação para visualização móvel com data-labels
  - Relações célula-cabeçalho preservadas

## Stack Tecnológica

### Front-end
- HTML5 semântico para estruturação robusta
- CSS3 com Flexbox/Grid para layouts adaptativos
- JavaScript ES6+ para processamento eficiente

### Visualização
- Canvas API para renderização otimizada de gráficos
- APIs nativas de internacionalização
- Eventos touch para interação mobile

### Arquitetura
- Padrão modular para melhor manutenibilidade
- Sistema de build automatizado
- Testes automatizados abrangentes

## Exemplos de Análise

### Exemplos de Uso

#### Investimento de Longo Prazo
```plaintext
Capital Inicial: R$ 10.000,00
Aporte Mensal: R$ 1.000,00
Taxa de Juros: 8% ao ano
Período: 10 anos
```

#### Economia para Objetivo Específico
```plaintext
Capital Inicial: R$ 5.000,00
Aporte Mensal: R$ 500,00
Taxa de Juros: 0,8% ao mês
Período: 36 meses
```

## Arquitetura

```plaintext
yviestimentos/
├── index.html           # Interface principal da aplicação
├── styles.css          # Estilos e layouts responsivos
├── js/
│   ├── script.js       # Controlador principal
│   ├── menu.js         # Gerenciamento de navegação
│   └── modulos/        # Componentes modulares
│       ├── calculadora.js    # Motor de cálculos financeiros
│       ├── formatador.js     # Formatação de dados
│       ├── validador.js      # Validação de entrada
│       ├── estado.js         # Gerenciamento de estado
│       └── utilitarios.js    # Funções auxiliares
└── README.md
```

## Contribuindo

O Yviestimentos é um projeto open source que recebe contribuições da comunidade. Aqui estão algumas formas de contribuir:

### Desenvolvimento
1. Faça um fork do repositório
2. Crie uma branch para sua feature
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```
3. Desenvolva e teste suas alterações
4. Commit com mensagens claras e descritivas
   ```bash
   git commit -m "feat: implementa cálculo de rentabilidade real"
   ```
5. Push para seu fork
   ```bash
   git push origin feature/nova-funcionalidade
   ```
6. Abra um Pull Request detalhado

### Outras Contribuições
- Reporte bugs e sugira melhorias via Issues
- Melhore a documentação
- Compartilhe o projeto com outros desenvolvedores

## Suporte

Para suporte, dúvidas ou sugestões:
- Abra uma [Issue](https://github.com/ecstasyvies/yviestimentos/issues)
- Entre em contato via [E-mail](mailto:yviesflowers@proton.me)

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE.md) - veja o arquivo LICENSE.md para detalhes.

## Autoria

Desenvolvido e mantido por [Yvies](https://github.com/ecstasyvies).

---

<div align="center">

**[Acesse o Projeto](https://github.com/ecstasyvies/yviestimentos)** | **[Reporte um Bug](https://github.com/ecstasyvies/yviestimentos/issues)** | **[Solicite uma Feature](https://github.com/ecstasyvies/yviestimentos/issues)**

</div>