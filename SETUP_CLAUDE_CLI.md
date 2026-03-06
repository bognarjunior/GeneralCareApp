# 🤖 Configuração do Claude Code CLI - GeneralCareApp

Este guia explica como configurar e usar o Claude Code CLI no projeto GeneralCareApp.

---

## 📋 Pré-requisitos

1. ✅ Claude Code CLI instalado
2. ✅ Projeto GeneralCareApp clonado localmente
3. ✅ Node.js e dependências instaladas

---

## 🚀 Instalação dos Arquivos de Configuração

### 1️⃣ Criar a pasta de configuração

Na raiz do projeto GeneralCareApp:

```bash
mkdir -p .claude
```

### 2️⃣ Criar arquivo de configuração

Crie o arquivo `.claude/claude_code_config.yaml` com o conteúdo fornecido no artifact "claude_code_config.yaml".

### 3️⃣ Criar arquivo de ignore

Crie o arquivo `.claudeignore` na raiz do projeto com o conteúdo fornecido no artifact ".claudeignore".

### 4️⃣ Estrutura final

```
GeneralCareApp/
├── .claude/
│   └── claude_code_config.yaml
├── .claudeignore
├── src/
├── android/
├── ios/
└── ...
```

---

## 🎯 Como Usar o Claude Code CLI

### Iniciar o Claude Code

Na raiz do projeto:

```bash
claude-code
```

O CLI vai:

- ✅ Ler automaticamente `.claude/claude_code_config.yaml`
- ✅ Respeitar as regras de arquitetura
- ✅ Ignorar arquivos listados em `.claudeignore`
- ✅ Aplicar padrões de código definidos

---

## 💡 Exemplos de Uso

### Criar um novo hook

```
Você: Crie um hook useBloodPressure para controle de pressão arterial
```

Claude vai:

- Criar `src/hooks/useBloodPressure.ts` seguindo o padrão
- Criar `src/hooks/useBloodPressure.test.ts` com testes
- Seguir a arquitetura Screen→Hook→Repository
- Aplicar tipagem TypeScript estrita
- Usar o padrão de filtros e paginação

### Refatorar código existente

```
Você: Refatore o componente GlycemiaCard para melhorar performance
```

Claude vai:

- Analisar o código atual
- Aplicar React.memo se necessário
- Memoizar callbacks com useCallback
- Manter estilos separados
- Preservar testes existentes

### Criar tela completa

```
Você: Crie a tela de controle de medicamentos com lista, filtros e formulário
```

Claude vai criar:

```
src/screens/Medications/
  ├── index.tsx          # Tela principal
  ├── styles.ts          # Estilos
  └── components/
      └── FormSheet/
          ├── index.tsx
          └── styles.ts

src/hooks/
  ├── useMedications.ts
  └── useMedications.test.ts

src/repositories/
  ├── medicationsRepository.ts
  └── medicationsRepository.test.ts
```

---

## 🎨 Padrões Aplicados Automaticamente

### ✅ Arquitetura em Camadas

```
Screen (UI)
   ↓ usa
Hook (Business Logic)
   ↓ usa
Repository (Data Access)
   ↓ usa
Storage (Persistence)
```

### ✅ Estrutura de Componentes

```typescript
// Sempre estrutura completa:
import React from 'react';
import { View } from 'react-native';
import styles from './styles';
import type { Props } from '@/types/components/MyComponent';

const MyComponent: React.FC<Props> = ({ ... }) => {
  return <View style={styles.container}>...</View>;
};

export default MyComponent;
```

### ✅ Estilos Separados

```typescript
// styles.ts
import { StyleSheet } from 'react-native';
import theme from '@/theme';

export default StyleSheet.create({
  container: {
    padding: theme.spacing.md, // NUNCA hardcoded
    backgroundColor: theme.colors.background,
  },
});
```

### ✅ Hooks com Testes

```typescript
// useGlycemia.ts
export function useGlycemia(personId: string) {
  // implementação
}

// useGlycemia.test.ts
describe('useGlycemia', () => {
  it('should load items on mount', async () => {
    // testes obrigatórios
  });
});
```

---

## 📊 Verificações de Qualidade

O Claude sempre vai verificar:

- ✅ **Tipagem**: Sem `any`, tipos explícitos
- ✅ **Estilos**: Sempre em arquivo separado
- ✅ **Tema**: Uso de variáveis do tema
- ✅ **Imports**: Ordem padronizada
- ✅ **Testes**: Mínimo 80% de cobertura
- ✅ **Arquitetura**: Respeito às camadas

---

## 🚨 Anti-Padrões Evitados

Claude NÃO vai gerar código com:

- ❌ Business logic em screens
- ❌ Estilos inline
- ❌ Hardcoded colors/spacing
- ❌ AsyncStorage direto fora do storage layer
- ❌ Código sem testes
- ❌ Uso de `any`
- ❌ Class components

---

## 🔧 Comandos Úteis

### Pedir refatoração com padrões

```
Você: Refatore este arquivo seguindo os padrões do projeto
[cole o código]
```

### Criar componente completo

```
Você: Crie um componente MedicationCard que mostra nome, dosagem e horário
```

### Adicionar testes

```
Você: Adicione testes completos para o hook useMeasurements
```

### Revisar código

```
Você: Revise este código e aponte violações dos padrões
[cole o código]
```

---

## 📝 Notas Importantes

1. **Conteúdo Completo**: Claude sempre fornece arquivos completos, nunca com `// ... rest of code`

2. **Explicações**: Toda mudança vem com explicação do porquê

3. **Patterns**: Todos os patterns do projeto são aplicados automaticamente

4. **Consistência**: Código gerado é consistente com o resto da base

---

## 🎓 Principais Patterns do Projeto

### Filter & Pagination Pattern

```typescript
export type Filter = 'all' | 'today' | '7d' | '30d' | '90d';

const { items, filter, setFilter, loadMore, hasMore } = useGlycemia(personId);
```

### Repository Pattern

```typescript
// CRUD padronizado
export async function list(personId: string): Promise<T[]>;
export async function create(input: Omit<T, 'id'>): Promise<T>;
export async function update(
  personId: string,
  id: string,
  patch: Partial<T>,
): Promise<T | null>;
export async function remove(personId: string, id: string): Promise<boolean>;
```

### Date Handling Pattern

```typescript
// Sempre ISO format
dateISO: '2025-03-04T11:42:00.000Z';

// Formatação via utils
import { formatDate } from '@/utils/formatters';
```

---

## 🎉 Pronto!

Agora é só usar o Claude Code CLI e todo código gerado vai seguir automaticamente os padrões do GeneralCareApp! 🚀

Para começar:

```bash
cd GeneralCareApp
claude-code
```

E pergunte o que precisar! 😊
